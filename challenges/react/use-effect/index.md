Rendering in React must be **pure**: given the same props and state, a component returns the
same JSX and touches nothing outside of itself. But real apps have to talk to the outside
world — set the document title, open a socket, start a timer, subscribe to an event.

Those are **side effects**, and they belong in `useEffect`.

# `useEffect`

```jsx
import { useEffect } from "react";

useEffect(() => {
  // 1. the effect: runs after React commits the render to the DOM
  return () => {
    // 2. the cleanup: runs before the next effect and when the component unmounts
  };
}, [dependencies]); // 3. when to re-run
```

## The dependency array

The second argument decides how often the effect runs:

| Dependencies    | When the effect runs                              |
| --------------- | ------------------------------------------------- |
| omitted         | after **every** render                            |
| `[]`            | once, after the first render                      |
| `[a, b]`        | after the first render, and whenever `a` or `b` changed |

Every reactive value your effect reads — props, state, values derived from them — belongs in
the array. Leaving one out gives you an effect that quietly works with stale data.

## Cleanup

If your effect starts something, it must stop it. Return a cleanup function:

```jsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);
}, []);
```

Without `clearInterval`, the interval keeps running after the component is gone, and a second
one is created every time the effect re-runs. This is the single most common `useEffect` bug.

<Callout type="info" title="Note">
In development, `StrictMode` mounts your component twice on purpose, so an effect that leaks
is easy to spot: you will see it run twice. Correct cleanup makes that harmless.
</Callout>

## You might not need an effect

An effect is for synchronising with something *outside* React. If you can compute a value
during rendering, do that instead — don't mirror props into state inside an effect:

```jsx
// ❌ extra render, easy to get out of sync
const [fullName, setFullName] = useState("");
useEffect(() => setFullName(`${first} ${last}`), [first, last]);

// ✅ just calculate it
const fullName = `${first} ${last}`;
```

Read more about `useEffect` [here](https://react.dev/reference/react/useEffect).

# Challenge

You have to create two components:

- `src/components/document-title.jsx` — default export a function component with a `count`
  state that starts at 0. It renders a `span` with id `count` containing `Count: <count>` and
  a `button` with id `increment` that increases the count by one. Using an effect, keep
  `document.title` in sync with the count so that it always reads `Count: <count>`.

- `src/components/timer.jsx` — default export a function component with a `seconds` state that
  starts at 0. Start an interval on mount that increases `seconds` by one every 1000ms, and
  render a `span` with id `seconds` containing `<seconds>s`. The interval must be created
  **once** and must be cleared when the component unmounts.

You can also mount these components in `src/App.jsx` but this step is optional.
