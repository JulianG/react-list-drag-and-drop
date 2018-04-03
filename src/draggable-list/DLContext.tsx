import * as React from 'react';

import DLItem from './DLItem';
import DLLogic from './DLLogic';
import DLFloatingItem from './DLFloatingItem';

interface Item {
  id: number;
}

interface Props {
  cssClasses: string;
  inlineStyle?: {};
  items: Array<Item>;
  layout: 'vertical' | 'horizontal' | 'grid';
  threshold: number;
  dragDelay: number;
  itemRenderer(index: number): JSX.Element;
  onChange(items: Array<Item>, changed: boolean): void;
}

export default class DLContext extends React.Component<Props, {}> {
  private logic: DLLogic;

  constructor(props: Props) {
    super(props);
    this.logic = new DLLogic(props.layout, props.threshold, props.dragDelay, this.handleDnDChange.bind(this));
  }
  
  render() {
    const cssClasses = this.props.cssClasses;
    const style = this.props.inlineStyle || {};
    const items = this.props.items;
    const manager = this.logic;
    const itemRenderer = this.props.itemRenderer;
    const draggedItemId = this.logic.getDraggedId();
    const draggedItem = items.findIndex(item => item.id === draggedItemId);

    return (
      <div className={cssClasses} style={style}>
        {items.map((item, i) => {
          return (
            <DLItem
              key={i}
              logic={manager}
              itemId={item.id}
              activity={manager.getDraggedId() >= 0}
              dragged={manager.getDraggedId() === item.id}
              hovered={manager.getHoveredId() === item.id}
            >
              {itemRenderer(i)}
            </DLItem>
          );
        })}
        <DLFloatingItem logic={manager}>
          {draggedItem >= 0 && itemRenderer(draggedItem)}
        </DLFloatingItem>
      </div>
    );
  }

  handleDnDChange(id0: number, id1: number) {
    const items = this.props.items;
    const index0 = items.findIndex(item => item.id === id0);
    const index1 = items.findIndex(item => item.id === id1);
    let newItems = [];
    if (index0 >= 0 && index1 >= 0) {
      newItems = this.logic.arrangeItems(this.props.items, index0, index1);
    } else {
      newItems = items;
    }
    this.props.onChange(newItems, newItems !== items);
  }
}
