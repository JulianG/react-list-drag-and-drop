# React List Drag and Drop

## Installation

```
npm install --save react-list-drag-and-drop
```

## Usage

You must have an `Array` of items to render in your list. Instead of rendering it inside a `<div>` you render it inside a `<RLDD>` component using a render prop.

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

You can play around with the examples

### Typescript

[![Edit Draggable List for React + Typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/10675l7213?autoresize=1&hidenavigation=1)

### Javascript 

[![Edit Draggable List for React + Typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/18050jnp27?autoresize=1&hidenavigation=1)
