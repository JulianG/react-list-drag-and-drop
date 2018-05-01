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

interface RLDDState {
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

    this.logic = new RLDDLogic(
      props.layout!,
      props.threshold!,
      props.dragDelay!,
      this.handleLogicChange.bind(this)
    );
    const { draggedId, hoveredId } = this.logic.getState();
    this.state = { draggedId, hoveredId };
  }

  componentDidMount() {
    this.logic.onDragBeginSignal.addListener(this.refresh);
    this.logic.onDragEndSignal.addListener(this.refresh);
  }

  componentWillUnmount() {
    this.logic.onDragBeginSignal.removeListener(this.refresh);
    this.logic.onDragEndSignal.removeListener(this.refresh);
  }

  render() {
    console.log('RLDD.render');
    const cssClasses = this.props.cssClasses || '';
    const style = this.props.inlineStyle || {};
    const items = this.props.items;
    const manager = this.logic;
    const itemRenderer = this.props.itemRenderer;
    const draggedItemId = this.state.draggedId;
    const draggedItem = this.findItemIndexById(draggedItemId);

    return (
      <div className={cssClasses} style={style}>
        {items.map((item, i) => {
          return (
            <RLDDItemComponent
              key={i}
              logic={manager}
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
          {draggedItem >= 0 && itemRenderer(items[draggedItem], draggedItem)}
        </RLDDFloatingItemComponent>
      </div>
    );
  }

  private refresh = () => {
    const ls = this.logic.getState();
    const { draggedId, hoveredId } = ls;
    console.log(`RLDD.refresh: this.state.draggedId: ${this.state.draggedId}, ls.draggedId: ${ls.draggedId}`);
    this.setState( { draggedId, hoveredId } );
  }

  private handleLogicChange(id0: number, id1: number) {
    const index0 = this.findItemIndexById(id0);
    const index1 = this.findItemIndexById(id1);

    if (index0 >= 0 && index1 >= 0 && index0 !== index1) {
      const newItems = this.logic.arrangeItems(this.props.items, index0, index1);
      this.props.onChange(newItems);
    }
  }

  private findItemIndexById(id: number): number {
    const item = this.props.items.find(it => it.id === id);
    return item ? this.props.items.indexOf(item) : -1;
  }
}
