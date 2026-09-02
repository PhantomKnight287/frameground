`getServerSideProps` and `getStaticProps` run on the server, in Node - which means `fetch` there
is a **server-to-server** call. No CORS, no exposed API key, no waterfall where the browser has
to download your JavaScript before it can even start asking for data.

```jsx
export async function getServerSideProps() {
  const response = await fetch("https://api.example.com/users");
  const users = await response.json();

  return { props: { users } };
}
```

The visitor receives HTML that already contains the data.

# Four things that bite people

**1. `fetch` does not throw on a 404.** It only rejects when the request itself fails - DNS,
connection, timeout. A `500` from the server is a perfectly successful `fetch` with
`response.ok === false`. Check it:

```js
const response = await fetch(url);
if (!response.ok) throw new Error(`Request failed: ${response.status}`);
```

**2. URLs must be absolute.** There is no page context on the server, so `/api/users` means
nothing. Use the full URL.

**3. Do not fetch your own API route.** `getServerSideProps` already runs on your server;
calling `https://your-site/api/posts` from it makes the server ask *itself* over the network for
something it could have done directly. Import the same helper the API route uses and call it.
Fetch other people's APIs, not your own.

**4. Keep secrets out of props.** Everything you return is serialised into the HTML and shipped
to the browser. Read keys from `process.env` (any variable without the `NEXT_PUBLIC_` prefix
stays on the server) and return only what the page renders.

# Failing well

An external API will be down at some point. If you let the error escape, the whole page 500s -
usually the wrong call for one widget's worth of data. Catch it, and return an error state the
page knows how to render:

```js
export async function getServerSideProps() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("bad response");
    return { props: { users: await response.json(), error: null } };
  } catch {
    return { props: { users: [], error: "Failed to load users" } };
  }
}
```

<Callout type="info" title="Note">
Also trim what you return. An API that hands you fifty fields per record when you render three
is fifty fields of JSON embedded in every page. Map it down before it goes into `props`.
</Callout>

# Challenge

Write `pages/users.jsx`:

- export an async `getServerSideProps` that fetches
  `https://jsonplaceholder.typicode.com/users` and:
  - on success, returns props `users` and `error`, where `users` keeps only the `id`, `name` and
    `email` of each record - in the order the API returned them - and `error` is `null`
  - when the response is not ok, or `fetch` rejects, returns `users` as an empty array and
    `error` as `Failed to load users`

- default export a page taking `users` and `error` and rendering:
  - an `h1` with id `title` containing `Users`
  - when `error` is set, a `p` with id `error` containing the error message, and no list
  - otherwise a `ul` with id `users`, one `li` per user containing `<name> (<email>)`
