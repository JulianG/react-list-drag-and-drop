import Signal from './Signal';

export interface RLDDPoint {
  x: number;
  y: number;
}

export type RLDDLayout = 'vertical' | 'horizontal' | 'grid';

export default class RLDDLogic {

  public onDragBeginSignal: Signal = new Signal();
  public onMouseOverSignal: Signal = new Signal();
  public onMouseMoveSignal: Signal = new Signal();
  public onDragEndSignal: Signal = new Signal();

  private draggedInitialOffset: RLDDPoint;

  getMode(): RLDDLayout {
    return this.mode;
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
    private dragDelay: number
  ) {
    this.draggedInitialOffset = { x: 0, y: 0 };
  }

  handleDragBegin(draggedId: number, initialOffset: RLDDPoint) {

    this.draggedInitialOffset = initialOffset;
    console.log('RLDDLogic.handleDragBegin... ' + draggedId);
    this.onDragBeginSignal.dispatch(draggedId);
  }

  handleMouseOver(hoveredId: number) {
    this.onMouseOverSignal.dispatch(hoveredId);
  }

  handleMouseMove(id: number, offset: RLDDPoint) {
    this.onMouseMoveSignal.dispatch(id, offset);
  }

  handleDragEnd() {
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
