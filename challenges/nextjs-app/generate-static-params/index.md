A dynamic segment like `[slug]` is not one page - it is one page *per record*. At build time
nobody has requested a URL yet, so Next.js needs the list up front, and
`generateStaticParams` is how you hand it over.

```jsx
export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({ slug: post.slug }));
}
```

Next.js then calls your page once per entry, at build time, with those params. Note the shape:
each entry is **flat** - `{ slug }`, not `{ params: { slug } }` - and there is no key for
"everything else". What happens to unlisted paths is a separate setting.

<Callout type="info" title="Note">
Values must be strings. For a catch-all segment, return an array:
`{ slug: ["api", "create-user"] }`.
</Callout>

# Route segment config

A handful of exported constants configure how a route behaves. They are plain named exports,
which means they are statically analysable - Next.js reads them without running your page.

| Export                        | Effect                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| `dynamicParams = false`       | a path not in `generateStaticParams` 404s instead of rendering |
| `revalidate = 3600`           | regenerate this route at most once an hour                     |
| `dynamic = "force-dynamic"`   | never prerender; render on every request                       |
| `dynamic = "force-static"`    | prerender, and treat dynamic APIs as empty                     |

`dynamicParams` defaults to `true`: an unknown slug is rendered on demand and then cached, so the
build only has to cover the paths you know about. Setting it to `false` means the listed paths are
the only ones that exist, and anything else is a 404.

```jsx
export const dynamicParams = false;
export const revalidate = 3600;
```

Together, these two lines describe a very common shape: a fixed set of pages, built once,
refreshed hourly.

<Callout type="warn" title="Careful">
Reading a dynamic API - `cookies()`, `headers()`, or `searchParams` - opts the route out of
static rendering entirely, no matter what `generateStaticParams` returns. If a page you expected
to be static is being rendered per request, that is usually why.
</Callout>

# Challenge

`lib/posts.js` ships `getPosts()` and `getPost(slug)`.

Write `app/blog/[slug]/page.jsx`:

- export an async `generateStaticParams` returning one `{ slug }` object per post
- configure the route so that a slug with no post returns a 404 rather than being rendered on
  demand
- configure the route to regenerate at most once every `3600` seconds
- default export an async page that awaits `params`, loads the post, and renders an `h1` with id
  `title` containing its title and a `time` with id `date` whose `dateTime` attribute is the
  post's `date`
