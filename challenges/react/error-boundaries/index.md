A JavaScript error thrown while rendering doesn't just break that component - React unmounts the
**whole tree** and you are left with a blank page. That is deliberate: React would rather show
nothing than a corrupted UI.

An **error boundary** is a component that catches errors thrown below it and renders a fallback
instead, so one broken widget doesn't take down the entire app.

# Writing one

Error boundaries are the one thing hooks still cannot do - they must be class components,
because they rely on two lifecycle methods:

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    // called during rendering: return the new state, nothing else
    return { error };
  }

  componentDidCatch(error, info) {
    // called after the commit: the place for side effects like logging
    logToService(error, info.componentStack);
  }

  render() {
    if (this.state.error) return <p>Something went wrong</p>;
    return this.props.children;
  }
}
```

- `getDerivedStateFromError` runs during rendering, so it must be **pure** - return state, do
  nothing else.
- `componentDidCatch` runs after React commits the fallback, so it is where logging belongs.

# Using one

Wrap whatever you want to isolate. Boundaries catch errors from anywhere **below** them, so
placement decides how much of the UI disappears when something breaks:

```jsx
<ErrorBoundary>
  <Profile />       {/* if this throws, only this region is replaced */}
</ErrorBoundary>
```

# What they do not catch

| Caught                                  | Not caught                                            |
| --------------------------------------- | ----------------------------------------------------- |
| Errors while rendering                   | Errors inside event handlers (use `try`/`catch`)       |
| Errors in lifecycle methods              | Errors in `setTimeout`/`Promise` callbacks             |
| Errors in constructors below the boundary| Errors thrown by the boundary itself                   |
|                                          | Errors during server side rendering                    |

<Callout type="info" title="Note">
In development you will still see the error in the console and, with a dev overlay, on screen -
React re-throws it so you can debug. The fallback is what your users get in production.
</Callout>

Read more about error boundaries [here](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

# Challenge

You have to create one component:

- `src/components/error-boundary.jsx` - default export a **class** component that renders its
  `children` while everything is fine. When a descendant throws while rendering, it must
  instead render a `div` with id `error-fallback` containing:
  - a `p` with id `error-message` whose content is the thrown error's `message`, and
  - a `button` with id `reset` that clears the error and tries to render `children` again.

  It must also call an optional `onError` prop with the error, from `componentDidCatch`, so the
  failure can be logged.

You can also use `ErrorBoundary` in `src/App.jsx` but this step is optional.
