import Signal from './Signal';
import { Point, Rect, isRectValid, getAreaOfIntersection } from './Geometry';

export default class RLDDLogic {

  public onDragBeginSignal: Signal = new Signal();
  public onDragHoverSignal: Signal = new Signal();
  public onDragMoveSignal: Signal = new Signal();
  public onDragEndSignal: Signal = new Signal();

  private lastHoveredId: number = -1;
  private floatingItemBoxRect: Rect;
  private itemBoxRects: Map<number, Rect> = new Map<number, Rect>();

  getThreshold(): number {
    return this.threshold;
  }

  getDragDelay(): number {
    return this.dragDelay;
  }

  constructor(
    private threshold: number,
    private dragDelay: number
  ) {
  }

  setItemIdBoxRect(itemId: number, boxRect: Rect) {
    this.itemBoxRects.set(itemId, boxRect);
  }
  setFloatingItemBoxRect(boxRect: Rect) {
    this.floatingItemBoxRect = boxRect;
  }

  handleDragBegin(draggedId: number, width: number, height: number) {
    this.onDragBeginSignal.dispatch(draggedId, width, height);
  }

  handleDragMove(id: number, offset: Point) {
    this.onDragMoveSignal.dispatch(id, offset);
    this.updateHoveredItem();
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

  private updateHoveredItem() {
    const hoveredId = this.findHoveredItemId();
    if (hoveredId >= 0) {
      this.lastHoveredId = hoveredId;
      this.onDragHoverSignal.dispatch(hoveredId);
    }
  }

  private findHoveredItemId(): number {
    if (isRectValid(this.floatingItemBoxRect) && this.itemBoxRects.size > 0) {
      const areas = new Array<{ id: number, area: number }>();
      this.itemBoxRects.forEach((rect: Rect, itemId: number) => {
        const area = getAreaOfIntersection(rect, this.floatingItemBoxRect);
        areas.push({ id: itemId, area });
      });
      const sortedAreas = areas.sort((a, b) => b.area - a.area);
      if (sortedAreas[0].area > 0 && sortedAreas[0].id !== this.lastHoveredId) {
        return sortedAreas[0].id;
      }
    }
    return -1;
  }

}
