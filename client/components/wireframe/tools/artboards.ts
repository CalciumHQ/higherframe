
module Higherframe.Wireframe.Tools {

  export class Artboards extends paper.Tool {

    private static tool: Wireframe.Tools.Artboards;

    private dragging: boolean = false;
    private dragStart: paper.Point;

    private hitOptions = {
 			segments: true,
 			stroke: true,
 			fill: true,
 			tolerance: 5
 		};


    /**
     * Exposes a singleton tool for the artboards edit mode
     */

    public static get(canvas?: Higherframe.Wireframe.Canvas): Wireframe.Tools.Artboards {

      if (!Artboards.tool) {

        Artboards.tool = new Wireframe.Tools.Artboards(canvas);
      }

      // Update the canvas reference, even if the singleton has already been
      // instantiated
      if (canvas) {

        Artboards.tool.canvas = canvas;
      }

      return Artboards.tool;
    }


    /**
     * Constructor
     */

    constructor(private canvas?: Higherframe.Wireframe.Canvas) {

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
      this.canvas.selectedArtboards.forEach((artboard: Higherframe.Drawing.Artboard) => {

        artboard.focussed = false;
      });

      this.canvas.selectedArtboards = [];
    }

    startDrag(event) {

      // Store the start point of the drag
      this.dragStart = event.downPoint;

      // Annotate the dragged elements with their starting position
      this.canvas.selectedArtboards.forEach((artboard) => {

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
      this.canvas.selectedArtboards.forEach((item: any) => {

        delete item.dragStart;
      });

      // Mark the drag as ended
      this.dragging = false;

      // Commit the changes
      this.canvas.commitArtboards(this.canvas.selectedArtboards);
    }


    /**
     * Mouse down handler
     */

    private mouseDownHandler(event) {

      // Look for a clicked artboard
      var artboardHitResult = this.canvas.layerArtboards.hitTest(event.point, this.hitOptions);

      var artboard: Higherframe.Drawing.Artboard = artboardHitResult
        ? this.canvas.getTopmost(artboardHitResult.item)
        : null;

      // Clear the selection if the shift key isn't held, and
      // the area clicked isn't part of the existing selection
      if (!(event.modifiers.shift || (artboard && artboard.focussed))) {

        this.clearSelection();
      }

      if (artboard) {

        // Select the artboard
        artboard.focussed = true;
        this.canvas.selectedArtboards.push(artboard);
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
        if (this.canvas.selectedArtboards.length) {

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
      var hitResult = this.canvas.layerArtboards.hitTest(event.point, this.hitOptions);

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

      this.canvas.selectedArtboards.forEach((artboard) => {

        artboard.left = (<any>artboard).dragStartLeft + delta.x;
        artboard.top = (<any>artboard).dragStartTop + delta.y;

        artboard.update(this.canvas);
      });
    }


    /**
     * Key down handler
     */

    private keyDownHandler(event) {

      switch (event.key) {

				case 'backspace':

					this.canvas.removeArtboards(this.canvas.selectedArtboards);
					event.event.preventDefault();

					break;
      }
    }
  }
}
