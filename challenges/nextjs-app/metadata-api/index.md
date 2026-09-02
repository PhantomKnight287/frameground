The `<head>` of the document decides how your page looks in a browser tab, in search results, and
in the preview card someone gets when they paste the link into Slack. You never render those tags
yourself: metadata is **data you export**, and Next.js turns it into tags. No component to render,
no ordering to worry about, no duplicate `og:title` to de-duplicate by hand.

```jsx
export const metadata = {
  title: "About",
  description: "Who we are",
};

export default function About() {
  return <h1>About</h1>;
}
```

Export it from a `layout.jsx` or a `page.jsx`. Metadata is merged from the root down, and the
closest one wins per field - so a description set in the root layout applies to every page that
does not set its own.

# Title templates

Titles are the one field with real structure. In the root layout:

```jsx
export const metadata = {
  title: {
    default: "FrameGround",
    template: "%s | FrameGround",
  },
};
```

- A page that exports no title gets `FrameGround`.
- A page that exports `title: "Blog"` gets `Blog | FrameGround` - `%s` is replaced.
- A page that needs to escape the template exports `title: { absolute: "Something else" }`.

This is the fix for every site whose tabs all read `My Site - My Site | My Site`.

# `generateMetadata`

A blog post's title is not known until you have the post, so export a function instead:

```jsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}
```

It receives the same `params` and `searchParams` as the page - as promises - and returns the same
shape as the static export. Use one or the other in a file, never both.

<Callout type="info" title="Note">
Fetching the same data in `generateMetadata` and in the page does not double your requests:
`fetch` calls are deduplicated within a render, and your own helpers can be wrapped in React's
`cache` to get the same behaviour.
</Callout>

## Other fields worth knowing

```jsx
export const metadata = {
  openGraph: { title, description, images: ["/og.png"] },
  robots: { index: false },
  alternates: { canonical: "https://frameground.dev/blog" },
};
```

There is also a file convention: an `icon.png`, `opengraph-image.png` or `robots.txt` placed in
`app/` is picked up automatically, no configuration needed.

# Challenge

`lib/posts.js` ships `getPost(slug)`, returning a post with a `title`, `excerpt` and `body`, or
`undefined`.

- `app/layout.jsx` - keep the existing shell (an `html` with `lang="en"` containing a `body` that
  renders `children`) and export a `metadata` object whose `title` has the default
  `FrameGround` and the template `%s | FrameGround`, and whose `description` is
  `Learn Next.js by building`.

- `app/blog/[slug]/page.jsx` -
  - export an async `generateMetadata` that awaits `params`, loads the post, and returns:
    - for a post that exists - its `title`, its `excerpt` as the `description`, and an
      `openGraph` object carrying the same `title` and `description`
    - for a slug with no post - the title `Post not found`, and nothing else
  - default export an async page that renders an `h1` with id `title` containing the post's
    title and a `p` with id `body` containing its body
