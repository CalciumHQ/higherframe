
module Common.Drawing {

  export class Item extends paper.Group {

    protected _hovered: Boolean = false;
    get hovered(): Boolean { return this._hovered; }
    set hovered(value) { this._hovered = value; this.update(); }

    protected _active: Boolean = false;
    get active(): Boolean { return this._active; }
    set active(value) { this._active = value; this.update(); }

    protected _focussed: Boolean = false;
    get focussed(): Boolean { return this._focussed; }
    set focussed(value) { this._focussed = value; this.update(); }

    protected _dragHandles: Array<Common.Drawing.DragHandle> = [];
    get dragHandles(): Array<Common.Drawing.DragHandle> { return this._dragHandles; }
    set dragHandles(value) { this._dragHandles = value; }

    update(canvas?: any): void {

    }

    getSnapPoints(): Array<SnapPoint> {

      return [];
    }

    getTransformHandles(color: paper.Color): Array<DragHandle> {

      return [];
    }

    getDragHandles(color: paper.Color): Array<DragHandle> {

      return [];
    }

    getBoundsRectangle(): paper.Rectangle {

      return this.bounds;
    }
  }
}
