As a component grows, its state updates get spread across a dozen event handlers, each calling
a different `setState`. It becomes hard to see what can actually happen to the state.

`useReducer` moves all of that update logic into **one function outside the component**: a
reducer. Components then stop describing *how* to update state, and start describing *what
just happened*.

# The reducer

A reducer is a pure function that takes the current state and an **action**, and returns the
next state:

```js
function todosReducer(state, action) {
  switch (action.type) {
    case "added":
      return [...state, { id: action.id, text: action.text, done: false }];
    case "deleted":
      return state.filter((todo) => todo.id !== action.id);
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
```

It is a plain function - no hooks, no React - so it is trivially testable and easy to reason
about. It must be pure: no mutation, no fetching, no timers. Return a **new** array or object
instead of changing the one you were given.

# `useReducer`

```jsx
const [state, dispatch] = useReducer(todosReducer, initialState);
```

You get the current state and a `dispatch` function. Calling `dispatch(action)` runs the
reducer and re-renders with whatever it returned:

```jsx
<button onClick={() => dispatch({ type: "deleted", id: todo.id })}>Delete</button>
```

An action is any object you like, but the convention is a `type` string describing what
happened, plus any data the reducer needs.

## `useState` or `useReducer`?

| Use `useState` when                        | Use `useReducer` when                                     |
| ------------------------------------------ | --------------------------------------------------------- |
| the state is a single, independent value    | several values change together                             |
| updates are one-liners                      | the same update logic is triggered from many handlers      |
| there is no interesting logic               | the next state depends on the current one in complex ways  |

<Callout type="info" title="Note">
`dispatch` is stable - React guarantees it does not change between renders - so it is safe to
pass it deep into the tree, or leave it out of effect dependency arrays.
</Callout>

Read more about `useReducer` [here](https://react.dev/reference/react/useReducer).

# Challenge

You have to create a reducer and a component:

- `src/reducers/todos-reducer.js` - export two **named** exports:
  - `initialState` - an empty array.
  - `todosReducer(state, action)` - a pure reducer handling three action types:
    - `added` - appends `{ id: action.id, text: action.text, done: false }`
    - `toggled` - flips `done` on the todo whose `id` matches `action.id`
    - `deleted` - removes the todo whose `id` matches `action.id`

    Any other action type must throw an `Error`. The reducer must never mutate the state it
    is given.

- `src/components/todos.jsx` - default export a function component that manages its todos with
  `useReducer`. It renders:
  - a `form` with id `todo-form` containing an `input` with id `todo-input`. Submitting the
    form adds a todo with the input's text and clears the input. Submitting an empty (or
    whitespace only) input must add nothing.
  - a `ul` with id `todos` with one `li` per todo, keyed by id. Each `li` contains a `span`
    with the todo's text, a `button` with class `toggle` that toggles the todo, and a `button`
    with class `delete` that removes it.
  - A todo that is done must have `line-through` as the `text-decoration` style of its `span`.

You can also mount `Todos` in `src/App.jsx` but this step is optional.
