Not every request should render the page it asked for. Some belong somewhere else, and some
should not exist at all - for this visitor.

`getStaticProps` and `getServerSideProps` can return one of three things, and only one of them
is `props`.

# `redirect`

```js
export async function getServerSideProps({ req }) {
  if (!req.cookies.token) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { props: { user: await getUser(req.cookies.token) } };
}
```

`permanent` picks the status code, and it matters more than it looks:

| `permanent` | Status | Meaning                                                            |
| ----------- | ------ | ------------------------------------------------------------------ |
| `false`     | `307`  | temporary - "not right now". Browsers do not cache it.             |
| `true`      | `308`  | permanent - "this URL has moved for good". Browsers **cache it**.  |

Use `false` for anything conditional - auth, feature flags, A/B tests. A permanent redirect on a
login check will keep redirecting the user long after they have signed in, and there is nothing
you can ship to undo it.

<Callout type="info" title="Note">
Redirects that are always true, for everyone, do not need a page at all - put them in
`next.config.mjs` under `redirects()`, where they are handled before rendering starts.
</Callout>

# `notFound`

```js
const post = await getPost(params.slug);
if (!post) return { notFound: true };
```

This renders your 404 page **with a 404 status code**. That last part is why you should not
render a "not found" message from the page component instead: search engines, monitoring and
`fetch` all look at the status, and a 200 that says "not found" is a lie they will believe.

`notFound` is also the polite way to hide something that does exist but is none of the caller's
business - an admin page, a draft post. A redirect to `/login` tells an attacker the URL is
real; a 404 tells them nothing.

# Custom error pages

Two filenames are special:

- `pages/404.jsx` - shown for any missing route and any `notFound: true`
- `pages/500.jsx` - shown when a server-side error escapes

Both are statically generated, so they cannot fetch data - they are there to be simple and
always available. Give the visitor a way out: a link home, a search box.

<Callout type="warn" title="Careful">
`pages/500.jsx` replaces the default error page in production only. In development you keep
seeing the error overlay, which is what you want.
</Callout>

# Challenge

Build the three pieces:

- `pages/404.jsx` - default export a page rendering an `h1` with id `title` containing
  `Page not found`, and a `next/link` to `/` with the text `Go home`.

- `pages/dashboard.jsx` - default export a page taking a `user` prop and rendering an `h1` with
  id `title` containing `Welcome, <user>`. Export an async `getServerSideProps` that reads
  `req.cookies.token` and:
  - with no token, temporarily redirects to `/login`
  - with a token, returns it as the `user` prop

- `pages/admin.jsx` - default export a page rendering an `h1` with id `title` containing
  `Admin`. Export an async `getServerSideProps` that reads `req.cookies.role` and returns
  `{ notFound: true }` unless it is exactly `admin` - in which case it returns empty props.
