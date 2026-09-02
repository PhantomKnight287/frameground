Next.js has two routers. The older one lives in `pages/` and has its own track; this one lives
in `app/`, and it is where the framework is heading. The **App Router** changes three things at
once: how routes are declared, where layouts live, and - the big one - where your components run.

You do not need the Pages Router to follow this track. Where the two differ in a way worth
knowing, it is called out.

# Folders are routes, files are roles

In `pages/`, the filename was the URL. In `app/`, the **folder** is the URL and the filename says
what the file *does*:

```txt
app/
  layout.jsx        the shell around everything      ->  required, at the root
  page.jsx          the UI for "/"                   ->  /
  about/
    page.jsx        the UI for "/about"              ->  /about
  blog/
    layout.jsx      the shell around /blog/*
    page.jsx        the UI for "/blog"               ->  /blog
```

A folder without a `page.jsx` is **not a route**. That is deliberate: it means you can put
components, tests and styles right next to the route that uses them without accidentally
publishing them as URLs.

| File            | What it is                                          |
| --------------- | ---------------------------------------------------- |
| `page.jsx`      | the UI for that route - makes the folder public       |
| `layout.jsx`    | shared shell that wraps the segment and its children  |
| `loading.jsx`   | shown while the segment loads                         |
| `error.jsx`     | shown when the segment throws                         |
| `not-found.jsx` | shown for `notFound()` in that segment                |
| `route.js`      | an HTTP endpoint instead of a page                    |

# The root layout

`app/layout.jsx` is required, and unlike `_app.jsx` it renders the `<html>` and `<body>` tags
itself - `_document.jsx` is gone, and this file does both jobs:

```jsx
import "./globals.css";

export const metadata = {
  title: "FrameGround",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`children` is the page - or the next layout down. Metadata is data you export, not tags you
render; there is a whole challenge on it later in this track.

# Server Components by default

This is the part that matters most. **Every component in `app/` runs on the server unless you say
otherwise.** They render to HTML on the server and their code is never sent to the browser.

That means a component can be `async` and simply await its data:

```jsx
export default async function Page() {
  const posts = await getPosts();
  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

No `getStaticProps`, no `getServerSideProps` - the data fetching moved *into* the component. In
exchange, a Server Component cannot use `useState`, `useEffect` or an `onClick` handler. Anything
interactive opts back into the browser with `"use client"`, which is its own challenge later on.

<Callout type="info" title="Note">
`app/` and `pages/` can coexist in the same project, route by route, which is how large apps
migrate gradually. `app/` wins if both define the same URL.
</Callout>

# Challenge

- `app/layout.jsx` - default export a `RootLayout` taking `children` and returning an `html`
  element with `lang="en"` containing a `body`. Inside the body, render a `header` with id
  `header` containing an `h1` with the text `FrameGround`, followed by a `main` with id `content`
  containing `children`.

- `app/page.jsx` - default export the page for `/`, rendering an `h1` with id `title` containing
  `Home` and a `p` with id `tagline` containing `Learn Next.js by building`.

- `app/about/page.jsx` - default export the page for `/about`, rendering an `h1` with id `title`
  containing `About`.
