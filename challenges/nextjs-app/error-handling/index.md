Something in your blog section throws. Without a boundary, the error travels all the way up and
the visitor gets a blank page - navigation gone, layout gone, everything.

The App Router gives you file conventions to stop it at the right level.

# `error.jsx`

```jsx
"use client";

export default function Error({ error, reset }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

Next.js wraps the segment in an error boundary using this component. Two rules come with it:

- **It must be a Client Component.** `"use client"` at the top, always - it needs `onClick` to
  offer a retry.
- **It catches its children, not itself.** `app/blog/error.jsx` catches errors from
  `app/blog/page.jsx` and everything under it, but *not* from `app/blog/layout.jsx` - the layout
  sits above the boundary. Errors in a root layout need `app/global-error.jsx`, which replaces
  the whole document.

The two props:

| Prop      | What it is                                                          |
| --------- | ------------------------------------------------------------------- |
| `error`   | the thrown `Error`, plus a `digest` hash of the original message     |
| `reset()` | re-renders the segment, giving the failed attempt another go         |

<Callout type="warn" title="Careful">
In production, `error.message` for a server-side error is deliberately generic - the real message
stays on the server, since it can contain a query, a path or a token. Use `error.digest` to
correlate what the user saw with your logs.
</Callout>

# `notFound()`

A missing record is not an error - it is a 404, and there is a function for it:

```jsx
import { notFound } from "next/navigation";

export default async function Post({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return <h1>{post.title}</h1>;
}
```

`notFound()` throws a special error that Next.js recognises. It renders the closest
`not-found.jsx` **with a 404 status code**, so crawlers and monitoring see the truth.

Because it throws, everything after it is unreachable - no `return` needed, and TypeScript
narrows `post` to non-null on the following line.

```jsx
// app/blog/not-found.jsx
export default function NotFound() {
  return <h1>Post not found</h1>;
}
```

Like layouts, `error.jsx` and `not-found.jsx` apply to their segment and everything below it, and
the closest one wins.

# Challenge

`lib/posts.js` ships `getPost(slug)`, which resolves to `undefined` when nothing matches.

- `app/blog/error.jsx` - a Client Component taking `error` and `reset`. Render a `p` with id
  `error` containing `error.message`, and a `button` with id `retry` and the text `Try again`
  that calls `reset` when clicked.

- `app/blog/not-found.jsx` - default export a component rendering an `h1` with id `title`
  containing `Post not found`, and a `next/link` to `/blog` with the text `Back to the blog`.

- `app/blog/[slug]/page.jsx` - default export an async page that awaits `params`, loads the post,
  calls `notFound()` when there is none, and otherwise renders an `h1` with id `title` containing
  the post's title and a `p` with id `body` containing its body.
