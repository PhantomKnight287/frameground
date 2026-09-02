Static generation is the right default, but some pages cannot be built ahead of time: a search
results page depends on the query string, a dashboard depends on who is asking, a stock counter
must be correct *now*.

Those pages export `getServerSideProps` instead, and Next.js renders them **on every request**.

```jsx
export default function Search({ q, results }) {
  return <p>{results.length} results for {q}</p>;
}

export async function getServerSideProps(context) {
  const q = context.query.q ?? "";
  return { props: { q, results: await search(q) } };
}
```

The trade is straightforward: you get a fresh, request-aware page, and you give up the CDN. Every
visit waits for your server.

# The context argument

This is where the request lives - and the reason to use this function at all.

| Key       | What it is                                                        |
| --------- | ----------------------------------------------------------------- |
| `params`  | dynamic route segments, for a page like `[slug].jsx`               |
| `query`   | the search params **merged with** `params`                         |
| `req`     | the incoming request - `req.headers`, `req.cookies`                |
| `res`     | the response, so you can set headers or a cookie                   |
| `resolvedUrl` | the URL as requested, without the `_next` internals            |

```js
export async function getServerSideProps({ query, req, res }) {
  const theme = req.cookies.theme ?? "light";
  res.setHeader("Cache-Control", "no-store");
  return { props: { theme, page: Number(query.page ?? 1) } };
}
```

<Callout type="warn" title="Careful">
`query` values are strings, or arrays of strings when a key repeats (`?tag=a&tag=b`). Do not
assume `query.page` is a number, and do not assume it is there at all - always provide a default.
</Callout>

## Caching a server-rendered page

The response is yours to describe. Public, identical-for-everyone pages can still be cached at
the edge:

```js
res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
```

Anything user-specific must not be:

```js
res.setHeader("Cache-Control", "no-store");
```

## Choosing between the two

Ask one question: **does the HTML depend on the request?**

- No - `getStaticProps`. Add `revalidate` if the underlying data changes.
- Yes, on the URL only - `getStaticProps` + `getStaticPaths`, if the set of URLs is knowable.
- Yes, on the user, cookies or headers - `getServerSideProps`.
- Only after the page loads - fetch it in the browser and skip both.

<Callout type="info" title="Note">
A page can export `getStaticProps` **or** `getServerSideProps`, never both. Next.js will refuse
to build otherwise.
</Callout>

# Challenge

`lib/posts.js` ships `getPosts()`, returning posts with a `slug` and a `title`.

Write `pages/search.jsx`:

- export an async `getServerSideProps` that:
  - reads `q` from `context.query`, defaulting to an empty string
  - sets the `Cache-Control` response header to `no-store`
  - returns props `q` and `results`, where `results` are the posts whose title contains `q`,
    compared case-insensitively (an empty `q` matches every post)
- default export a page taking `q` and `results` and rendering:
  - an `h1` with id `title` containing `Search`
  - a `p` with id `summary` containing `<n> results for "<q>"`
  - a `ul` with id `results`, one `li` per result containing its title
  - when there are no results, a `p` with id `empty` containing `No matches` **instead of** the
    list
