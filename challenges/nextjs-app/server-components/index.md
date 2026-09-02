Getting data from a server into a page usually means a loader that runs somewhere else, hands
its result to a component as props, and keeps the two in sync by hand. Server Components delete
the middleman - the component *is* on the server, so it can just ask.

```jsx
export default async function Page() {
  const posts = await getPosts();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

An `async` component. It runs on the server, awaits whatever it needs, and returns HTML. Three
consequences worth internalising:

- **Its code never reaches the browser.** Database clients, API keys, a 200KB markdown parser -
  none of it is in the bundle.
- **Data fetching is colocated.** The component that renders the posts is the component that
  fetches them. No props threaded down from a page-level loader.
- **There is no loading state.** The HTML arrives with the data already in it.

# Waterfalls

Here is the trap. This looks harmless:

```jsx
const user = await getUser(id);      // 100ms
const posts = await getPosts(id);    // 100ms  -> starts only after the first finishes
```

Two independent requests, run one after the other, 200ms total. `await` on its own line is
sequential. If the second request does not need the first one's result, start them together:

```jsx
const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);  // 100ms
```

Only chain when the second call genuinely depends on the first - fetching a user's team after
you know the team id.

## Sharing a request between components

Two components on the same page both need the current user; you do not want two queries. Wrap
the function in React's `cache`:

```jsx
import { cache } from "react";

export const getUser = cache(async (id) => db.user.find(id));
```

Within a single render pass, identical arguments are deduplicated to one call. `fetch` in the
App Router does this automatically.

<Callout type="warn" title="Careful">
Server Components cannot use `useState`, `useEffect`, `useContext` or event handlers - there is
no browser to run them in, and no state to keep. Anything interactive needs a Client Component,
which is the next challenge.
</Callout>

# Challenge

`lib/api.js` ships `getUser(id)` and `getPosts(userId)`. Each takes about 20ms.

Write `app/users/[id]/page.jsx`:

- default export an async page that awaits `params` and loads the user **and** their posts,
  starting both requests at the same time
- render:
  - an `h1` with id `name` containing the user's `name`
  - a `p` with id `email` containing the user's `email`
  - a `ul` with id `posts`, one `li` per post containing its `title`
  - when the user has no posts, a `p` with id `empty` containing `No posts yet` instead of the
    list
