Fetching data is a side effect, so it belongs in `useEffect`. The fetch itself is the easy
part - what separates a toy from a real component is handling every state a request can be in.

# The three states

At any moment your request is either in flight, failed, or done. All three need to render
something:

```jsx
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch");
        return response.json();
      })
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  return <ul>{users.map((user) => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

<Callout type="warn" title="Pitfall">
`fetch` only rejects on a network failure. A 404 or a 500 resolves normally - you have to check
`response.ok` yourself, or your error state will never fire.
</Callout>

# Race conditions

If the URL changes while a request is in flight, two responses are now racing and the slower
one can overwrite the fresher one. The fix is cleanup: mark the effect as stale when it is torn
down, and ignore the response.

```jsx
useEffect(() => {
  let ignore = false;

  fetch(`/api/users?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      if (!ignore) setUsers(data); // 👈 only the current effect may write
    });

  return () => {
    ignore = true;
  };
}, [query]);
```

`AbortController` is the other option, and it also cancels the request itself:

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(/* … */);
  return () => controller.abort();
}, [url]);
```

<Callout type="info" title="Note">
In a real app you would reach for a library like TanStack Query or your framework's loader,
which handle caching, retries and races for you. Writing it by hand once is still worth it -
that is what those libraries are doing under the hood.
</Callout>

Read more about fetching data in effects [here](https://react.dev/reference/react/useEffect#fetching-data-with-effects).

# Challenge

You have to create one component:

- `src/components/user-list.jsx` - default export a function component that takes a `url` prop
  and fetches it with `fetch` inside an effect when it mounts, and again whenever `url`
  changes. The response is a JSON array of `{ id, name }` objects.
  - While the request is in flight, render a `p` with id `loading` and the text `Loading...`.
  - If the request rejects, or the response's `ok` is `false`, render a `p` with id `error`
    containing `Something went wrong`.
  - On success, render a `ul` with id `users` with one `li` per user, keyed by `id`, containing
    the user's name.
  - Only one of the three may be on screen at a time.
  - Ignore the response of a request whose `url` is no longer the current one, so a slow
    response can never overwrite a newer one.

You can also mount `UserList` in `src/App.jsx` but this step is optional.
