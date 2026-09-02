A blog index does not change between one visitor and the next. Rendering it on every request is
work you are paying for over and over, for an identical result.

**Static generation** does it once, at build time, and serves the finished HTML from a CDN. In
the Pages Router you opt in by exporting one function from a page.

# `getStaticProps`

```jsx
export default function Blog({ posts }) {
  return <ul>{posts.map((p) => <li key={p.slug}>{p.title}</li>)}</ul>;
}

export async function getStaticProps() {
  const posts = await getPosts();
  return { props: { posts } };
}
```

Three things worth being precise about:

1. It runs **on the server, at build time** - never in the browser. Its code (and anything it
   imports) is stripped out of the client bundle, so a database query or an API key is fine here.
2. It must return an object with a `props` key. Those props are passed to the page component.
3. It only works in a **page** file. Exporting it from a component does nothing at all.

Because it runs before any request exists, `getStaticProps` has no access to `req`, cookies,
headers or the current user. If you need those, you want `getServerSideProps` - later in this
track.

## The context argument

```js
export async function getStaticProps(context) {}
```

| Key            | What it is                                                    |
| -------------- | ------------------------------------------------------------- |
| `params`       | dynamic route segments, for pages like `[slug].jsx`            |
| `preview`      | whether the page is being rendered in preview mode             |
| `previewData`  | the data you set when enabling preview mode                    |

## Other things it can return

```js
return { notFound: true };                              // render the 404 page
return { redirect: { destination: "/login", permanent: false } };
return { props: { posts }, revalidate: 60 };            // regenerate at most once a minute
```

<Callout type="warn" title="Careful">
Props must be **JSON-serialisable**. A `Date` object, `undefined`, a `Map` or a class instance
will throw at build time. Convert first - `date.toISOString()` is the usual fix - or use `null`
instead of `undefined`.
</Callout>

# Challenge

`lib/posts.js` ships `getPosts()`, which returns posts with a `slug`, `title` and an ISO
`date` string, in no particular order.

Write `pages/blog/index.jsx`:

- export an async `getStaticProps` that returns the posts as a `posts` prop, sorted **newest
  first** by `date`
- default export a page taking a `posts` prop and rendering:
  - an `h1` with id `title` containing `Blog`
  - a `p` with id `count` containing the number of posts
  - a `ul` with id `posts`, one `li` per post containing the post's title, in the order given
