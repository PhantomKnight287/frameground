Static pages are fast because they were built once. That is also their problem: the moment your
data changes, every static page is stale until the next deploy.

**Incremental Static Regeneration** fixes it without giving up the CDN. Pages are still static -
they are just allowed to rebuild themselves, one at a time, while visitors keep getting the old
version instantly.

# Revalidating on a timer

Add `revalidate` to what `getStaticProps` returns:

```js
export async function getStaticProps() {
  return {
    props: { stats: await getStats() },
    revalidate: 60, // seconds
  };
}
```

Here is the sequence, and the part people get wrong:

1. A request arrives. The cached page is served **immediately**, stale or not.
2. If the page is older than `revalidate` seconds, Next.js regenerates it **in the background**.
3. The *next* request gets the fresh one.

So `revalidate: 60` does not mean "this page is never more than 60 seconds old". It means "at
most once a minute, one visitor triggers a rebuild that the following visitors benefit from".
Nobody ever waits for it.

<Callout type="info" title="Note">
`revalidate` works alongside `getStaticPaths`. With `fallback: "blocking"`, pages you never
built are generated on first request and then follow the same timer - which is how a site with
100,000 products builds in seconds.
</Callout>

# Revalidating on demand

A timer is a guess. When you know the data changed - a CMS webhook fires, an editor hits publish
- you can rebuild exactly the affected page:

```js
export default async function handler(req, res) {
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    await res.revalidate("/stats");
    return res.status(200).json({ revalidated: true });
  } catch {
    return res.status(500).json({ error: "Failed to revalidate" });
  }
}
```

`res.revalidate(path)` takes the **path as visitors see it** (`/blog/hello-world`), not the
route pattern (`/blog/[slug]`). It is only available inside API routes.

<Callout type="warn" title="Careful">
This endpoint is public. Without the secret check, anyone can force your site to rebuild as fast
as they can send requests. Check the secret **before** doing any work, and keep it in an
environment variable - never in the code.
</Callout>

# Which one to reach for

- Data that drifts slowly and predictably - a timer. `revalidate: 3600` on a docs page is fine.
- Data with an obvious "it changed" moment - on-demand, from the webhook that already fires.
- Both, usually: on-demand for correctness, a long timer as a safety net for the webhook you
  forgot to wire up.

# Challenge

`lib/stats.js` ships `getStats()`, returning `{ challenges, solutions }`.

- `pages/stats.jsx` - default export a page taking a `stats` prop and rendering a `p` with id
  `challenges` containing the challenge count and a `p` with id `solutions` containing the
  solution count. Export an async `getStaticProps` that returns the stats as the `stats` prop
  and regenerates the page at most once every `60` seconds.

- `pages/api/revalidate.js` - default export a handler that:
  - responds `401` with `{ error: "Invalid token" }` unless `req.query.secret` equals
    `process.env.REVALIDATE_SECRET`, without revalidating anything
  - otherwise calls `res.revalidate("/stats")` and responds `200` with `{ revalidated: true }`
  - responds `500` with `{ error: "Failed to revalidate" }` if `res.revalidate` rejects
