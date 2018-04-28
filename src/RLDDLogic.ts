import Signal from './Signal';

export interface RLDDPoint {
  x: number;
  y: number;
}

export type RLDDLayout = 'vertical' | 'horizontal' | 'grid';

export default class RLDDLogic {

  public onMouseMoveSignal: Signal = new Signal();

  private draggedId: number = -1;
  private hoveredId: number = -1;

  private draggedInitialOffset: RLDDPoint = { x: 0, y: 0 };

  private offset: RLDDPoint = { x: 0, y: 0 };

  getMode(): RLDDLayout {
    return this.mode;
  }
  getDraggedId(): number {
    return this.draggedId;
  }

  getHoveredId(): number {
    return this.hoveredId;
  }

  getOffset(): RLDDPoint {
    return this.offset;
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
    private onChange: (id: number, target: number) => void,
    private onDragBegin: (id: number) => void,
    private onMouseOver: (id: number) => void,
    public onMouseMove: (id: number, offset: RLDDPoint) => void,
    private onDragEnd: () => void
  ) { }

  handleDragBegin(id: number, initialOffset: RLDDPoint) {
    this.draggedInitialOffset = initialOffset;
    this.draggedId = id;
    this.onDragBegin(id);
    this.onChange(-1, -1);
  }

  handleMouseOver(id: number) {
    this.hoveredId = id;
    const d = this.draggedId;
    const h = this.hoveredId;
    this.onMouseOver(id);
    if (d >= 0 && h >= 0) {
      this.onChange(d, h);
    } else {
      this.onChange(-1, -1);
    }
  }

  handleMouseMove(id: number, offset: RLDDPoint) {
    this.offset = offset;
    this.onMouseMove(id, offset);
    this.onMouseMoveSignal.raise(id, offset);
    // this.onChange(-1, -1);
  }

  handleDragEnd() {
    this.draggedId = -1;
    this.hoveredId = -1;
    this.onDragEnd();
    this.onChange(this.draggedId, this.hoveredId);
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
