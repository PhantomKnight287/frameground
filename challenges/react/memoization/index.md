When a component re-renders, React re-runs its whole function body and re-renders all of its
children. That is usually fast enough to ignore. When it isn't — an expensive calculation, a
huge list — React gives you three tools to skip the work.

# `useMemo` — cache a value

```jsx
const visibleItems = useMemo(
  () => filterItems(items, query),
  [items, query] // recompute only when one of these changes
);
```

`useMemo` runs the function during the first render and caches the result. On later renders it
returns the cached value unless a dependency changed. Everything else in the component still
re-runs — only that calculation is skipped.

# `memo` — skip a child's re-render

```jsx
import { memo } from "react";

const ItemRow = memo(function ItemRow({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});
```

A memoized component re-renders only when its props change. React compares props with
`Object.is`, one by one — a **shallow** comparison.

# `useCallback` — keep a function prop stable

Here is the catch that makes `memo` useless if you miss it. Every render creates brand new
objects and functions:

```jsx
<ItemRow item={item} onSelect={(id) => setSelected(id)} />
// 👆 a different function every render, so the props always "changed"
```

`useCallback` caches the function itself:

```jsx
const handleSelect = useCallback((id) => setSelected(id), []);
```

`useCallback(fn, deps)` is exactly `useMemo(() => fn, deps)` — one caches a function, the other
caches the result of calling one.

<Callout type="warn" title="Pitfall">
Memoizing is not free: React still has to store the value and compare the dependencies. Wrapping
everything in `useMemo` makes code harder to read and can make it slower. Measure with the
Profiler first, then memoize the part that is actually slow.
</Callout>

<Callout type="info" title="Note">
State setters returned by `useState` and `dispatch` from `useReducer` are already stable — you
never need to wrap them in `useCallback`.
</Callout>

Read more about [`useMemo`](https://react.dev/reference/react/useMemo),
[`useCallback`](https://react.dev/reference/react/useCallback) and
[`memo`](https://react.dev/reference/react/memo).

# Challenge

Two files are given to you and must not be changed:

- `src/utils/slow-filter.js` exports `slowFilter(items, query)` and a `stats` object counting
  how many times it has run.
- `src/components/item-row.jsx` default exports a `memo`ised row, and exports a `stats` object
  counting how many times a row has rendered.

You have to create one component:

- `src/components/item-list.jsx` — default export a function component that takes an `items`
  prop (an array of `{ id, name }`) and renders:
  - an `input` with id `query` bound to a `query` state that starts empty,
  - a `span` with id `selected` containing `Selected: <id>`, or `Selected: none` before
    anything is picked,
  - a `ul` with id `items` containing one `ItemRow` per item matching the query, keyed by `id`.

  The filtering must go through `slowFilter`, and it must **not** run again when only the
  selection changed. Clicking a row selects it, and selecting must **not** re-render the rows
  that were already on screen.

You can also mount `ItemList` in `src/App.jsx` but this step is optional.
