Form handling is a crucial part of any web application to keep track of many things. For example: Amazon uses it to keep track of your credit/debit cards, your delivery address and many other things.

Forms in react are of 2 types:

- Controlled
- UnControlled

## UnControlled

Forms where the form data is handled by DOM itself and values are accessed using `useRef`. We will study about this method later once we learn about [`useRef`](https://react.dev/reference/react/useRef).

## Controlled

Forms where the form data is handled by the React's state. We will study this method thoroughly.

You must know about [`State`](/tracks/react/challenge/state) before moving forward.

Lets imagine a scenario where you have to create a form where a user will enter his name and password to login. Below is the design of how we will implement this.

- We will first create state for values
- We will create required input elements
- Add event listeners on input elements and update value on change
- Submit the form and perform actions based on input

Lets see how this will look in code

```jsx
import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    alert(`Welcome back ${username}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
```

This will render 2 input elements in DOM, you can enter your username and password then submit the form by pressing Login button(or by pressing enter once you are done entering values). It will show an alert showing you your username.

But, did you notice one thing? The page refreshed and our data is done gone. This is not what you want to happen in real life right? We need a way to somehow stop page from reloading.

We can do this in our `handleSubmit` function. It gets an `event` as parameter which has a `preventDefault` function on it. You can read more about it [here](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault).

Now our code is gonna look like this.

```jsx
import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Welcome back ${username}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
```

And this works as expected.

Try to add a hide and unhide button in password input as an exercise 😉

If you managed to do that you can submit your implementation in [Github Discussions](https://github.com/PhantomKnight287/frameground/discussions/7)

## Challenge

There are two files in `components` folder.

- Create a component, exported default, which renders 2 input field for title and description. It must take a function called `onSubmit` as prop and pass the submit event, name and description as its parameters.

- Create a component, exported default, which renders 1 select field and 1 name field for role and name. It must take a function called `onSubmit` as prop and pass the submit event, name and role as its parameters.

More details are present in files.

<Callout type="error" title="Warning" >

You must add all props to input elements listed in description present in files else tests will fail.

</Callout>
