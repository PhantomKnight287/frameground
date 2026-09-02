The `<head>` of the document decides how your page looks in a browser tab, in Google results,
and in the preview card someone gets when they paste the link into Slack. In the Pages Router
you edit it from inside your components, with `next/head`.

```jsx
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | FrameGround</title>
        <meta name="description" content="Learn Next.js by building" />
      </Head>
      <h1>Home</h1>
    </>
  );
}
```

Whatever you nest inside `<Head>` is hoisted into the real `<head>` element - and removed again
when the component unmounts, so a title set by one page does not leak into the next.

# Duplicates and `key`

Two components can both contribute head tags: a global `<Head>` in `_app.jsx` with sensible
defaults, and a page-level `<Head>` that overrides some of them. Without help, you end up with
two `og:title` tags.

Give the tag a `key` and the last one wins:

```jsx
<meta property="og:title" content={title} key="og:title" />
```

`<title>`, `<base>` and charset are de-duplicated automatically. Everything else needs a `key`.

<Callout type="info" title="Note">
Only meta-ish tags belong in `<Head>`: `title`, `meta`, `link`, `script`. Do not put your page
content in there.
</Callout>

## An SEO component

Repeating six tags on every page gets old fast. Wrap them once:

```jsx
export default function Seo({ title, description }) {
  return (
    <Head>
      <title>{`${title} | FrameGround`}</title>
      <meta name="description" content={description} />
    </Head>
  );
}
```

Now a page is one line: `<Seo title="Blog" description="Posts about the web" />`.

<Callout type="warn" title="Careful">
A `<title>` must contain a single string. `<title>{title} | FrameGround</title>` produces three
children and Next.js will warn. Build the string first, as above.
</Callout>

# Challenge

- `components/seo.jsx` - default export a `Seo` component taking `title` and `description`
  props. It renders a `next/head` containing, in this order:
  - a `title` whose text is `<title> | FrameGround`
  - `<meta name="description" content={description} />`
  - `<meta property="og:title" content={title} />` with the key `og:title`
  - `<meta property="og:description" content={description} />` with the key `og:description`

- `pages/index.jsx` - default export a page that renders `Seo` with the title `Home` and the
  description `Learn Next.js by building`, followed by an `h1` with id `title` containing
  `Home`.
