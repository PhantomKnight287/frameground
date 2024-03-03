In any web application we need to handle different events like button click, typing in an input etc.

This is where `Event Handling` comes in to play. The event handling in react is quite different from what we do in basic html.

# Differences 

- The name of events on are camel case, for example: `onclick` in react becomes `onClick`
- You pass function instead of function names in value, for example: `onclick="handleClick()"` becomes `onClick={handleEvent}`


<Callout title="Warning" type="warn">Do not call a function in event handler(`onClick={handleClick()}`), this will run the function as soon as component mounts in the DOM and not on click</Callout>

# Adding Event Handlers

To add an event handler, you will first define a function and then [pass it as a prop](/tracks/react/challenge/props) to the appropriate JSX tag. For example, here is an button that doesn't do anything _yet_:

```jsx
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

You can make it show a message when user clicks by following these three steps:

1. Declare a function called `handleClick` inside your `Button` component.
2. Implement the logic inside that function (use `alert` to show the message).
3. Add `onClick={handleClick}` to the `<button>` JSX.

```jsx
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}

```

You defined the handleClick function and then passed it as a prop to `<button>`. `handleClick` is an **event handler**. Event handler functions:

- Are usually defined _inside_ your components.
- Have names that start with `handle`, followed by name of the event.

By convention, it is common to name event handlers as `handle` followed by event name. You'll often see `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, and so on.



Alternatively, you can define an event handler inline in the JSX:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

Or, more concisely, using an arrow function:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```



## Reading props in event handlers

Because event handlers are declared inside of a component, they have access to the component’s props. Here is a button that, when clicked, shows an alert with its `message` prop:


```jsx
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}

```

This lets these two buttons show different messages.


> The above text and examples are taken from offical react docs. To know about handling events, we recommend you to read the offical react docs [here.](https://react.dev/learn/responding-to-events)


## Challenge

Create a component in `src/components/input.jsx` which has an input with `type="text"` and a event listener on `onChange` event which should get the value entered by user and show in a span with `id="content"`.

> Hint: You've to create a state and update it when content inside input changes, then render it in span.