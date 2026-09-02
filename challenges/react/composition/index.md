Sooner or later a component grows a prop like `showHeader`, then `headerTitle`, then
`headerIcon`, then `headerAlign`. Every new use case adds another option, and the component
becomes a configuration format nobody enjoys.

React's answer is **composition**: instead of describing what a component should render with
props, hand it the JSX.

# The `children` prop

Anything you put between a component's tags arrives as the `children` prop:

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Ada Lovelace</h2>
  <p>The first programmer</p>
</Card>;
```

`Card` knows nothing about what is inside it - it only provides the box. That is what makes it
reusable: any content, no new props.

# JSX as a prop

`children` is one slot. When you need several, pass JSX through named props:

```jsx
function Layout({ sidebar, content }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}

<Layout sidebar={<Nav />} content={<Article />} />;
```

There is nothing special about this - JSX is just a value, so it can be passed like a string or
a number.

# Composition over configuration

Compare the two designs:

```jsx
// ❌ every variation needs a new prop
<Dialog title="Delete?" showCancel confirmLabel="Delete" danger />

// ✅ the caller decides what goes inside
<Dialog>
  <Dialog.Title>Delete?</Dialog.Title>
  <Button variant="danger">Delete</Button>
  <Button variant="ghost">Cancel</Button>
</Dialog>
```

The second version does not need to change when a new use case appears.

<Callout type="info" title="Note">
Composition also solves most cases people reach for context for. If a component only needs to
get a value *through* a middle layer, passing JSX down as `children` avoids the drilling
entirely - the middle layer never sees the props at all.
</Callout>

Read more about passing JSX as children [here](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children).

# Challenge

You have to create two components:

- `src/components/card.jsx` - default export a function component that renders a `div` with
  class `card` containing:
  - a `div` with class `card-header` containing the `title` prop, rendered **only** when a
    `title` prop was passed,
  - a `div` with class `card-body` containing `children`,
  - a `div` with class `card-footer` containing the `footer` prop, rendered **only** when a
    `footer` prop was passed.

- `src/components/split-pane.jsx` - default export a function component that takes `left` and
  `right` props (both JSX) and renders a `div` with id `split` containing a `div` with id
  `left` and a `div` with id `right`, each holding the matching prop.

You can also mount these components in `src/App.jsx` but this step is optional.
