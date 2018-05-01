import Signal from './Signal';

export interface RLDDPoint {
  x: number;
  y: number;
}

export interface RLDDLogicState {
  draggedId: number;
  hoveredId: number;
  offsetX: number;
  offsetY: number;
}

export type RLDDLayout = 'vertical' | 'horizontal' | 'grid';

export default class RLDDLogic {

  public onDragBeginSignal: Signal = new Signal();
  public onMouseOverSignal: Signal = new Signal();
  public onMouseMoveSignal: Signal = new Signal();
  public onDragEndSignal: Signal = new Signal();

  private state: RLDDLogicState;
  private draggedInitialOffset: RLDDPoint;

  getMode(): RLDDLayout {
    return this.mode;
  }

  getState(): RLDDLogicState {
    return this.state;
  }

  getDraggedInitialOffset(): RLDDPoint {
    return this.draggedInitialOffset;
  }

  getThreshold(): number {
    return this.threshold;
  }

  getDragDelay(): number {
    return this.dragDelay;
  }

  constructor(
    private mode: RLDDLayout,
    private threshold: number,
    private dragDelay: number,
    private onChange: (id: number, target: number) => void
  ) {
    this.state = {
      draggedId: -1,
      hoveredId: -1,
      offsetX: 0,
      offsetY: 0
    };
    this.draggedInitialOffset = { x: 0, y: 0 };
  }

  handleDragBegin(id: number, initialOffset: RLDDPoint) {

    this.draggedInitialOffset = initialOffset;
    this.state.draggedId = id;
    this.onChange(-1, -1);
    console.log('RLDDLogic.handleDragBegin... ' + id);
    this.onDragBeginSignal.dispatch(id);
  }

  handleMouseOver(id: number) {
    this.state.hoveredId = id;
    const d = this.state.draggedId;
    const h = this.state.hoveredId;
    if (d >= 0 && h >= 0) {
      this.onChange(d, h);
    } else {
      this.onChange(-1, -1);
    }
    this.onMouseOverSignal.dispatch(id);
  }

  handleMouseMove(id: number, offset: RLDDPoint) {
    this.state.offsetX = offset.x;
    this.state.offsetY = offset.y;
    this.onMouseMoveSignal.dispatch(id, offset);
  }

  handleDragEnd() {
    this.state.draggedId = -1;
    this.state.hoveredId = -1;
    this.onChange(this.state.draggedId, this.state.hoveredId);
    this.onDragEndSignal.dispatch();
  }

  arrangeItems<T>(items: Array<T>, index0: number, index1: number): Array<T> {
    let newItems = items.slice();
    if (index0 !== index1) {
      const item0 = newItems[index0];
      const item1 = newItems[index1];
      let index2 = -1;
      if (index1 > index0) {
        newItems.splice(index0, 1);
        index2 = newItems.indexOf(item1) + 1;
        newItems.splice(index2, 0, item0);
      } else if (index1 < index0) {
        newItems.splice(index0, 1);
        index2 = newItems.indexOf(item1) + 0;
        newItems.splice(index2, 0, item0);
      }
    }
    return newItems;
  }

}
