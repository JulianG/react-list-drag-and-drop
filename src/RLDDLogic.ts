import Signal from './Signal';
import * as Geom from './Geometry';

export default class RLDDLogic<Type> {

  public onDragBeginSignal: Signal = new Signal();
  public onDragHoverSignal: Signal = new Signal();
  public onDragMoveSignal: Signal = new Signal();
  public onDragEndSignal: Signal = new Signal();

  private lastHoveredId: Type = Object( -1 );
  private floatingItemBoxRect: Geom.Rect;
  private itemBoxRects: Map<Type, Geom.Rect> = new Map<Type, Geom.Rect>();

  getThreshold (): number {
    return this.threshold;
  }

  getDragDelay (): number {
    return this.dragDelay;
  }

  constructor (
    private threshold: number,
    private dragDelay: number
  ) {
  }

  setItemIdBoxRect ( itemId: Type, boxRect: Geom.Rect ) {
    this.itemBoxRects.set( itemId, boxRect );
  }
  setFloatingItemBoxRect ( boxRect: Geom.Rect ) {
    this.floatingItemBoxRect = boxRect;
  }

  handleDragBegin ( draggedId: Type ) {
    const draggedItemRect = this.itemBoxRects.get( draggedId );
    if ( draggedItemRect ) {
      this.onDragBeginSignal.dispatch( draggedId, draggedItemRect.width, draggedItemRect.height );
    }
  }

  handleDragMove<Type> ( id: Type, offset: Geom.Point ) {
    this.onDragMoveSignal.dispatch( id, offset );
    this.updateHoveredItem();
  }

  handleDragEnd () {
    this.onDragEndSignal.dispatch();
  }

  arrangeItems<T> ( items: Array<T>, index0: number, index1: number ): Array<T> {
    let newItems = items.slice();
    if ( index0 !== index1 ) {
      const item0 = newItems[ index0 ];
      const item1 = newItems[ index1 ];
      let index2 = -1;
      if ( index1 > index0 ) {
        newItems.splice( index0, 1 );
        index2 = newItems.indexOf( item1 ) + 1;
        newItems.splice( index2, 0, item0 );
      } else if ( index1 < index0 ) {
        newItems.splice( index0, 1 );
        index2 = newItems.indexOf( item1 ) + 0;
        newItems.splice( index2, 0, item0 );
      }
    }
    return newItems;
  }

  private updateHoveredItem () {
    const hoveredId = ( this.findHoveredItemId() );
    if ( hoveredId >= Object( 0 ) && hoveredId !== this.lastHoveredId ) {
      this.lastHoveredId = hoveredId;
      this.onDragHoverSignal.dispatch( hoveredId );
    }
  }

  private findHoveredItemId (): Type {
    if ( Geom.isRectValid( this.floatingItemBoxRect ) ) {
      const areas = this.calculateOverlappingAreas().sort( ( a, b ) => b.area - a.area );
      if ( areas.length > 0 && areas[ 0 ].area > 0 ) {
        return areas[ 0 ].id;
      }
    }
    return Object( -1 );
  }

  private calculateOverlappingAreas () {
    const areas = new Array<{ id: Type, area: number; }>();
    this.itemBoxRects.forEach( ( rect: Geom.Rect, itemId: Type ) => {
      const area = Geom.getAreaOfIntersection( rect, this.floatingItemBoxRect ) / Geom.getRectArea( rect );
      areas.push( { id: itemId, area } );
    } );
    return areas;
  }
}
