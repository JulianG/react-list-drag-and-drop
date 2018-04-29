import * as React from 'react';

import RLDDItemComponent from './RLDDItemComponent';
import RLDDLogic from './RLDDLogic';
import RLDDFloatingItemComponent from './RLDDFloatingItemComponent';

export interface RLDDItem {
  id: number;
}

export interface RLDDProps {
  cssClasses?: string;
  inlineStyle?: {};
  layout?: 'vertical' | 'horizontal' | 'grid';
  threshold?: number;
  dragDelay?: number;
  items: Array<RLDDItem>;
  itemRenderer(item: RLDDItem, index: number): JSX.Element;
  onChange(items: Array<RLDDItem>, changed: boolean): void;
}

export default class RLDD extends React.Component<RLDDProps, {}> {

  static defaultProps: Partial<RLDDProps> = {
    cssClasses: '',
    inlineStyle: {},
    layout: 'vertical',
    threshold: 15,
    dragDelay: 250
  };

  private logic: RLDDLogic;

  constructor(props: RLDDProps) {
    super(props);
    this.logic = new RLDDLogic(
      props.layout!,
      props.threshold!,
      props.dragDelay!,
      this.handleDnDChange.bind(this)
    );
  }

  render() {
    const cssClasses = this.props.cssClasses || '';
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
            <RLDDItemComponent
              key={i}
              logic={manager}
              itemId={item.id}
              activity={manager.getDraggedId() >= 0}
              dragged={manager.getDraggedId() === item.id}
              hovered={manager.getHoveredId() === item.id}
            >
              {itemRenderer(item, i)}
            </RLDDItemComponent>
          );
        })}
        <RLDDFloatingItemComponent logic={manager}>
          {draggedItem >= 0 && itemRenderer(items[draggedItem], draggedItem)}
        </RLDDFloatingItemComponent>
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
