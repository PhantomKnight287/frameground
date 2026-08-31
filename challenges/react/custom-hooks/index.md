Two components need the same behaviour — a counter, a form field, a value kept in
`localStorage`. Copying the `useState`/`useEffect` code into both works, until it doesn't.

A **custom hook** is just a function whose name starts with `use` and that calls other hooks.
That naming convention is not decoration: it is how React (and the linter) knows the function
follows the rules of hooks.

# Writing one

```jsx
import { useState } from "react";

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((current) => !current);

  return [on, toggle];
}
```

Used from a component:

```jsx
function Switch() {
  const [on, toggle] = useToggle();
  return <button onClick={toggle}>{on ? "ON" : "OFF"}</button>;
}
```

## Hooks share logic, not state

This is the part that trips people up. Every component that calls `useToggle` gets its **own**
independent state. A custom hook is a recipe, not a store — nothing is shared between two
components calling the same hook. If you need shared state, lift it up or use context.

## What to return

Return whatever makes the call site read well:

- a pair, like `useState` does: `[value, setValue]`
- an object when there are several values: `{ count, increment, decrement, reset }`

## Rules of hooks

They apply to custom hooks exactly as they do to built-in ones:

- Only call hooks at the **top level** — never inside conditions, loops or nested functions.
- Only call hooks from React components or from other hooks.

<Callout type="info" title="Note">
A function that uses no hooks doesn't need the `use` prefix — that's just a normal helper
function, and it can be called from anywhere.
</Callout>

Read more about custom hooks [here](https://react.dev/learn/reusing-logic-with-custom-hooks).

# Challenge

You have to create two hooks and one component:

- `src/hooks/use-counter.js` — export a **named** hook `useCounter(initialValue = 0)` that
  returns an object with `count`, `increment`, `decrement` and `reset`. `increment` and
  `decrement` change the count by one, `reset` puts it back to `initialValue`. The count must
  never go below 0.

- `src/hooks/use-local-storage.js` — export a **named** hook `useLocalStorage(key, initialValue)`
  that returns `[value, setValue]`. On the first render, read the key from `localStorage` and
  parse it with `JSON.parse`; if the key is missing, use `initialValue`. Every call to
  `setValue` must update the state and write the new value to `localStorage` with
  `JSON.stringify`.

- `src/components/counter.jsx` — default export a function component that uses `useCounter`
  starting at 5. It renders a `span` with id `count` containing the count, and three buttons
  with ids `increment`, `decrement` and `reset`.

You can also mount `Counter` in `src/App.jsx` but this step is optional.
