// import React from 'react';
import React, { Component } from 'react';
// import * as React from 'react';

import RLDDItemComponent from './RLDDItemComponent';
import RLDDLogic from './RLDDLogic';
import RLDDFloatingItemComponent from './RLDDFloatingItemComponent';

export interface RLDDItem<Type> {
  id: Type;
}

export interface RLDDProps<Type> {
  cssClasses?: string;
  inlineStyle?: {};
  layout?: 'vertical' | 'horizontal' | 'grid';
  threshold?: number;
  dragDelay?: number;
  items: Array<RLDDItem<Type>>;
  itemRenderer(item: RLDDItem<Type>, index: number): JSX.Element;
  onChange(items: Array<RLDDItem<Type>>): void;
}

export interface RLDDState<Type> {
  draggedId: Type;
  hoveredId: Type;
  draggedItemDimensions: { width: number, height: number };
}

export default class RLDD<Type> extends Component<RLDDProps<Type>, RLDDState<Type>> {
    
  static defaultProps: Partial<RLDDProps<Number>> = {
    cssClasses: '',
    inlineStyle: {},
    layout: 'vertical',
    threshold: 15,
    dragDelay: 250
  };
  
  readonly state: RLDDState<Type> =
    {
      draggedId: Object( -1 ),
      hoveredId: Object( -1 ),
      draggedItemDimensions:
        { width: 0, height: 0 }
    };

  private logic: RLDDLogic< Type >;

  constructor(props: RLDDProps<Type>) {
    super(props);
    this.logic = new RLDDLogic( props.threshold!, props.dragDelay!);
  }

  componentDidMount() {
    this.logic.onDragBeginSignal.addListener(this.handleDragBegin);
    this.logic.onDragHoverSignal.addListener(this.handleMouseOver);
    this.logic.onDragEndSignal.addListener(this.handleDragEnd);
  }

  componentWillUnmount() {
    this.logic.onDragBeginSignal.removeListener(this.handleDragBegin);
    this.logic.onDragHoverSignal.removeListener(this.handleMouseOver);
    this.logic.onDragEndSignal.removeListener(this.handleDragEnd);
  }

//   getStateString(props: RLDDProps<Type>, state: RLDDState<Type>): string {
//     return `draggedId: ${state.draggedId}
// hoveredId: ${state.hoveredId}
// items: ${props.items.map(item => item.id).toString()}`;
//   }

  render() {
    // console.log('RLDD.render');
    const cssClasses = this.props.cssClasses + ' dl-list';
    const style = this.computeStyle();
    const items = this.props.items;
    return (
      <div className={cssClasses} style={style}>
        {items.map(this.createItemComponent)}
        {this.createFloatingComponent()}
      </div>
    );
  }

  private createItemComponent = (item: RLDDItem<Type>, i: number): JSX.Element => {
    this.assertValidItem(item);
    const draggedItemId = this.state.draggedId;
    return (
      <RLDDItemComponent
        key={String(item.id)}
        logic={this.logic}
        itemId={item.id}
        activity={draggedItemId >= Object(0)}
        dragged={draggedItemId === item.id}
        hovered={draggedItemId === item.id}
      >
        {this.props.itemRenderer(item, i)}
      </RLDDItemComponent>
    );
  }

  private createFloatingComponent = (): JSX.Element => {
    const draggedItemId  = this.state.draggedId as Type; 
    const draggedItemIndex = this.findItemIndexById(draggedItemId);
    const item = this.props.items[draggedItemIndex];
    this.assertValidItem(item);
    return (
      <RLDDFloatingItemComponent
        logic={this.logic}
        draggedId={draggedItemId}
        width={this.state.draggedItemDimensions.width}
        height={this.state.draggedItemDimensions.height}
      >
        {draggedItemIndex >= 0 && this.props.itemRenderer(item, draggedItemIndex)}
      </RLDDFloatingItemComponent>
    );
  }

  private computeStyle() {
    const display: string = this.props.layout === 'vertical' ? 'block' : 'flex';
    return Object.assign({ display }, this.props.inlineStyle || {});
  }

  private handleDragBegin = (draggedId: Type, width: number, height: number) => {
    const draggedItemDimensions = { width, height };
    this.setState({ draggedId, draggedItemDimensions });
  }

  private handleMouseOver = (hoveredId: Type) => {
    if (this.state.draggedId >= Object(0)) {
      this.setState({ hoveredId }, () => {
        const newItems = this.getNewItems();
        if (newItems) {
          this.props.onChange(newItems);
        }
      });
    }
  }

  private handleDragEnd = () => {
    this.setState({ draggedId: Object(-1), hoveredId: Object(-1) });
  }

  private getNewItems(): RLDDItem<Type>[] | undefined {
    const index0 = this.findItemIndexById(this.state.draggedId);
    const index1 = this.findItemIndexById(this.state.hoveredId);

    if (index0 >= 0 && index1 >= 0 && index0 !== index1) {
      const newItems = this.logic.arrangeItems(this.props.items, index0, index1);
      return newItems;
    }
    return;
  }

  private findItemIndexById(id: Type): number {
    
    const item = this.props.items.find( it => it.id === id );
    return item ? this.props.items.indexOf(item) : -1;
  }

  private assertValidItem = (item: RLDDItem<Type>) => {
    if (item) {
      if (typeof item !== 'object') {
        throw `RLDD Error. item must be of type 'object', but it's of type '${typeof item}'.`;
      }
      // if (typeof item.id !== 'number') {
      //   throw `RLDD Error. item must have an 'id' property of type 'number'. ${JSON.stringify(item)}`;
      // }
    }
  }

}
