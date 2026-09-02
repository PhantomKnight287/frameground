React gives you components. It does not give you a router, a build pipeline, a server, or an
answer to "where does this data come from?". **Next.js** is the framework that fills in all of
those gaps around React.

Next.js has two routers, and this track covers the **Pages Router** - the original one, still
supported, and still what a very large number of production apps run on. Its newer sibling, the
App Router, has a track of its own.

The playground already has a Next.js project installed. Have a look around:

```txt
pages/            every file in here becomes a route
  _app.jsx        wraps every page - global CSS and shared layout live here
  index.jsx       the "/" route
styles/           plain CSS
next.config.mjs   framework configuration
jsconfig.json     lets you import from "@/..." instead of "../../.."
```

Run the dev server in the terminal:

```bash
pnpm dev
```

# The file-system router

This is the idea the whole framework is built on: **a file in `pages/` is a route**. There is no
route table to keep in sync, no `<Route path=... />` to register. You create the file, you get
the URL.

| File                     | URL          |
| ------------------------ | ------------ |
| `pages/index.jsx`        | `/`          |
| `pages/about.jsx`        | `/about`     |
| `pages/blog/index.jsx`   | `/blog`      |
| `pages/blog/hello.jsx`   | `/blog/hello`|

A page is an ordinary React component - with one rule: it must be the **default export** of the
file.

```jsx
export default function About() {
  return <h1>About us</h1>;
}
```

<Callout type="info" title="Note">
Next.js is happy with `.jsx`, `.js`, `.tsx` and `.ts` pages. This track uses `.jsx` so you can
focus on the framework instead of on types.
</Callout>

## Imports with `@/`

`jsconfig.json` maps `@/` to the root of the project, so you can write

```jsx
import Nav from "@/components/nav";
```

from anywhere, instead of counting `../`s.

# Challenge

Create two pages:

- `pages/index.jsx` - default export a component that renders an `h1` with id `title` containing
  the text `FrameGround`, and a `p` with id `tagline` containing `Learn Next.js by building`.

- `pages/about.jsx` - default export a component that renders an `h1` with id `title` containing
  the text `About`.

Start the dev server and visit `/` and `/about` to see them.
