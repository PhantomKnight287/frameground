State is for values the UI is rendered from: change it, and React re-renders. But sometimes you
need to remember something *without* re-rendering - a timeout id, a DOM node, the previous
value of a prop. That is what a **ref** is for.

# `useRef`

```jsx
import { useRef } from "react";

const ref = useRef(initialValue);
```

`useRef` returns a plain object with a single mutable property: `ref.current`. React gives you
the *same object* on every render, and changing `ref.current` never triggers a re-render.

| State                                       | Ref                                                 |
| ------------------------------------------- | --------------------------------------------------- |
| `useState` returns `[value, setValue]`       | `useRef` returns `{ current }`                       |
| Changing it re-renders the component         | Changing it does **not** re-render                   |
| Read it during rendering                     | Do **not** read or write it during rendering         |
| For data the UI is built from                | For things you need to remember, not to display      |

## Refs to DOM nodes

Pass a ref to a JSX element with the `ref` attribute and React will put the DOM node into
`ref.current` after the element is mounted:

```jsx
function Form() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus the input</button>
    </>
  );
}
```

This is the escape hatch for the handful of things React has no declarative API for: focusing,
scrolling, measuring, and playing media.

<Callout type="warn" title="Pitfall">
`ref.current` is `null` during the first render - the DOM node does not exist yet. Only read it
inside event handlers or effects, never while rendering.
</Callout>

## Refs as instance variables

Because the ref object survives re-renders, it is also the place to stash a value you want to
carry from one render to the next:

```jsx
function Previous({ value }) {
  const previousRef = useRef(null);

  useEffect(() => {
    previousRef.current = value; // remember it *after* rendering
  }, [value]);

  return <p>Now {value}, before {previousRef.current}</p>;
}
```

The write happens in an effect, so the render itself stays pure: during a render the ref still
holds the value from the previous commit - which is exactly what we want to show.

Read more about `useRef` [here](https://react.dev/reference/react/useRef).

# Challenge

You have to create two components:

- `src/components/focus-input.jsx` - default export a function component that renders an
  `input` with id `name` and a `button` with id `focus`. Clicking the button must focus the
  input using a ref. Do not use `document.querySelector`.

- `src/components/previous-value.jsx` - default export a function component that takes a
  `value` prop. It renders a `span` with id `current` containing `Current: <value>` and a
  `span` with id `previous` containing `Previous: <previous value>`. Before the value has ever
  changed, the previous value must render as `none`. Remember the previous value in a ref, not
  in state.

You can also mount these components in `src/App.jsx` but this step is optional.
