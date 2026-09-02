Your backend can live in the same project as your frontend. In the App Router, a `route.js` file
is an HTTP endpoint - and it exports one function *per method*.

```js
// app/api/posts/route.js  ->  /api/posts
export async function GET() {
  return Response.json({ posts: getPosts() });
}

export async function POST(request) {
  const body = await request.json();
  return Response.json({ post: createPost(body.title) }, { status: 201 });
}
```

Export `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD` or `OPTIONS`. A method you do not export
automatically answers `405` - you no longer write that branch yourself.

<Callout type="warn" title="Careful">
`route.js` and `page.jsx` cannot live in the same folder - both would own the same URL. Put
endpoints under `app/api/`, or in any folder that has no page.
</Callout>

# Standard web APIs

The argument is a plain `Request`, and you return a plain `Response`. No `res.status().json()`
chain - the same objects you already use with `fetch`.

```js
export async function POST(request) {
  const body = await request.json();          // parse the body yourself
  const q = new URL(request.url).searchParams.get("q");
  const auth = request.headers.get("authorization");

  return new Response("Created", { status: 201 });
}
```

`Response.json(data, init)` is the shorthand for JSON. `NextResponse` from `next/server` adds
cookie helpers and typed redirects on top, and is otherwise the same thing.

| You want                | You write                                             |
| ----------------------- | ----------------------------------------------------- |
| JSON with a status      | `Response.json(data, { status: 201 })`                |
| No content              | `new Response(null, { status: 204 })`                 |
| A header                | `Response.json(data, { headers: { "x-total": "9" } })`|
| A redirect              | `NextResponse.redirect(new URL("/", request.url))`    |

<Callout type="info" title="Note">
`204 No Content` must not carry a body - `Response.json(null, { status: 204 })` throws. Use
`new Response(null, { status: 204 })`.
</Callout>

# Dynamic segments

Same bracket folders as pages, and `params` is a promise here too. It arrives as the **second**
argument:

```js
// app/api/posts/[id]/route.js
export async function GET(request, { params }) {
  const { id } = await params;
  const post = getPost(id);

  if (!post) return Response.json({ error: "Post not found" }, { status: 404 });
  return Response.json({ post });
}
```

# Challenge

`lib/posts.js` ships `getPosts()`, `getPost(id)`, `createPost(title)` and `deletePost(id)`. Ids
are numbers; `getPost` returns `undefined` when nothing matches.

- `app/api/posts/route.js`
  - `GET` - responds `200` with `{ posts }`. With a `q` search param, only the posts whose title
    contains it, compared case-insensitively.
  - `POST` - reads a JSON body. With a `title`, responds `201` with `{ post }`; without one,
    responds `400` with `{ error: "title is required" }`.

- `app/api/posts/[id]/route.js`
  - `GET` - responds `200` with `{ post }`, or `404` with `{ error: "Post not found" }`.
  - `DELETE` - deletes the post and responds `204` with no body, or `404` with
    `{ error: "Post not found" }`.
