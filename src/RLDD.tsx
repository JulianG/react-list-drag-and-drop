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
    this.state = { draggedId: -1, hoveredId: -1 };
  }

  componentDidMount() {
    this.logic.onDragBeginSignal.addListener(this.handleDragBegin);
    this.logic.onMouseOverSignal.addListener(this.handleMouseOver);
    this.logic.onDragEndSignal.addListener(this.handleDragEnd);
  }

  componentWillUnmount() {
    this.logic.onDragBeginSignal.removeListener(this.handleDragBegin);
    this.logic.onMouseOverSignal.removeListener(this.handleMouseOver);
    this.logic.onDragEndSignal.removeListener(this.handleDragEnd);
  }

  render() {
    // console.log('RLDD.render');
    const cssClasses = this.props.cssClasses + ' dl-list';
    const style = this.computeStyle();
    const items = this.props.items;
    const itemRenderer = this.props.itemRenderer;
    const draggedItemId = this.state.draggedId;
    const draggedItemIndex = this.findItemIndexById(draggedItemId);

    return (
      <div className={cssClasses} style={style}>
        {items.map((item, i) => {
          return (
            <RLDDItemComponent
              key={i}
              logic={this.logic}
              itemId={item.id}
              activity={draggedItemId >= 0}
              dragged={draggedItemId === item.id}
              hovered={draggedItemId === item.id}
            >
              {itemRenderer(item, i)}
            </RLDDItemComponent>
          );
        })}
        <RLDDFloatingItemComponent
          logic={this.logic}
          draggedId={draggedItemId}
        >
          {draggedItemIndex >= 0 && itemRenderer(items[draggedItemIndex], draggedItemIndex)}
        </RLDDFloatingItemComponent>
      </div>
    );
  }

  private computeStyle() {
    const display: string = this.props.layout === 'vertical' ? 'block' : 'flex';
    return Object.assign({ display }, this.props.inlineStyle || {});
  }

  private handleDragBegin = (draggedId: number) => {
    this.setState({ draggedId });
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
    const newItems = this.getNewItems();
    this.setState({ draggedId: -1, hoveredId: -1 }, () => {
      if (newItems) {
        this.props.onChange(newItems);
      }
    });
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
