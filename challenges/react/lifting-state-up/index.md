Every component you have written so far owned its own state. But what happens when two
components need to show the same data? If a search box keeps the query in its own state,
the list next to it has no way of reading it — siblings cannot see each other's state.

The fix is a pattern called **lifting state up**: move the state to the closest common
parent of the components that need it, and pass it back down as props.

# The problem

```jsx
function SearchInput() {
  const [query, setQuery] = useState(""); // 👈 trapped in here
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

function UserList() {
  // ❌ no way to read `query`
}
```

# The fix

Move `query` into the parent, and hand each child what it needs:

```jsx
function Parent() {
  const [query, setQuery] = useState("");

  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <UserList query={query} />
    </>
  );
}
```

The children become **controlled** components: they no longer own the data, they only
receive it and report changes back through a callback prop.

```jsx
function SearchInput({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}
```

Notice `SearchInput` doesn't know *why* the value changes or who else uses it. It only
renders what it is given and calls `onChange`. That is what makes it reusable.

## Rules of thumb

- Find every component that needs the data, then put the state in their closest common parent.
- Pass the value down as a prop, and pass a setter (or a callback) down for updates.
- A component that owns no state and renders purely from props is often easier to test and reuse.

Read more about sharing state between components [here](https://react.dev/learn/sharing-state-between-components).

# Challenge

You have to create three components:

- `src/components/search-input.jsx` — default export a function component that takes `value`
  and `onChange` props and renders an `input` with id `search`. The input's value must be the
  `value` prop, and every change must call `onChange` with the new **text** (not the event).

- `src/components/user-list.jsx` — default export a function component that takes a `users`
  array and a `query` string. It renders a `ul` with id `users` containing one `li` per user
  whose name contains `query` (case insensitive). Each `li` must use the user's name as its
  `key` and render the name as its content. If nothing matches, render a `p` with id
  `empty` and the text `No users found`.

- `src/components/user-search.jsx` — default export a function component that owns the
  `query` state (defaults to an empty string), renders `SearchInput` and `UserList`, and
  a `span` with id `count` whose content is `<number of matching users> users`. It takes a
  `users` prop and passes it down to `UserList`.

You can also mount `UserSearch` in `src/App.jsx` but this step is optional.
