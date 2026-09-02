`useEffect` runs *after* the browser has painted. That is the right default - the user sees
your UI as soon as possible, and the effect catches up a moment later.

But sometimes a moment later is too late. If an effect measures a node and then moves it, the
user sees the element in the wrong place first and the corrected position a frame later: a
flicker.

`useLayoutEffect` is the same hook with different timing. It runs **after the DOM is mutated
but before the browser paints**, so anything it changes is part of the very first frame the
user sees.

# The timeline

For a single commit, React does this in order:

1. renders your components and mutates the DOM,
2. runs every **layout effect** (`useLayoutEffect`), and re-renders synchronously if one of
   them sets state,
3. lets the browser paint,
4. runs every **passive effect** (`useEffect`).

```jsx
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setTooltipHeight(height); // 👈 applied before the user sees anything
}, []);
```

Both hooks take the same arguments and support the same cleanup function and dependency array.
Only the timing differs.

| `useEffect`                                | `useLayoutEffect`                                  |
| ------------------------------------------ | -------------------------------------------------- |
| Runs after paint, asynchronously            | Runs before paint, synchronously                    |
| Does not block the browser                  | Blocks painting until it finishes                   |
| Fetching, subscriptions, logging, timers    | Measuring, positioning, scrolling                   |
| The default                                 | The exception                                       |

# When you need it

- **Measuring** a node and rendering based on its size - tooltips, popovers, autosizing text.
- **Positioning** something relative to another element.
- **Scrolling** to a position right after new content is rendered.

<Callout type="warn" title="Pitfall">
A layout effect blocks the paint, so slow work in one freezes the UI - and setting state in it
forces an extra render before anything appears on screen. Reach for `useEffect` first, and only
switch when you can actually see a flicker.
</Callout>

<Callout type="info" title="Note">
`useLayoutEffect` cannot run during server side rendering - there is no DOM to measure - and
React warns about it. Move the work into `useEffect`, or render the fallback markup on the
server and measure after hydration.
</Callout>

Read more about `useLayoutEffect` [here](https://react.dev/reference/react/useLayoutEffect).

# Challenge

You have to create two components:

- `src/components/measure-box.jsx` - default export a function component that takes `children`
  and renders a `div` with id `box` containing them. Using a ref and a layout effect, measure
  the box with `getBoundingClientRect()` and store its width in state. Once measured, render a
  `span` with id `width` containing `Width: <width>px` - before the first measurement, the
  `span` must not be rendered at all. Re-measure whenever `children` change.

  The measurement has to happen **before the browser paints**, so the user never sees a frame
  without the width in it.

- `src/components/chat-log.jsx` - default export a function component that takes a `messages`
  array of strings and renders a `div` with id `messages` containing one `p` with class
  `message` per message. Whenever the messages change, scroll the container to the bottom by
  setting its `scrollTop` to its `scrollHeight` - before the paint, so no one sees the log
  jump.

You can also mount these components in `src/App.jsx` but this step is optional.
