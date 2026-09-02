API routes are files under `pages/api/`, so they follow the same routing rules as pages -
including brackets.

```txt
pages/api/posts/index.js    ->  /api/posts          the collection
pages/api/posts/[id].js     ->  /api/posts/7        one record
pages/api/[...path].js      ->  /api/anything/here  a catch-all
```

The dynamic segment shows up in `req.query`, right next to the search params:

```js
export default function handler(req, res) {
  const { id } = req.query;          // "/api/posts/7"       -> "7"
  const { fields } = req.query;      // "/api/posts/7?fields=title" -> "title"
}
```

<Callout type="warn" title="Careful">
Everything in `req.query` is a **string** (or an array of strings for catch-all segments). If
your ids are numbers, convert before comparing: `Number(id)`, or compare as strings on both
sides. `posts.find((p) => p.id === id)` with a numeric `id` silently finds nothing.
</Callout>

# One URL, several verbs

A resource URL usually supports a handful of methods, and each one has a status code that says
what happened:

| Method   | Meaning                    | Success        | Missing record |
| -------- | -------------------------- | -------------- | -------------- |
| `GET`    | read it                    | `200` + body   | `404`          |
| `PATCH`  | change part of it          | `200` + body   | `404`          |
| `DELETE` | remove it                  | `204`, no body | `404`          |

`204 No Content` is the odd one out: it must not have a body, so you end the response instead of
sending JSON.

```js
res.status(204).end();
```

## Validating first

Order your checks from cheapest to most specific: reject the method you do not support, then
look the record up, then validate the body. Each failure returns immediately, so by the time you
reach the happy path everything you need is known good.

# Challenge

`lib/posts.js` ships `getPost(id)`, `updatePost(id, title)` and `deletePost(id)`. `getPost`
returns `undefined` when nothing matches, and the ids are **numbers**.

Write `pages/api/posts/[id].js`, default exporting a handler that reads `id` from `req.query`
and:

- on `GET` -
  - responds `200` with `{ post }` when the post exists
  - responds `404` with `{ error: "Post not found" }` when it does not
- on `PATCH` -
  - responds `404` with `{ error: "Post not found" }` when the post does not exist
  - responds `400` with `{ error: "title is required" }` when the body has no `title`
  - otherwise responds `200` with `{ post }`, the updated post
- on `DELETE` -
  - responds `404` with `{ error: "Post not found" }` when the post does not exist
  - otherwise deletes it and responds `204` with no body
- on any other method - sets the `Allow` header to `["GET", "PATCH", "DELETE"]` and responds
  `405` with `{ error: "Method <method> not allowed" }`
