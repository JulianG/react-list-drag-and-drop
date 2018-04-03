
interface Point {
  x: number;
  y: number;
}

type DLLayout = 'vertical' | 'horizontal' | 'grid';

export default class DLLogic {

  private draggedId: number = -1;
  private hoveredId: number = -1;

  private draggedInitialOffset: Point = { x: 0, y: 0 };

  private offset: Point = { x: 0, y: 0 };

  getMode(): DLLayout {
    return this.mode;
  }
  getDraggedId(): number {
    return this.draggedId;
  }

  getHoveredId(): number {
    return this.hoveredId;
  }

  getOffset(): Point {
    return this.offset;
  }

  getDraggedInitialOffset(): Point {
    return this.draggedInitialOffset;
  }

  getThreshold(): number {
    return this.threshold;
  }

  getDragDelay(): number {
    return this.dragDelay;
  }

  constructor(
    private mode: DLLayout,
    private threshold: number,
    private dragDelay: number,
    private onChange: (id: number, target: number) => void
  ) { }

  handleDragBegin(id: number, initialOffset: Point) {
    this.draggedInitialOffset = initialOffset;
    this.draggedId = id;
    this.onChange(-1, -1);
  }

  handleMouseOver(id: number) {
    this.hoveredId = id;
    const d = this.draggedId;
    const h = this.hoveredId;
    if (d >= 0 && h >= 0) {
      this.onChange(d, h);
    } else {
      this.onChange(-1, -1);
    }
  }

  handleMouseMove(id: number, offset: Point) {
    this.offset = offset;
    this.onChange(-1, -1);
  }

  handleDragEnd() {
    this.draggedId = -1;
    this.hoveredId = -1;
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
