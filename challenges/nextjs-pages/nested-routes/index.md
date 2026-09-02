One file, one route - and folders nest. A folder in `pages/` becomes a **URL segment**, and the
file inside it becomes the last segment.

```txt
pages/
  index.jsx            ->  /
  about.jsx            ->  /about
  blog/
    index.jsx          ->  /blog
    hello-world.jsx    ->  /blog/hello-world
  docs/
    getting-started.jsx ->  /docs/getting-started
```

# `index` is the folder itself

This is the only naming rule worth memorising: **`index` means "the folder's own route"**.
`pages/blog/index.jsx` serves `/blog`, not `/blog/index`. Without it, `/blog` would 404 even
though `/blog/hello-world` works perfectly well - a folder is not a page.

<Callout type="info" title="Note">
`pages/blog.jsx` and `pages/blog/index.jsx` both serve `/blog`. Pick one - shipping both is a
conflict, and Next.js will tell you so.
</Callout>

## Two files with the same name

Nothing stops you from having `pages/about.jsx` and `pages/blog/about.jsx`. They are different
routes (`/about` and `/blog/about`) and different components. The path is the identity.

## Files that are not routes

Everything outside `pages/` is just code. Components, helpers and data live wherever you like -
`components/`, `lib/`, `utils/` - and are imported by pages. Only `pages/` is special.

Two files inside `pages/` are also not routes: `_app.jsx` and `_document.jsx`. The leading
underscore is how Next.js marks them as framework files. You will meet both later in this track.

# Challenge

The playground ships a `components/post-list.jsx` component. Build the routes around it:

- `pages/blog/index.jsx` - default export a component that renders an `h1` with id `title`
  containing `Blog`, and the `PostList` component imported from `@/components/post-list`.

- `pages/blog/hello-world.jsx` - default export a component that renders an `h1` with id `title`
  containing `Hello World`, and a `p` with id `body` containing `My first post`.

- `pages/docs/getting-started.jsx` - default export a component that renders an `h1` with id
  `title` containing `Getting Started`.

Then open `/blog`, `/blog/hello-world` and `/docs/getting-started` in the preview.
