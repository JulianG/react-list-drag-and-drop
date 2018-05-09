import Signal from './Signal';
import * as Geom from './Geometry';

export default class RLDDLogic {

  public onDragBeginSignal: Signal = new Signal();
  public onDragHoverSignal: Signal = new Signal();
  public onDragMoveSignal: Signal = new Signal();
  public onDragEndSignal: Signal = new Signal();

  private lastHoveredId: number = -1;
  private floatingItemBoxRect: Geom.Rect;
  private itemBoxRects: Map<number, Geom.Rect> = new Map<number, Geom.Rect>();

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

  setItemIdBoxRect(itemId: number, boxRect: Geom.Rect) {
    this.itemBoxRects.set(itemId, boxRect);
  }
  setFloatingItemBoxRect(boxRect: Geom.Rect) {
    this.floatingItemBoxRect = boxRect;
  }

  handleDragBegin(draggedId: number) {
    const draggedItemRect = this.itemBoxRects.get(draggedId);
    if (draggedItemRect) {
      this.onDragBeginSignal.dispatch(draggedId, draggedItemRect.width, draggedItemRect.height);
    }
  }

  handleDragMove(id: number, offset: Geom.Point) {
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
    if (hoveredId >= 0 && hoveredId !== this.lastHoveredId /*&& hoveredId !== this.lastDraggedId*/) {
      this.lastHoveredId = hoveredId;
      this.onDragHoverSignal.dispatch(hoveredId);
    }
  }

  private findHoveredItemId(): number {
    if (Geom.isRectValid(this.floatingItemBoxRect)) {
      const areas = this.calculateOverlappingAreas().sort((a, b) => b.area - a.area);
      if (areas.length > 0 && areas[0].area > 0) {
        return areas[0].id;
      }
    }
    return -1;
  }

  private calculateOverlappingAreas() {
    const areas = new Array<{ id: number, area: number }>();
    this.itemBoxRects.forEach((rect: Geom.Rect, itemId: number) => {
      const area = Geom.getAreaOfIntersection(rect, this.floatingItemBoxRect) / Geom.getRectArea(rect);
      areas.push({ id: itemId, area });
    });
    return areas;
  }
}
