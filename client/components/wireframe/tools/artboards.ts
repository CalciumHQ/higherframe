
module Higherframe.Wireframe.Tools {

  export class Artboards extends paper.Tool {

    private static tool: Wireframe.Tools.Artboards;

    private selected: Array<Higherframe.Drawing.Artboard> = [];

    private dragging: boolean = false;
    private dragStart: paper.Point;


    /**
     * Exposes a singleton tool for the artboards edit mode
     */

    public static get(canvas: Higherframe.Wireframe.Canvas): Wireframe.Tools.Artboards {

      if (!Artboards.tool) {

        Artboards.tool = new Wireframe.Tools.Artboards(canvas);
      }

      return Artboards.tool;
    }


    /**
     * Constructor
     */

    constructor(private canvas: Higherframe.Wireframe.Canvas) {

      super();

      this.onMouseMove = this.mouseMoveHandler;
      this.onMouseDown = this.mouseDownHandler;
      this.onMouseUp = this.mouseUpHandler;
    }


    /**
     * Manipulation functions
     */

    clearSelection() {

      // Clear old artboard focussed states
      this.selected.forEach((artboard: Higherframe.Drawing.Artboard) => {

        artboard.focussed = false;
      });

      this.selected = [];
    }

    startDrag(event) {

      // Store the start point of the drag
      this.dragStart = event.downPoint;

      // Annotate the dragged elements with their starting position
      this.selected.forEach((artboard) => {

        (<any>artboard).dragStartLeft = artboard.left;
        (<any>artboard).dragStartTop = artboard.top;
      });

      // Mark the drag as started
      this.dragging = true;
    }

    resetDrag() {

      // Clear the start point of the drag
      this.dragStart = null;

      // Clear the start position annotation on the dragged elements
      this.selected.forEach((item: any) => {

        delete item.dragStart;
      });

      // Mark the drag as started
      this.dragging = false;
    }


    /**
     * Mouse down handler
     */

    private mouseDownHandler(event) {

      this.clearSelection();

      // Look for a clicked artboard
      var hitResult = this.canvas.layerArtboards.hitTest(event.point, this.canvas.hitOptions);

      if (hitResult) {

        var artboard: Higherframe.Drawing.Artboard = this.canvas.getTopmost(hitResult.item);

        // Select the artboard
        artboard.focussed = true;
        this.selected.push(artboard);
      }

      // Start a drag
      this.startDrag(event);

      // Update artboards
      this.canvas.updateArtboards();
    }

    private mouseDownFooHandler() {

    }


    /**
     * Mouse up handlers
     */

    private mouseUpHandler(event) {

      this.resetDrag();
    }


    /**
     * Mouse move handlers
     */

    private mouseMoveHandler(event) {

      // Dragging
      if (this.dragging) {

        // Dragging a component
        if (this.selected.length) {

          this.mouseMoveDragHandler(event);
        }

        // Drawing a select box
        else {

          this.mouseMoveSelectHandler(event);
        }
      }

      // Not dragging
      else {

        this.mouseMoveHighlightHandler(event);
      }

    }

    private mouseMoveHighlightHandler(event) {

      // Clear old artboard hovered states
      this.canvas.artboards.forEach((artboard) => {

        artboard.hovered = false;
      });

      // Look for a hovered artboard
      var hitResult = this.canvas.layerArtboards.hitTest(event.point, this.canvas.hitOptions);

      if (hitResult) {

        var artboard: Higherframe.Drawing.Artboard = this.canvas.getTopmost(hitResult.item);
        artboard.hovered = true;
      }

      // Update artboards
      this.canvas.updateArtboards();
    }

    private mouseMoveSelectHandler(event) {

    }

    private mouseMoveDragHandler(event) {

      var delta = event.point.subtract(this.dragStart);

      this.selected.forEach((artboard) => {

        artboard.left = (<any>artboard).dragStartLeft + delta.x;
        artboard.top = (<any>artboard).dragStartTop + delta.y;

        artboard.update(this.canvas);
      });
    }
  }
}
