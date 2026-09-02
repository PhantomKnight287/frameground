When part of a URL is a value - an id, a slug, a username - you put **brackets around the folder
name**:

```txt
app/products/[id]/page.jsx        ->  /products/42
app/docs/[...slug]/page.jsx       ->  /docs/api/create-user
app/docs/[[...slug]]/page.jsx     ->  /docs and /docs/anything
```

There is no hook to read them with. A page is a Server Component, so Next.js passes the values
in as **props**:

```jsx
export default async function Product({ params }) {
  const { id } = await params;
  return <h1>Product {id}</h1>;
}
```

# `params` and `searchParams` are promises

Both props are promises, and you `await` them. That is not ceremony: it lets Next.js start
rendering the static parts of your page before it knows the dynamic ones, and only block on the
parts that actually use them.

| Prop           | For                             | Example value                    |
| -------------- | ------------------------------- | -------------------------------- |
| `params`       | dynamic segments in the path    | `{ id: "42" }`                   |
| `params`       | a catch-all segment             | `{ slug: ["api", "create-user"] }` |
| `searchParams` | the query string                | `{ q: "next", tag: ["a", "b"] }` |

```jsx
export default async function Search({ searchParams }) {
  const { q } = await searchParams;
  return <p>Searching for {q}</p>;
}
```

<Callout type="warn" title="Careful">
A repeated search param gives you an **array**: `?q=a&q=b` arrives as `["a", "b"]`, while `?q=a`
is a plain string and no `q` at all is `undefined`. Normalise before you use it.
</Callout>

<Callout type="info" title="Note">
Reading `searchParams` makes a route dynamic - it cannot be prerendered, because the query string
is only known per request. Reading `params` does not: those values can come from
`generateStaticParams` at build time, which is a later challenge.
</Callout>

# Challenge

- `app/products/[id]/page.jsx` - default export an async page that awaits `params` and renders an
  `h1` with id `title` containing `Product <id>`.

- `app/docs/[...slug]/page.jsx` - default export an async page that awaits `params` and renders:
  - an `h1` with id `title` containing the segments joined with ` / ` (space, slash, space)
  - a `p` with id `depth` containing the number of segments

- `app/search/page.jsx` - default export an async page that awaits `searchParams`, reads `q`,
  and renders a `p` with id `query` containing `Searching for "<q>"`:
  - with no `q`, use an empty string
  - when `q` arrives as an array, use its first value
