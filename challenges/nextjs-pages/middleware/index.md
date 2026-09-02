`getServerSideProps` runs *while rendering a page*. Middleware runs **before Next.js has decided
which page to render** - one file, at the root of your project, in front of every matching
request.

```js
// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
```

That makes it the right place for anything that is about the *request* rather than the page: an
auth gate for a whole section, a locale or A/B cookie, a security header on every response.

# `NextRequest`

The argument is a `NextRequest` - a standard `Request` with the parts you always end up wanting:

| Property                      | What it is                                    |
| ----------------------------- | ---------------------------------------------- |
| `request.nextUrl.pathname`    | the path, e.g. `/dashboard/settings`           |
| `request.nextUrl.searchParams`| the query string, as `URLSearchParams`         |
| `request.cookies.get(name)`   | a cookie, or `undefined`                       |
| `request.headers.get(name)`   | a request header                               |
| `request.url`                 | the absolute URL - use it as the base for `new URL()` |

# `NextResponse`

What you return decides what happens next:

```js
NextResponse.next();                                   // carry on to the page
NextResponse.redirect(new URL("/login", request.url)); // 307, visible in the address bar
NextResponse.rewrite(new URL("/about", request.url));  // serve another page, URL unchanged
NextResponse.json({ error: "nope" }, { status: 401 }); // answer directly
```

**Redirect vs rewrite** is the distinction to hold on to. A redirect sends the browser somewhere
else and the URL changes. A rewrite is invisible: the visitor stays on `/about-us` and quietly
gets `/about`.

To pass something down to the page, set a header on a `next()` response:

```js
const response = NextResponse.next();
response.headers.set("x-locale", locale);
return response;
```

<Callout type="warn" title="Careful">
Always build URLs with `new URL(path, request.url)`. `NextResponse.redirect("/login")` throws -
it needs an absolute URL, and `request.url` is the base you have.
</Callout>

# `config.matcher`

Without a matcher, middleware runs on *every* request - including every image and script. Narrow
it:

```js
export const config = {
  matcher: ["/dashboard/:path*", "/about-us"],
};
```

The syntax is path-to-regexp: `:path*` matches the rest of the URL, `:id` matches one segment.

<Callout type="info" title="Note">
Middleware runs in the Edge runtime, not Node. No `fs`, no database drivers, no native modules -
and it should stay fast, because it is in front of every request it matches. Verify a session
cookie's shape here; look the session up in the page.
</Callout>

# Challenge

Write `middleware.js` in the root of the project:

- export a `middleware(request)` function that, based on `request.nextUrl.pathname`:
  - for a path starting with `/dashboard`, with no `token` cookie - redirects to `/login`
  - for a path starting with `/dashboard`, with a `token` cookie - continues to the page
  - for exactly `/about-us` - rewrites to `/about`
  - for anything else - continues to the page
- every response that continues to the page must carry the header `x-frameground` set to `1`
- export a `config` whose `matcher` is `["/dashboard/:path*", "/about-us"]`
