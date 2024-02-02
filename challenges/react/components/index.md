Components are the building blocks of a React application, each component is a self-contained module that renders some output. Components can be nested within other components to allow complex applications to be built out of simple building blocks.

Components can be either functional or class based. Functional components are just functions that return JSX, while class based components are classes that extend the `React.Component` class and implement a `render` method that returns JSX.

The components are usually declared in files ending with `.jsx` or `.js` extensions. The `.jsx` extension is used to indicate that the file contains JSX, while the `.js` extension is used to indicate that the file contains JavaScript. The `.jsx` extension is not required, but it is a good practice to use it to indicate that the file contains JSX. If you are using typescript, then the extensions will be `.tsx`

## Functional Components

Functional components are the simplest type of component, they are just functions that return JSX. Below is an example of a functional component that renders my name in a `h1` tag.

```jsx
export default function Name() {
  return <h1>Gurpal Singh</h1>;
}
```

Lets break down the above code and understand it line by line.

```jsx
export default function Name(){
```

The above line is the function declaration, it declares a function called `Name` and exports it as the default export of the module. This means that when we import this module we can import it as any name we want, and we don't need to use curly braces around the name. You can read more about imports [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)

```jsx
return <h1>Gurpal Singh</h1>;
```

The above line is the return statement, it returns a JSX element. JSX is a syntax extension to JavaScript that allows us to write HTML like code in our JavaScript files. You can read more about JSX [here](https://react.dev/learn/writing-markup-with-jsx)(we will cover JSX in more detail in a later challenge).

```jsx
}
```

The above line is the end of the function declaration, it closes the function body.

## Class Based Components

Class based components are classes that extend the `React.Component` class and implement a `render` method that returns JSX. Below is an example of a class based component that renders my name in a `h1` tag.

```jsx
export default class Name extends React.Component {
  render() {
    return <h1>Gurpal Singh</h1>;
  }
}
```

Lets also break down the above code and understand it line by line.

```jsx
export default class Name extends React.Component {
```

The above line is the class declaration, it declares a class called `Name` and exports it as the default export of the module.

```jsx
render() {
    return <h1>Gurpal Singh</h1>;
}
```

The above lines are the `render` method, it returns a JSX element which will be rendered to the DOM. We will also cover a bit of class components in a later challenge.

```jsx
}
```

The above line is the end of the class declaration, it closes the class body.

## Output

![Imgur](/imgur/gFf23ud.png)

The above image shows the output of functional components.

![Imgur](/imgur/gFf23ud.png)

The above image shows the output of class based components.

The output is same for both components.

## Which one to use?

Now the question is which type of components to use?

Most developers prefer to use functional components over class components after the introduction of react hooks in [v16.8](https://legacy.reactjs.org/blog/2019/02/06/react-v16.8.0.html) but it is important to know both types of components as you will encounter class components in many codebases.

## Challenge

There are 2 files in the `src` folder, `functional-component.jsx` and `class-component.jsx`. Both files returns empty `h1` for now, your task is to add content in `h1` that renders `Hello world from functional component` for `functional-component.jsx` and `Hello world from class component` for `class-component.jsx`.
