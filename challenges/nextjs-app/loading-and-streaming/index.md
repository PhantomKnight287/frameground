A Server Component that awaits data is a page the visitor waits for. If one query takes two
seconds, the whole route takes two seconds - and until then, they see nothing.

Streaming fixes that. The server sends the HTML it already has, and pushes the rest down the same
response as it becomes ready.

# `loading.jsx`

Drop a `loading.jsx` next to a `page.jsx`:

```jsx
// app/dashboard/loading.jsx
export default function Loading() {
  return <p>Loading dashboard...</p>;
}
```

Next.js wraps the page in a `<Suspense>` boundary with this as the fallback. The layout and the
loading UI are sent immediately; the page replaces the fallback when it resolves. Navigation feels
instant, and because the shell arrives first, the route is interactive while the data is still in
flight.

<Callout type="info" title="Note">
`loading.jsx` applies to its segment **and everything nested below it**, exactly like `layout.jsx`.
One at `app/dashboard/loading.jsx` covers every route under `/dashboard`.
</Callout>

# `Suspense`, for one part of a page

`loading.jsx` is all-or-nothing: the entire page waits. Usually only one piece is slow - the
header, nav and title are ready immediately.

Wrap just the slow component:

```jsx
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading stats...</p>}>
        <Stats />
      </Suspense>
    </>
  );
}
```

Now the heading renders straight away and `Stats` streams in when its data arrives. Note what
this means for the page component: it is **not** `async` any more. It does not await anything -
the awaiting moved into `Stats`, which is what lets the rest of the page render without it.

That is the pattern: **push the `await` down into the component that needs it, and put a
`Suspense` boundary around that component.**

## Where to draw boundaries

- Around anything with an unpredictable data source - a third-party API, a slow aggregate query.
- Not around everything. Each boundary is another fallback the user watches appear and disappear;
  too many is visual noise.
- Give the fallback the same shape as the real content - a skeleton the size of the table - so
  nothing jumps when it swaps in.

<Callout type="warn" title="Careful">
`fetch` calls inside a `Suspense` boundary still run in parallel with the rest of the page. What
the boundary changes is only *what the user sees while they wait*.
</Callout>

# Challenge

`lib/stats.js` ships `getStats()`, which takes a moment and returns `{ revenue, signups }`.

- `app/dashboard/loading.jsx` - default export a component rendering a `p` with id `loading`
  containing `Loading dashboard...`.

- `components/stats.jsx` - default export an **async** component that awaits `getStats()` and
  renders a `p` with id `revenue` containing the revenue and a `p` with id `signups` containing
  the signups.

- `app/dashboard/page.jsx` - default export a page - not async - rendering an `h1` with id
  `title` containing `Dashboard`, followed by `Stats` wrapped in a `Suspense` boundary whose
  fallback is a `p` with id `stats-loading` containing `Loading stats...`.
