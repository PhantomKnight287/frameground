`getStaticProps` renders a page at build time. But `pages/blog/[slug].jsx` is not one page - it
is one page *per post*, and at build time nobody has requested a URL yet. Next.js needs the list
up front.

That list is what `getStaticPaths` returns.

```jsx
export async function getStaticPaths() {
  const posts = await getPosts();

  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPost(params.slug);
  return { props: { post } };
}
```

Next.js walks the `paths` array, calls `getStaticProps` once per entry with those `params`, and
writes out one HTML file for each.

<Callout type="warn" title="Careful">
Every value in `params` must be a **string** - `{ id: 1 }` throws, `{ id: "1" }` is right. For a
catch-all route like `[...slug].jsx`, pass an array of strings instead.
</Callout>

# `fallback` decides what happens to everything else

A visitor asks for `/blog/a-post-that-did-not-exist-at-build-time`. `fallback` is your answer.

| Value        | Behaviour                                                                     |
| ------------ | ----------------------------------------------------------------------------- |
| `false`      | 404 immediately. The paths you listed are the only ones that exist.           |
| `true`       | Serve a placeholder page, generate in the background, then swap in the content.|
| `"blocking"` | Wait for the server to generate it, then serve real HTML. No placeholder.      |

Use `false` for a small, complete set - documentation, a marketing site. Use `"blocking"` when
new records appear all the time and you do not want to rebuild the site for each one. Use `true`
when you also want the first visitor to see something immediately.

With `fallback: true` the page renders **before** its props exist, so it must handle that:

```jsx
const router = useRouter();
if (router.isFallback) return <p>Loading...</p>;
```

## Handling records that do not exist

With `fallback: "blocking"` or `true`, `getStaticProps` runs for any URL that matches the
pattern - including ones with no record behind them. Say so explicitly:

```js
const post = await getPost(params.slug);
if (!post) return { notFound: true };
```

`{ notFound: true }` renders the 404 page with a proper 404 status, and does not cache the miss
forever.

# Challenge

Write `pages/blog/[slug].jsx` using the `getPosts()` and `getPost(slug)` helpers from
`lib/posts.js`:

- export an async `getStaticPaths` that returns a `paths` entry for every post - each one
  `{ params: { slug } }` - with `fallback` set to `"blocking"`
- export an async `getStaticProps` that receives `{ params }` and
  - returns `{ notFound: true }` when no post matches the slug
  - otherwise returns the post as a `post` prop
- default export a page taking a `post` prop and rendering:
  - an `h1` with id `title` containing the post's title
  - a `time` with id `date` whose `dateTime` attribute is the post's `date`
