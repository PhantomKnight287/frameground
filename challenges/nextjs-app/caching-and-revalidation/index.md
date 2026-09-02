In a Server Component, `fetch` is not quite the browser's `fetch`. Next.js extends it with a
server-side cache, so the same request across many renders - and many visitors - can be answered
once.

```jsx
const response = await fetch("https://api.example.com/posts", {
  cache: "force-cache",
});
```

| Option                          | Behaviour                                              |
| ------------------------------- | ------------------------------------------------------- |
| `cache: "no-store"`             | fetch every time - the default                          |
| `cache: "force-cache"`          | cache indefinitely, until something revalidates it      |
| `next: { revalidate: 60 }`      | cache, and consider it stale after 60 seconds           |
| `next: { tags: ["posts"] }`     | cache, and label the entry so it can be purged by name  |

<Callout type="info" title="Note">
Requests are also **deduplicated within a single render**: three components fetching the same URL
while rendering one page produce one request, whatever the cache setting.
</Callout>

# Time-based revalidation

`next: { revalidate: 60 }` is ISR at the level of a single request: serve the cached response,
and once a minute let one render refresh it in the background. Set it per fetch, or for a whole
route with `export const revalidate = 60`.

The fetch-level setting is usually what you want - a page often mixes a product catalogue that
changes daily with a stock count that must be fresh.

# Tags, and revalidating on demand

A timer is a guess; a tag is precise. Label the entries:

```jsx
await fetch(url, { next: { tags: ["posts"] } });
```

Then, the moment something changes, purge everything wearing that label:

```js
import { revalidateTag } from "next/cache";

revalidateTag("posts");
```

Every cached fetch tagged `posts` is dropped, everywhere in the app. `revalidatePath("/blog")`
does the same thing by URL instead - useful when you know the page but not the fetches inside it.

<Callout type="warn" title="Careful">
Both functions only work where a request is in flight: a Route Handler or a Server Action. Call
one while rendering a component and it throws - by then the response is already being produced.
</Callout>

## Caching your own functions

`fetch` gets this for free. A database query does not - wrap it:

```js
import { unstable_cache } from "next/cache";

export const getPosts = unstable_cache(async () => db.post.findMany(), ["posts"], {
  tags: ["posts"],
  revalidate: 3600,
});
```

Same cache, same tags, same `revalidateTag` to purge it.

# Challenge

- `app/blog/page.jsx` - default export an async page that fetches
  `https://api.example.com/posts`, caching the response with a `revalidate` of `60` seconds and
  the tag `posts`. Render an `h1` with id `title` containing `Blog` and a `ul` with id `posts`,
  one `li` per post containing its `title`.

- `app/api/revalidate/route.js` - export a `POST` handler that reads a JSON body and:
  - responds `400` with `{ error: "tag is required" }` when there is no `tag`, without
    revalidating anything
  - otherwise calls `revalidateTag` with it and responds `200` with `{ revalidated: true, tag }`
