import * as React from 'react';

import DLItem from './DLItem';
import DLLogic from './DLLogic';
import DLFloatingItem from './DLFloatingItem';

export interface DLContextItem {
  id: number;
}

export interface DLContextProps {
  cssClasses: string;
  inlineStyle?: {};
  items: Array<DLContextItem>;
  layout: 'vertical' | 'horizontal' | 'grid';
  threshold: number;
  dragDelay: number;
  itemRenderer(index: number): JSX.Element;
  onChange(items: Array<DLContextItem>, changed: boolean): void;
}

export default class DLContext extends React.Component<DLContextProps, {}> {
  private logic: DLLogic;

  constructor(props: DLContextProps) {
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
    const draggedItem = this.findItemIndexById(draggedItemId);

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

  private handleDnDChange(id0: number, id1: number) {
    const items = this.props.items;
    const index0 = this.findItemIndexById(id0);
    const index1 = this.findItemIndexById(id1);
    let newItems = [];
    if (index0 >= 0 && index1 >= 0) {
      newItems = this.logic.arrangeItems(this.props.items, index0, index1);
    } else {
      newItems = items;
    }
    this.props.onChange(newItems, newItems !== items);
  }

  private findItemIndexById(id: number): number {
    const item = this.props.items.find(it => it.id === id);
    return item ? this.props.items.indexOf(item) : -1;
  }
}
