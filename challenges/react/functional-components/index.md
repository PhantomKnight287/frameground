Functional components are just javascript functions which takes in parameters called props and returns jsx as output.


![Imgur](/imgur/kAPcgqP.png)


## Exporting functional components

To keep our code more organized, we defined components in one file and then export them to use in another file. There are 2 ways to export a component:

- Named export
- Default export


### Named export

Named export allows us to export multiple components from a single file. We can export a component using the following syntax:

```jsx
export const MyComponent = () => {
  return <h1>Hello Gurpal</h1>;
};
```

In the above example, we are exporting a component named `MyComponent` using named export. We can import this component in another file using the following syntax:

```jsx
import { MyComponent } from './MyComponent';
```


### Default export

Default export allows us to export a single component from a single file. We can export a component using the following syntax:

```jsx
const MyComponent = () => {
  return <h1>Hello Gurpal</h1>;
};

export default MyComponent;
```

In the above example, we are exporting a component using default export. We can import this component in another file using the following syntax:

```jsx
import MyComponent from './MyComponent';
```


## Differences between named and default export

- We can have multiple named exports in a single file but only one default export.
- We can import named exports using the same name as the exported component but we can import default exports using any name we want.


## Challenge

There is a file called `greet.jsx` in `src/components` folder. You have to create 2 components in this file and export one using named export and the other using default export.

The named export component should be named `Greet` but you are free to choose any name for the default export component.

The components should return "Hello Name" where name can be anyone's name. 

You also have to import these components in `App.jsx` and render them in `App` component.
