An `<a href="/about">` works - and throws away everything the browser has already loaded. The
page blanks, the JavaScript bundle is re-parsed, your React state is gone.

Next.js gives you a client-side transition instead.

# `next/link`

```jsx
import Link from "next/link";

<Link href="/about">About</Link>;
```

`Link` renders a real `<a>` - so middle-click, "open in new tab" and screen readers all behave
normally - but it intercepts the click and swaps the page in place.

It also **prefetches**: when a `Link` scrolls into the viewport, Next.js quietly downloads the
code for that route in the background, so the transition is instant when the click comes.

```jsx
<Link href="/heavy-page" prefetch={false}>Later</Link>
```

## Linking to dynamic routes

`href` can be a string or an object:

```jsx
<Link href={`/blog/${post.slug}`}>{post.title}</Link>
<Link href={{ pathname: "/blog/[slug]", query: { slug: post.slug } }}>{post.title}</Link>
```

# `useRouter`

For navigation that is not a click on a link - after a form submits, after a login succeeds -
reach for the router:

```jsx
import { useRouter } from "next/router";

export default function LoginButton() {
  const router = useRouter();
  return <button onClick={() => router.push("/dashboard")}>Log in</button>;
}
```

| Method                | What it does                                            |
| --------------------- | ------------------------------------------------------- |
| `router.push(url)`    | navigate, adding an entry to the history stack           |
| `router.replace(url)` | navigate, replacing the current history entry            |
| `router.back()`       | go back one entry                                        |

The same hook tells you where you are. `router.pathname` is the **route**
(`/blog/[slug]`), `router.asPath` is the **URL as shown** (`/blog/hello-world`), and
`router.query` holds the dynamic segments and search params.

<Callout type="warn" title="Careful">
`useRouter` in the Pages Router comes from `next/router`. There is a different `useRouter` in
`next/navigation` for the App Router - importing the wrong one is a classic Next.js afternoon
lost.
</Callout>

## Marking the active link

`router.pathname` is all you need:

```jsx
<Link href="/blog" aria-current={router.pathname === "/blog" ? "page" : undefined}>
  Blog
</Link>
```

# Challenge

Build two components:

- `components/nav.jsx` - default export a component that renders a `nav` with id `nav`
  containing exactly three `Link`s, in this order:

  | Text | href     |
  | ---- | -------- |
  | Home | `/`      |
  | Blog | `/blog`  |
  | About| `/about` |

  The link whose `href` matches `router.pathname` must have `aria-current="page"`. The other two
  must not have the attribute at all.

- `components/login-button.jsx` - default export a component that renders a `button` with id
  `login` and the text `Log in`. Clicking it must call `router.push` with `/dashboard`.
