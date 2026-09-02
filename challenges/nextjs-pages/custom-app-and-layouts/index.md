Every page in the Pages Router is rendered inside one component you control: `pages/_app.jsx`.
It is the root of your application - the place for a header and footer that appear everywhere,
global CSS, and providers (theme, auth, a query client) that must not be re-created on every
navigation.

```jsx
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

`Component` is the page for the current route, and `pageProps` are the props its data-fetching
function returned. The default `_app` just renders the page - anything you wrap around it wraps
the whole site.

<Callout type="warn" title="Careful">
Global CSS can **only** be imported from `_app.jsx`. Import a plain `.css` file from a page or a
component and the build fails - Next.js pushes you towards CSS Modules (`styles.module.css`) for
component-scoped styles.
</Callout>

# A shared layout

Because `_app` persists across navigations, whatever you put around `<Component />` keeps its
state and its DOM as the user moves between routes: the header does not remount, a video in the
sidebar keeps playing, scroll position in a nav is preserved.

```jsx
export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
```

# Per-page layouts

One layout for the whole site is rarely enough - a marketing page and a dashboard look nothing
alike. The pattern Next.js recommends is a **`getLayout` function hanging off the page
component**:

```jsx
// pages/dashboard.jsx
export default function Dashboard() {
  return <p>Numbers</p>;
}

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
```

`_app` then asks each page how it wants to be wrapped, and falls back to the default layout:

```jsx
export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  return getLayout(<Component {...pageProps} />);
}
```

The layout is *chosen by the page* but *rendered by `_app`*, which is what keeps it mounted
across navigations.

## `_document.jsx`

`_app` renders on both the server and the client. `_document.jsx` renders **only on the server**
and owns the HTML shell around your app - the `<html>` and `<body>` tags:

```jsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

Reach for it to set `lang`, add a class to `<body>`, or inject a font link - and for nothing
else. It never re-renders in the browser, so event handlers and state do not belong here.

# Challenge

- `components/layout.jsx` - default export a component taking `children` and rendering:
  - a `header` with id `header` containing an `h1` with the text `FrameGround`
  - a `main` with id `content` containing `children`
  - a `footer` with id `footer` containing the text `Built with Next.js`

- `pages/_app.jsx` - default export the `App` component. It must:
  - import `@/styles/globals.css`
  - render the page component with `pageProps` spread onto it
  - wrap the page in `Layout` by default
  - use `Component.getLayout(page)` instead, when the page defines it
