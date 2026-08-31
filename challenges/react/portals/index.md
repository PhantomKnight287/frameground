React renders a component's DOM inside its parent's DOM. That is almost always what you want —
until you build a modal, a tooltip or a dropdown, and a parent's `overflow: hidden`,
`transform` or `z-index` clips it.

A **portal** renders children into a different place in the DOM while leaving the component
exactly where it is in the React tree.

# `createPortal`

```jsx
import { createPortal } from "react-dom";

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.body // 👈 where the DOM goes
  );
}
```

The first argument is the JSX, the second is the DOM node to render it into.

# React tree vs DOM tree

This is the whole point of portals: only the **DOM** moves.

- Context from parents still reaches the portal's children.
- State and effects behave exactly as they would without the portal.
- Events still bubble through the **React** tree, not the DOM tree. A click inside a portal
  fires the `onClick` of a React parent even though the DOM nodes are nowhere near each other.

```jsx
<div onClick={() => console.log("still fires")}>
  <Modal>
    <button>Click me</button> {/* rendered into document.body */}
  </Modal>
</div>
```

# A modal in practice

A dialog usually wants three things: an overlay that closes when you click outside, a close
button, and nothing at all in the DOM when it is closed.

```jsx
function Modal({ open, onClose, children }) {
  if (!open) return null;

  return createPortal(
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog">{children}</div>
    </div>,
    document.body
  );
}
```

Checking `e.target === e.currentTarget` is what makes a click on the overlay close the dialog
while a click *inside* it does not.

<Callout type="info" title="Note">
Portals do not trap focus or add ARIA roles for you. For real dialogs, use the native
`&lt;dialog&gt;` element or a headless library — and remember to restore focus when it closes.
</Callout>

Read more about `createPortal` [here](https://react.dev/reference/react-dom/createPortal).

# Challenge

You have to create one component:

- `src/components/modal.jsx` — default export a function component that takes `open`, `onClose`
  and `children` props.
  - When `open` is `false`, it renders nothing at all.
  - When `open` is `true`, it renders into `document.body` with a portal: a `div` with id
    `modal-overlay` containing a `div` with id `modal`, which holds the `children` and a
    `button` with id `close`.
  - Clicking the close button calls `onClose`.
  - Clicking the overlay itself calls `onClose`, but a click on the modal or its children must
    not.

You can also mount `Modal` in `src/App.jsx` but this step is optional.
