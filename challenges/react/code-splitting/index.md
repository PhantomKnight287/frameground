Every import in your app ends up in the bundle the browser downloads before it can show
anything - including the giant chart library used on one settings screen nobody opens on the
first visit.

**Code splitting** breaks the bundle into pieces that load on demand. React has two pieces of
API for it: `lazy` and `Suspense`.

# `lazy`

```jsx
import { lazy } from "react";

const HeavyChart = lazy(() => import("./heavy-chart"));
```

`lazy` takes a function returning a **dynamic import** and gives you back a component. The
module isn't fetched when the app starts - it is fetched the first time the component is
actually rendered, and it is cached afterwards.

<Callout type="warn" title="Pitfall">
Declare lazy components at the **module top level**, never inside another component. Calling
`lazy` during a render creates a brand new component type every time, which remounts the whole
subtree and throws away its state.
</Callout>

The lazily loaded module must have a **default export** - that is what `lazy` renders.

# `Suspense`

While the module is in flight, the component has nothing to render. `Suspense` says what to
show in the meantime:

```jsx
import { Suspense } from "react";

<Suspense fallback={<p>Loading…</p>}>
  <HeavyChart />
</Suspense>;
```

The fallback appears while anything beneath it is suspended, and is replaced by the real
content once it resolves. One boundary can wrap several lazy components - they will all be
covered by the same fallback, so put the boundary where a spinner makes sense in your layout,
not necessarily around each component.

<Callout type="info" title="Note">
Pair `Suspense` with an error boundary: if the chunk fails to download - a flaky network, a
stale build - the lazy component throws, and only an error boundary can catch it.
</Callout>

Read more about [`lazy`](https://react.dev/reference/react/lazy) and
[`Suspense`](https://react.dev/reference/react/Suspense).

# Challenge

One file is given to you and must not be changed:

- `src/components/settings.jsx` default exports the panel's content and exports a `stats`
  object whose `imported` counter is increased when the module is evaluated.

You have to create one component:

- `src/components/settings-panel.jsx` - default export a function component that renders a
  `button` with id `open`. The `Settings` component must be loaded lazily and rendered only
  after that button is clicked, wrapped in a `Suspense` boundary whose fallback is a `p` with
  id `loading` and the text `Loading...`. The module must not be imported until the button is
  clicked, and clicking the button again must not remount the panel.

You can also mount `SettingsPanel` in `src/App.jsx` but this step is optional.
