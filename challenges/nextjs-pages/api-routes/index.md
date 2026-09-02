`pages/` is not only for pages. Any file under `pages/api/` becomes an **HTTP endpoint** that
runs on the server, never ships to the browser, and is bundled with your app.

```txt
pages/api/hello.js       ->  /api/hello
pages/api/posts.js       ->  /api/posts
pages/api/users/index.js ->  /api/users
```

The default export is a request handler:

```js
export default function handler(req, res) {
  res.status(200).json({ message: "Hello" });
}
```

# `req` and `res`

They are Node's request and response objects, with a few conveniences bolted on.

| On `req`      | What it holds                                                    |
| ------------- | ---------------------------------------------------------------- |
| `req.method`  | `"GET"`, `"POST"`, ...                                            |
| `req.query`   | search params **and** dynamic route segments                      |
| `req.body`    | the parsed body - already an object for JSON requests             |
| `req.cookies` | cookies as an object                                              |

| On `res`                  | What it does                                  |
| ------------------------- | ---------------------------------------------- |
| `res.status(code)`        | sets the status code, returns `res` to chain    |
| `res.json(data)`          | sends JSON and ends the response                |
| `res.setHeader(name, val)`| sets a response header                          |
| `res.end()`               | ends the response with no body                  |

<Callout type="info" title="Note">
Code in `pages/api/` is server-only. Secrets, database clients and API keys are safe here -
none of it is included in the client bundle.
</Callout>

# Handling more than one method

One file serves one URL, so a single handler covers every method that URL supports. Branch on
`req.method`, and answer honestly when you do not support one:

```js
export default function handler(req, res) {
  if (req.method === "GET") return res.status(200).json({ posts });

  if (req.method === "POST") {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });
    return res.status(201).json({ post: createPost(title) });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
```

Getting the status codes right matters more than it looks: `201 Created` tells the client a new
resource exists, `400` says "your request was wrong", `405` plus an `Allow` header says "this URL
exists, but not for that verb".

<Callout type="warn" title="Careful">
Send exactly one response per request. `res.json()` ends the response - calling it twice, or
falling through into a second `res.status(...)`, throws. This is why every branch above
`return`s.
</Callout>

# Challenge

The playground ships `lib/posts.js` with a `getPosts()` and a `createPost(title)` helper.

Write `pages/api/posts.js`, default exporting a handler that:

- on `GET` - responds `200` with `{ posts }`, where `posts` is the result of `getPosts()`
- on `POST` -
  - with a `title` in the body, responds `201` with `{ post }`, where `post` is the result of
    `createPost(title)`
  - with no `title`, responds `400` with `{ error: "title is required" }`
- on any other method - sets the `Allow` header to `["GET", "POST"]` and responds `405` with
  `{ error: "Method <method> not allowed" }`
