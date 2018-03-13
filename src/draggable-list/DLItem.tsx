import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DLLogic from './DLLogic';

interface Props {
  logic: DLLogic;
  itemId: number;
  activity: boolean;
  dragged: boolean;
  hovered: boolean;
}

interface State {
  isDragging: boolean;
}

interface BoxRect {
  left: number;
  top: number;
}

export default class DLItem extends React.Component<Props, State> {
  private isDown: boolean = false;
  private initialOffset: { x: number; y: number };
  private mouseOverPending: boolean;

  constructor(props: Props) {
    super(props);
    this.state = { isDragging: false };
    this.mouseOverPending = false;
    //
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);

    document.addEventListener('mousemove', this.handleMouseMoveForHover.bind(this));
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!this.state.isDragging && prevState.isDragging) {
      this.removeDocumentListeners();
    }
  }

  render() {
    const dragged = this.props.dragged ? 'dragged' : '';
    const hovered = this.props.hovered ? 'hovered' : '';
    const activity = this.props.activity ? 'activity' : '';
    const cssClasses = 'dl-item ' + activity + ' ' + dragged + ' ' + hovered;
    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        className={cssClasses}
      >
        {this.props.children}
      </div>
    );
  }

  /////

  private addDocumentListeners() {
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  private removeDocumentListeners() {
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  /////

  private handleMouseDown(e: React.MouseEvent<HTMLElement>) {
    this.isDown = true;
    this.initialOffset = this.getOffset(e);
    e.preventDefault();
    //
    this.addDocumentListeners();
  }

  private handleMouseMove(e: MouseEvent) {
    if (this.isDown === false) {
      return;
    }

    const offset = {
      x: e.pageX - this.initialOffset.x,
      y: e.pageY - this.initialOffset.y
    };

    if (this.state.isDragging === false && this.isDown) {
      this.props.logic.handleDragBegin(this.props.itemId, this.initialOffset);
    }
    this.setState(Object.assign(this.state, { isDragging: this.isDown }));

    if (this.isDown) {
      this.props.logic.handleMouseMove(this.props.itemId, offset);
    }
  }

  private handleMouseMoveForHover(e: MouseEvent) {
    if (this.mouseOverPending) {
      this.dispatchMouseOverIfWithinLimit(this.getOffset(e));
    }
  }

  private handleMouseUp() {
    this.isDown = false;
    if (this.state.isDragging) {
      this.setState(Object.assign(this.state, { isDragging: this.isDown }));
      this.props.logic.handleDragEnd();
    }
  }

  private handleMouseOver(e: React.MouseEvent<HTMLElement>) {
    this.mouseOverPending = true;
  }

  private handleMouseOut(e: React.MouseEvent<HTMLElement>) {
    this.mouseOverPending = false;
  }

  private getBox(): BoxRect {
    const ref = ReactDOM.findDOMNode(this);
    return ref.getBoundingClientRect();
  }
  private getOffset(e: { pageX: number, pageY: number }): { x: number; y: number } {
    // const ref = ReactDOM.findDOMNode(this);
    const box = this.getBox(); // ref.getBoundingClientRect();
    const docElement = document.documentElement;
    return {
      x: e.pageX - (box.left + docElement.scrollLeft - docElement.clientLeft),
      y: e.pageY - (box.top + docElement.scrollTop - docElement.clientTop)
    };
  }

  private dispatchMouseOverIfWithinLimit(offset: { x: number, y: number }) {

    const logic = this.props.logic;
    const initialOffset = logic.getDraggedInitialOffset();
    const threshold = logic.getThreshold();

    const delta = {
      x: offset.x - initialOffset.x,
      y: offset.y - initialOffset.y
    };

    const conditions = {
      'vertical': (): boolean => (delta.y * delta.y < threshold * threshold),
      'horizontal': (): boolean => (delta.x * delta.x < threshold * threshold),
      'grid': (): boolean => (delta.x * delta.x + delta.y * delta.y < threshold * threshold)
    };

    if (conditions[logic.getMode()]()) {
      this.props.logic.handleMouseOver(this.props.itemId);
      this.mouseOverPending = false;
    }
  }

}
