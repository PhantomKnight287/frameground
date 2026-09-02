You are not going to create `pages/products/1.jsx`, `pages/products/2.jsx` and so on. When the
URL contains a value - an id, a slug, a username - you put **brackets in the filename**.

```txt
pages/products/[id].jsx     ->  /products/1, /products/42, /products/anything
```

The bracketed part is a **dynamic segment**, and its value arrives in `router.query` under the
name you used in the filename.

```jsx
import { useRouter } from "next/router";

export default function Product() {
  const router = useRouter();
  const { id } = router.query;
  return <h1>Product {id}</h1>;
}
```

# Catch-all segments

One dynamic segment matches exactly one URL segment. `[...slug]` matches **one or more**, and
hands you an array:

```txt
pages/docs/[...slug].jsx
  /docs/routing            ->  { slug: ["routing"] }
  /docs/api/create-user    ->  { slug: ["api", "create-user"] }
  /docs                    ->  404
```

Wrap it in a second pair of brackets - `[[...slug]].jsx` - to make it **optional**, and `/docs`
matches too, with `slug` left `undefined`.

| Filename            | Matches                    | `router.query.slug`     |
| ------------------- | -------------------------- | ----------------------- |
| `[slug].jsx`        | `/docs/a`                  | `"a"`                   |
| `[...slug].jsx`     | `/docs/a`, `/docs/a/b`     | `["a"]`, `["a", "b"]`   |
| `[[...slug]].jsx`   | `/docs`, `/docs/a/b`       | `undefined`, `["a","b"]`|

<Callout type="warn" title="Careful">
A static file always wins over a dynamic one. With both `pages/products/new.jsx` and
`pages/products/[id].jsx`, the URL `/products/new` renders the static page - which is usually
exactly what you want for a "create" screen.
</Callout>

## `router.query` is empty on the first render

On a statically optimised page the server does not know the URL parameters, so the very first
client render sees `router.query` as `{}`, and the real values arrive a tick later. Guard for
it:

```jsx
const { id } = router.query;
if (!id) return <p>Loading...</p>;
```

`router.isReady` tells you the same thing more explicitly. Later in this track you will fetch
these values on the server with `getServerSideProps`, and the problem disappears entirely.

# Challenge

- `pages/products/[id].jsx` - default export a component that reads `id` from `router.query`.
  While `id` is missing, render a `p` with id `loading` containing `Loading...`. Once it is
  there, render an `h1` with id `title` containing `Product <id>`.

- `pages/docs/[...slug].jsx` - default export a component that reads the `slug` array from
  `router.query` and renders:
  - an `h1` with id `title` containing the segments joined with ` / ` (space, slash, space)
  - a `p` with id `depth` containing the number of segments

  While `slug` is missing, render a `p` with id `loading` containing `Loading...`.
