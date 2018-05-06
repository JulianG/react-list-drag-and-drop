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
  onChange(items: Array<RLDDItem>): void;
}

export interface RLDDState {
  draggedId: number;
  hoveredId: number;
  draggedItemDimensions: { width: number, height: number };
}

export default class RLDD extends React.PureComponent<RLDDProps, RLDDState> {

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
    this.logic = new RLDDLogic(props.layout!, props.threshold!, props.dragDelay!);
    this.state = { draggedId: -1, hoveredId: -1, draggedItemDimensions: { width: 0, height: 0 } };
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

  getStateString(props: RLDDProps, state: RLDDState): string {
    return `draggedId: ${state.draggedId}
hoveredId: ${state.hoveredId}
items: ${props.items.map(item => item.id).toString()}`;
  }

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

  private createItemComponent = (item: RLDDItem, i: number): JSX.Element => {
    const draggedItemId = this.state.draggedId;
    return (
      <RLDDItemComponent
        key={item.id}
        logic={this.logic}
        itemId={item.id}
        activity={draggedItemId >= 0}
        dragged={draggedItemId === item.id}
        hovered={draggedItemId === item.id}
      >
        {this.props.itemRenderer(item, i)}
      </RLDDItemComponent>
    );
  }

  private createFloatingComponent = (): JSX.Element => {
    const draggedItemId = this.state.draggedId;
    const draggedItemIndex = this.findItemIndexById(draggedItemId);
    return (
      <RLDDFloatingItemComponent
        logic={this.logic}
        draggedId={draggedItemId}
        width={this.state.draggedItemDimensions.width}
        height={this.state.draggedItemDimensions.height}
      >
        {draggedItemIndex >= 0 && this.props.itemRenderer(this.props.items[draggedItemIndex], draggedItemIndex)}
      </RLDDFloatingItemComponent>
    );
  }

  private computeStyle() {
    const display: string = this.props.layout === 'vertical' ? 'block' : 'flex';
    return Object.assign({ display }, this.props.inlineStyle || {});
  }

  private handleDragBegin = (draggedId: number, width: number, height: number) => {
    const draggedItemDimensions = { width, height };
    this.setState({ draggedId, draggedItemDimensions });
  }

  private handleMouseOver = (hoveredId: number) => {
    if (this.state.draggedId >= 0) {
      this.setState({ hoveredId }, () => {
        const newItems = this.getNewItems();
        if (newItems) {
          this.props.onChange(newItems);
        }
      });
    }
  }

  private handleDragEnd = () => {
    this.setState({ draggedId: -1, hoveredId: -1 });
  }

  private getNewItems(): RLDDItem[] | undefined {
    const index0 = this.findItemIndexById(this.state.draggedId);
    const index1 = this.findItemIndexById(this.state.hoveredId);

    if (index0 >= 0 && index1 >= 0 && index0 !== index1) {
      const newItems = this.logic.arrangeItems(this.props.items, index0, index1);
      return newItems;
    }
    return;
  }

  private findItemIndexById(id: number): number {
    const item = this.props.items.find(it => it.id === id);
    return item ? this.props.items.indexOf(item) : -1;
  }
}
