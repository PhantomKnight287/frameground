Server Components render once, on the server, and send HTML. There is no state to update and no
browser to click in. For the parts of your UI that *are* interactive, you opt back in:

```jsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

`"use client"` must be the **first line of the file**, above the imports. It does not mean
"render only in the browser" - the component is still prerendered to HTML on the server. It means
"this component's JavaScript is also sent to the browser, so it can hydrate and become
interactive".

# The boundary is contagious downwards

`"use client"` marks an entry point. Every component *imported by* a Client Component is part of
the client bundle too, whether or not it has the directive. You do not repeat it in every file -
you put it at the top of the interactive subtree.

Which is why you push it **as far down as possible**. A layout marked `"use client"` because of
one dropdown menu drags the entire page into the browser bundle.

## Client Components can still render Server Components

Not by importing them - by receiving them as `children`:

```jsx
// app/page.jsx - a Server Component
<Sidebar>            {/* client: handles the open/closed state */}
  <PostList />       {/* server: still fetches on the server */}
</Sidebar>
```

The page is a Server Component, so it renders `<PostList />` on the server and passes the result
to `Sidebar` as a prop. `Sidebar` never imports it, so it never pulls it into the bundle. This
one pattern solves most "but I need a client wrapper" problems.

<Callout type="warn" title="Careful">
Props crossing the boundary are serialised, so they must be serialisable: strings, numbers,
plain objects, arrays - and JSX. A function (other than a Server Action), a `Date`, a class
instance or a database handle will throw.
</Callout>

# The navigation hooks

The App Router's hooks live in `next/navigation`, and they are client-only:

| Hook                 | Gives you                                              |
| -------------------- | ------------------------------------------------------ |
| `useRouter()`        | `push`, `replace`, `refresh`, `back`                   |
| `usePathname()`      | the current path, as a string                          |
| `useSearchParams()`  | the query string, as a read-only `URLSearchParams`      |
| `useParams()`        | the dynamic segments of the current route               |

```jsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <form onSubmit={(event) => { event.preventDefault(); router.push("/search?q=..."); }}>
      <input defaultValue={params.get("q") ?? ""} />
    </form>
  );
}
```

<Callout type="info" title="Note">
`useRouter` from `next/router` is the Pages Router hook and throws in `app/`. In the App Router
it is always `next/navigation`.
</Callout>

# Challenge

Both components go in `components/`, and both need the directive.

- `components/counter.jsx` - default export a `Counter` taking a `start` prop that defaults to
  `0`. Render a `span` with id `count` containing the current count, a `button` with id
  `increment` and text `+` that adds one, and a `button` with id `reset` and text `Reset` that
  puts the count back to `start`.

- `components/search-input.jsx` - default export a `SearchInput` rendering a `form` with id
  `search-form` containing an `input` with id `q`. The input starts with the current `q` search
  param (or an empty string). Submitting the form must not reload the page, and must call
  `router.push` with `/search?q=<the input's value>`.
