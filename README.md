# React List Drag and Drop

## Installation

```
npm install --save react-list-drag-and-drop
```

## Usage

You must have an `Array` of items to render in your list. Instead of rendering it inside a `<div>` you render it inside a `<RLDD>` component using a render prop.

```
import DLContext from 'react-list-drag-and-drop/lib/DLContext';
```

```
<RLDD
  items={items}
  itemRenderer={(i: number) => {
    return (
      <div className="item">{items[i].title}</div>
    );
  }}
  onChange={this.handleDnDContextChange}
/>
```
Then you need to handle the onChange callback and call `setState` with the new list. Like this:
```
  private handleDnDContextChange(newItems: Array<Item>) {
    this.setState({ items: newItems });
  }
```

Play around with the examples

### Typescript

[![Edit Draggable List for React + Typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/10675l7213?autoresize=1&hidenavigation=1)

### Javascript 

[![Edit Draggable List for React + Typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/18050jnp27?autoresize=1&hidenavigation=1)
