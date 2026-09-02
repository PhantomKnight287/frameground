Lifting state up solves sharing between siblings, but it has a cost: the value now has to be
passed down through every component in between, even the ones that don't care about it. That
is **prop drilling**:

```jsx
<Page theme={theme}>
  <Layout theme={theme}>
    <Sidebar theme={theme}>
      <Button theme={theme} /> {/* finally */}
```

**Context** lets a parent make a value available to the whole subtree below it, and lets any
component read it directly - no matter how deep it is.

# Creating a context

```jsx
import { createContext } from "react";

export const ThemeContext = createContext("light"); // the default value
```

The argument is the value used when a component reads the context with **no** matching
provider above it.

# Providing a value

```jsx
<ThemeContext.Provider value={theme}>
  <Page />
</ThemeContext.Provider>
```

Every component inside - at any depth - can now read `theme`.

# Reading a value

```jsx
import { useContext } from "react";

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

`useContext` looks **up** the tree for the closest provider of that context and returns its
value. When the provider's value changes, every consumer re-renders.

# The provider component pattern

A context on its own is just a channel. In practice you pair it with a component that owns the
state and a hook that reads it, so consumers never touch the context object directly:

```jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const value = { theme, setTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

<Callout type="warn" title="Pitfall">
Context is not a state manager, and it isn't free: every consumer re-renders whenever the
provider's value changes. Passing a fresh object literal as `value` on every render makes that
happen on *every* parent render. Use it for values that rarely change - theme, current user,
locale - and prefer props for everything else.
</Callout>

Read more about context [here](https://react.dev/learn/passing-data-deeply-with-context).

# Challenge

You have to create a context and two components:

- `src/context/theme-context.jsx` - create a context whose default value is
  `{ theme: "light", toggleTheme: () => {} }` and export three **named** exports:
  - `ThemeContext` - the context itself.
  - `ThemeProvider` - a component that takes `children`, owns a `theme` state that starts at
    `"light"`, and provides `{ theme, toggleTheme }` where `toggleTheme` flips the theme
    between `"light"` and `"dark"`.
  - `useTheme` - a hook that returns the current context value.

- `src/components/theme-toggle.jsx` - default export a function component that reads the
  context with `useTheme` and renders a `button` with id `toggle` whose content is
  `Switch to dark` when the theme is light and `Switch to light` when it is dark. Clicking it
  toggles the theme.

- `src/components/toolbar.jsx` - default export a function component that renders a `span`
  with id `theme` containing the current theme, and `ThemeToggle` inside it. It must not take
  any props - this is the whole point of context.

You can also mount `ThemeProvider` and `Toolbar` in `src/App.jsx` but this step is optional.
