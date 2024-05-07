Styling your React application is crucial for creating a visually appealing and user-friendly interface.

You can style your react application in different ways:

- Inline styles
- Global styles
- Css Modules
- Css in JS Libraries

We will explore the first three ways.

## Inline styles

If you are familiar with basic HTML, you will know that it is possible to add your [css inline](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style). This is also possible in React.

We can add inline styles to any JSX element we want to render(which accepts style prop). You pass an object as style instead of a string, the key of the style is camelCased version of actual attribute and the value is usually a string.

Below is an example:

```jsx
export default function InlineStyle() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>Hello</h1>
      <h2>World</h2>
    </div>
  );
}
```

As you can see above, the `style` prop is an object. The `flex-direction` is written as `flexDirection` and `font-size` is written as `fontSize` and so on.

![img](/imgur/OMPWIZ6.png)

## Global Styles

You can also style your application by importing a css file and adding `className` prop.

Below is an example:

```css
/* styles.css */

.container {
  display: flex;
  flex-direction: column;
}
```

```jsx
import "./styles.css";

export default function CssImport() {
  return (
    <div className="container">
      <h1>Hello</h1>
      <h2>World</h2>
    </div>
  );
}
```


As you can see above, div has a className of `container` and there are styles defined in the css file. 

![img](/imgur/PbjCr3G.png)


But this approach has a problem. If we give `container` class to any other element which, the same styles will be applied on it too(as long as they're a child of `CssImport` component). But what if we don't want that to happen?

Then we use Css Modules.


## Css Modules

A Css Module is a Css file in which all styles are scoped locally by default. This file ends with `.module.css` instead of just `.css`.

Lets see an example, We will use the same code as above but with slight modifications.

```css
/* styles.module.css */

.container {
  display: flex;
  flex-direction: column;
}
```

```jsx
import styles from "./styles.module.css";

export default function CssModule() {
  return (
    <div className={styles.container}>
      <h1>Hello</h1>
      <h2>World</h2>
    </div>
  );
}
```

As you can see above that the code is almost same. The only difference is the name of css file and how we use it.

The css modules are imported just like any other module and classes are accessed by dot notation.

The above code will produce given output.

![img](/imgur/PJPfWS7.png)

As you can see that the class is not `container` but a random class is generated. This randomness ensures that this style doesn't replicate on other elements until specified. If we add another element with classname set to `container`, the styles won't apply.




There are other ways to style your react application like Css In Js Libraries. You can read more about them in this [css-tricks article](https://css-tricks.com/a-thorough-analysis-of-css-in-js/).


You should explore styling libraries and find out which one works best for you. There are many other options like Tailwindcss, UnoCss etc. 



## Challenge

### Global styles

In `src/components/StyleSheet.jsx` import `styles.css` file and add a class called `heading`. Give that class to any element. You are free to add whatever styles you want in that class.

### Css Modules

In `src/components/Module.jsx` import `styles.module.css` file and add any class to element with `data-testid="css_module_target`. You are free to add whatever styles you want in that class.

### Inline Css

In `src/components/Inline.jsx` add a background color and font size to element with `data-testid="inline_css_target"`. You are free to add whatever styles you want but background color and font size are required.

<Callout type="warn" title="Warning">

Do not remove the `data-testid` prop. All tests will fail if this prop is not present in code.

</Callout>
