Creating a post used to mean: build an API route, write a `fetch` in the browser, serialise the
body, handle the response, remember to update the cache. Server Actions collapse all of that into
a function you can hand to a `<form>`.

```js
// app/actions.js
"use server";

export async function createPost(formData) {
  const title = formData.get("title");
  await db.post.create({ title });
}
```

```jsx
<form action={createPost}>
  <input name="title" />
  <button>Create</button>
</form>
```

The function runs **on the server**. Next.js generates the endpoint, the request and the
serialisation for you. Because it is a real form with a real action, it works before React has
hydrated - a submit during that window is queued and replayed.

`"use server"` at the top of a file marks every export as an action. Inside a Server Component
you can also mark a single function by putting the directive on its first line.

<Callout type="warn" title="Careful">
Every Server Action is a public HTTP endpoint. The arguments come from the client and cannot be
trusted: validate the input and check the user is allowed to do this **inside** the action.
Hiding the button is not authorisation.
</Callout>

# Returning something to the client

An action's return value must be serialisable, and the client reads it with `useActionState`:

```jsx
"use client";

import { useActionState } from "react";
import { createPost } from "@/app/actions";

export default function PostForm() {
  const [state, formAction, isPending] = useActionState(createPost, {});

  return (
    <form action={formAction}>
      <input name="title" />
      <button disabled={isPending}>Create</button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
}
```

`useActionState` changes the action's signature: it is called with the **previous state** first,
then the form data.

```js
export async function createPost(prevState, formData) {}
```

You get back the latest returned state, a wrapped action to pass to the form, and a pending flag
for the duration of the request.

<Callout type="info" title="Note">
`useFormStatus`, read from inside a component nested in the form, gives a submit button its own
pending state without threading a prop down.
</Callout>

# Finishing the job

A mutation that leaves stale data on the screen is only half done. Actions run on the server, so
the cache functions are available:

```js
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(prevState, formData) {
  const title = formData.get("title")?.trim();
  if (!title) return { error: "Title is required" };

  const post = await savePost(title);
  revalidatePath("/posts");

  return { success: true, post };
}
```

Return a validation error, or commit and revalidate. `redirect("/posts")` works here too, and
throws - so anything after it is unreachable.

# Challenge

`lib/posts.js` ships `savePost(title)`, which returns the created post.

- `app/actions.js` - a Server Action file exporting an async `createPost(prevState, formData)`
  that:
  - reads `title` from the form data and trims it
  - returns `{ error: "Title is required" }` for an empty or missing title, without saving
    anything
  - otherwise saves the post, revalidates the path `/posts`, and returns
    `{ success: true, post }`

- `components/post-form.jsx` - a Client Component that drives `createPost` with
  `useActionState`, starting from an empty object as the initial state. Render a `form` with id
  `post-form` whose action is the wrapped one, containing an `input` with id `title` and the name
  `title`, and a `button` with id `submit` and the text `Create`. When the state has an `error`,
  render it in a `p` with id `error`.
