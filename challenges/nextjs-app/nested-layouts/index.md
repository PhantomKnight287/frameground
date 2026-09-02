Shared chrome - a header, a sidebar, a section nav - is part of the routing system here, not a
convention layered on top of it: **drop a `layout.jsx` in a folder and it wraps that segment and
everything under it.**

```txt
app/
  layout.jsx          wraps every route
  page.jsx            /
  blog/
    layout.jsx        wraps /blog and everything below it
    page.jsx          /blog
    archive/
      page.jsx        /blog/archive
```

Rendering `/blog/archive` composes them, outside in:

```txt
RootLayout > BlogLayout > ArchivePage
```

A nested layout is an ordinary component taking `children`:

```jsx
export default function BlogLayout({ children }) {
  return (
    <section>
      <nav>...</nav>
      {children}
    </section>
  );
}
```

Only the root layout renders `<html>` and `<body>`. Nested ones render whatever markup that
section needs.

# Layouts preserve state

This is the practical payoff. Navigating from `/blog` to `/blog/archive` re-renders the page, but
the layout **stays mounted** - it is not unmounted and rebuilt. A scrolled sidebar keeps its
scroll position, an open accordion stays open, a form in the layout keeps what you typed.

<Callout type="info" title="Note">
Need the opposite - a fresh mount on every navigation? Use `template.jsx` instead of
`layout.jsx`. Same shape, but a new instance per route change, which is what you want for enter
animations or a per-page analytics event.
</Callout>

# Route groups

Folders map to URL segments, which is tidy until you want to *organise* without changing URLs.
Wrap a folder name in parentheses and it becomes a **route group**: it exists on disk, but
contributes nothing to the path.

```txt
app/
  (marketing)/
    layout.jsx        wraps only the marketing pages
    pricing/page.jsx  ->  /pricing        (not /marketing/pricing)
    about/page.jsx    ->  /about
  (app)/
    layout.jsx        a completely different shell
    dashboard/page.jsx -> /dashboard
```

Two things this buys you: a shared layout for a *subset* of routes at the same URL depth, and two
sibling groups with entirely different shells - a marketing site and a signed-in app, in one
project.

<Callout type="warn" title="Careful">
Route groups do not change the URL, so two groups must not define the same route.
`(marketing)/about/page.jsx` and `(app)/about/page.jsx` both resolve to `/about` and the build
fails.
</Callout>

# Challenge

- `app/blog/layout.jsx` - default export a layout taking `children` and rendering a `section`
  with id `blog-layout`. Inside it: a `nav` with id `blog-nav` holding two `next/link`s - `Blog`
  to `/blog` and `Archive` to `/blog/archive` - followed by `children`.

- `app/blog/page.jsx` - default export a page rendering an `h1` with id `title` containing
  `Blog`.

- `app/blog/archive/page.jsx` - default export a page rendering an `h1` with id `title`
  containing `Archive`.

- `app/(marketing)/pricing/page.jsx` - default export a page rendering an `h1` with id `title`
  containing `Pricing`. It must serve `/pricing`, so the group name has to stay out of the URL.
