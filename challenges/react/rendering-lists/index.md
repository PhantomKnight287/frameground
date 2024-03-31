List rendering is one of the essential aspects of front-end development. A significant amount of data is displayed in list formats on web pages, such as displaying search results, showing a list of items added to a shopping cart, populating dropdown menus, and so on.

Consider this scenario: you're tasked with building a grocery list. The most straightforward way to achieve this would be to manually write a list and individually write out each item. This approach, albeit feasible, is tedious and inefficient. If instead, you had an array of grocery items, and your task was to display them on a webpage. With React.js, this can be accomplished easily and efficiently using the JavaScript method called [`.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). The .map() method is used to create a new array with the results of calling a function for every array element.


Suppose we have a list of names that we want to map to individual `<li>` elements.

```tsx
import React from 'react';

function MainComponent() {
  const names = ["John", "Doe", "Max", "Irina"];

  return (
    <div>
      {names.map((name, index) => {
        return <p key={index}>{name}</p>
      })}
    </div>
  );
}

export default MainComponent;
```


In our `MainComponent`, we are creating a `div` that contains a list of names. Each name is mapped to a `<p>` tag, and it includes a `key` attribute which I will explain now.

The `key` attribute in the JSX element is a special string attribute that you need to include when creating a list of elements in React. Keys help React identify which items have changed or have been added or removed. Keys should be assigned to the elements inside the array to give the elements a stable identity. We use the array index as a key. However, using the index as a key is safe only when the list items do not have the possibility to change, or re-order.

Let's take a more complex example, a list of groceries. Each grocery item will have a `name`, `quantity` and `id` which we will use as the key:

```tsx
import React from 'react';

function GroceryComponent() {
  const groceries = [
    { id: 1, name: 'Apple', quantity: 5 },
    { id: 2, name: 'Banana', quantity: 10 },
    { id: 3, name: 'Mango', quantity: 2 },
    { id: 4, name: 'Pineapple', quantity: 1 },
  ];

  return (
    <div>
      {groceries.map((item) => {
        return <p key={item.id}> {item.name} - {item.quantity} </p>
      })}
    </div>
  );
}

export default GroceryComponent;
```

In the example, you can see that the map function iterates over each grocery object in the groceries array. Each item is then rendered as a paragraph with the id used as a key.

Next, let's talk about filtering through a list. Sometimes, we might not want to display the entire list, but only the items that meet certain conditions.

Let's say, for example, you want to only show the items with a quantity greater than 2:

```tsx
import React from 'react';

function GroceryComponent() {
  const groceries = [
    { id: 1, name: 'Apple', quantity: 5 },
    { id: 2, name: 'Banana', quantity: 10 },
    { id: 3, name: 'Mango', quantity: 2 },
    { id: 4, name: 'Pineapple', quantity: 1 },
  ];

  const filteredList = groceries.filter(item => item.quantity > 2);

  return (
    <div>
      {filteredList.map((item) => {
        return <p key={item.id}> {item.name} - {item.quantity} </p>
      })}
    </div>
  );
}

export default GroceryComponent;
```


## Challenge

Create a table component in `src/components/table` with proper `thead` and `tbody`. You can import data from `src/components/data`(already imported). In `tbody` give each `tr` an `id` which is equal to `id` provided in data. 

Create another column in table called `actions`. Add a delete button which will remove given element from the array. 