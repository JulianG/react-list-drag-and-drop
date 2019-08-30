# React List Drag and Drop

**This package has not been tested on mobile browsers or React Native. SORRY!**

[![Build Status](https://travis-ci.org/JulianG/react-list-drag-and-drop.svg?branch=master&x)](https://travis-ci.org/JulianG/react-list-drag-and-drop)

----

![React List Drag and Drop Example](https://github.com/JulianG/react-list-drag-and-drop/blob/master/demos/horizontal-fruits.gif?raw=true "React List Drag and Drop Example")

![React List Drag and Drop Example](https://github.com/JulianG/react-list-drag-and-drop/blob/master/demos/vertical-fruits.gif?raw=true "React List Drag and Drop Example")

## Installation

```
npm install --save react-list-drag-and-drop
```

## Usage

You must have an `Array` of items to render in your list.  
Instead of rendering it inside a `<div>` you render it inside a `<RLDD>` component using a render prop.

```javascript
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
```

```jsx
<RLDD
  items={items}
  itemRenderer={(item) => {
    return (
      <div className="item">{item.title}</div>
    );
  }}
  onChange={this.handleRLDDChange}
/>
```
Then you need to handle the onChange callback and call `setState` with the new list. Like this:
```javascript
  private handleRLDDChange(newItems) {
    this.setState({ items: newItems });
  }
```

Each item must be of type `Object` and have an `id` property of type `number`.  

You can play around with the examples

### Typescript

[![Edit Draggable List for React + Typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/k517m55m2v?autoresize=1&hidenavigation=1)

### Javascript 

[![Edit Draggable List for React + Typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/18050jnp27?autoresize=1&hidenavigation=1)
