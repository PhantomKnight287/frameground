In React, components are the building blocks of the user interface, and they can be broken down into smaller, reusable pieces. Props allow these components to be dynamic and customizable by passing data down the component tree.

## Passing Props

Props are passed from parent components to child components as attributes. Here's an example:

```jsx
// ParentComponent.jsx

import React from 'react';
import ChildComponent from './ChildComponent';

function ParentComponent() {
  return (
    <div>
      <ChildComponent name="John" age={30} />
    </div>
  );
}

export default ParentComponent;
```

In the above example, the `name` and `age` props are passed to the `ChildComponent` component.

## Accessing Props

In the child component, props can be accessed using the `props` object. Here's how you can access props in a functional component:

```jsx
// ChildComponent.jsx

import React from 'react';

function ChildComponent(props) {
  return (
    <div>
      <p>Name: {props.name}</p>
      <p>Age: {props.age}</p>
    </div>
  );
}

export default ChildComponent;
```

In this example, `props.name` and `props.age` are accessed within the `ChildComponent`.

## Using Props Dynamically

Props can be used to make components dynamic and reusable. For example, you can pass different data to the same component to render different outputs.

```jsx
// ParentComponent.jsx

import React from 'react';
import ChildComponent from './ChildComponent';

function ParentComponent() {
  return (
    <div>
      <ChildComponent name="Alice" age={25} />
      <ChildComponent name="Bob" age={40} />
    </div>
  );
}

export default ParentComponent;
```

In this example, `ParentComponent` renders two instances of `ChildComponent` with different props.

## Conclusion

Props are a powerful feature in React that enable components to be dynamic and reusable. By passing data from parent components to child components, props allow you to create flexible and customizable user interfaces. Understanding how to work with props is essential for building React applications efficiently.

## Challenge

There are two files in `src/components` folder, `greet.jsx` and `age.jsx`. You task is to create a component in each file. The component in `greet.jsx` must take a `name` as a prop and return "Hello name" inside a div and component in `age.jsx` must take `age` as a prop and return "My age is age" inside a div.

Your job is to also import and mount these components in `src/App.jsx`.