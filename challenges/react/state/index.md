In last challenge we learnt how to use props to change the output of a react components based on the data pasased into it.

There is second way to change the output of a react component and that is using `state`

# `Props` vs `State`

| Props                                                  | State                                                                      |
| ------------------------------------------------------ | -------------------------------------------------------------------------- |
| props get passed to the component(Function parameters) | state is managed within the component(variables declared in function body) |
| props are immutable                                    | state can be changed                                                       |

# State is Functional components

The state in functional components are created using `useState` hook.

```jsx
import { useState } from "react";

function App() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState("Taylor");
  const [todos, setTodos] = useState(() => createTodos());

  //...
}
```

Call `useState` at the top level of your component to declare a state variable.

## Parameters

- `initialState`: The value you want the sate to be initially. It can be of any type but there is special behaviour for function. This argument is ignored after the initial render.
  - If you pass a function as `initialState`, it will be treated as an initializer function. It should be pure, should take no arguments, and should return a value of any type. React will call your initializer function when initializing the component, and store its return value as the initial state.

## Returns

`useState` returns an array with exactly two values:

1. The current state. During the first render, it will match the `initialState` you have passed.
2. The `set` function that lets you update the state to a different value and trigger a re render.

Read more about `useState` [here](https://react.dev/reference/react/useState)

## Mutating State in Functional Components

Below is an example of a component which allows you to increase or decrease your age

```jsx
import {useState} from 'react';

function Age(){
    const [age,setAge] = useState(19);

    return (
        <div>
            <button onClick={()=>setAge((oldAge)=>oldAge-)}> - </button>
            <span>My age is {age}</span>
            <button onClick={()=>setAge((oldAge)=>oldAge+)}> + </button>
        </div>
    )
}
```

In the above code example, we create a state called `age` with initial value set to 19. Then we render 2 buttons and 1 span tag. We added click handler on each button using `onClick` attribute(we will learn about event handler in later challenge), the `onClick` takes in a function and set the age using `setAge` returned by `useState` hook. The `setAge` function can directly takes in a value or takes in a callback providing us with the older state value. We used the callback here because our new state depends on the old state and state updates in react are asyncronous.

# State in Class Components

The state in class components are created in `constructor`

```jsx
import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: 28,
      name: "Taylor",
      todos: this.createTodos(),
    };
  }

  render() {
    // Your component's rendering logic
    return <div>{/* Your component's JSX */}</div>;
  }
}

export default App;
```

In this class component:

- We use the `constructor()` method to initialize the component's state.
- We define state variables (`age`, `name`, and `todos`) as properties of `this.state`.
- We can access and modify the state using `this.state` and `this.setState()` respectively.

Read more about state in class components [here](https://react.dev/reference/react/Component#state)

## Mutating state in Class Components

Below is the same example as shown above but in class components

```jsx
import { Component } from "react";

class Age extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: 19,
    };
  }

  decreaseAge = () => {
    this.setState((prevState) => ({
      age: prevState.age - 1,
    }));
  };

  increaseAge = () => {
    this.setState((prevState) => ({
      age: prevState.age + 1,
    }));
  };

  render() {
    return (
      <div>
        <button onClick={this.decreaseAge}> - </button>
        <span>My age is {this.state.age}</span>
        <button onClick={this.increaseAge}> + </button>
      </div>
    );
  }
}

export default Age;
```

In above code you can see how we mutate state in a class components, we use `this.setState` function which is provided to us by extending `Component` from react.

# Challenge

You have to create 2 components:

- A class component in `src/components/class-state.jsx` which will return a span with id `likes` and 2 buttons, one with id `increase` and other with id `decrease`. The default value of likes is 0 and pressing on buttons will increase and decrease it. The content of span should be `Current likes: <likes>`. The count of likes should not go below 0 when we press decrease.

- A function component in `src/components/functional-state.jsx` which will have a state called `currentIndex` which will default to 0 and will return a span with id `currentColor` and 1 button with id `change` and it will set index to any random number such that it shows a color from below given array. (Make sure it set index to something which returns `undefined` when indexed). The content of span should be `Current Color: <color>`

```js
const colors = ["#FF5733", "#48C9B0", "#9B59B6", "#F7DC6F", "#2E86C1"];
```


You can also mount these components in `src/App.jsx` but this step is optional.

