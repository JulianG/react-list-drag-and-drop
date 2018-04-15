# React List Drag and Drop

## Installation

```
npm install --save react-list-drag-and-drop
```

## Usage

You must have an `Array` of items to render in your list. Instead of rendering it inside a `<div>` you render it inside a `<DLContext>` using a render prop.
```
<DLContext
  cssClasses="example"
  layout={'vertical'}
  threshold={15}
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

For a working example, see [**Draggable List of Bananas**]([https://codesandbox.io/s/10675l7213) in CodeSandbox

[![Edit Draggable List for React + Typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/10675l7213?autoresize=1&hidenavigation=1)
---