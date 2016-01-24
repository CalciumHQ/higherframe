
module Higherframe.Wireframe.Tools {

  export class Artboards extends paper.Tool {

    private static tool: Wireframe.Tools.Artboards;

    private dragRect: paper.Rectangle;
    private dragPreview: paper.Item;

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
      this.onMouseDrag = this.mouseDragHandler;
    }


    /**
     * Manipulation functions
     */

    private clearSelection() {

      // Clear old artboard focussed states
      this.canvas.selectedArtboards.forEach((artboard: Higherframe.Drawing.Artboard) => {

        artboard.focussed = false;
      });

      this.canvas.selectedArtboards = [];
    }

    private startDrag(event) {

      // Annotate the dragged elements with their starting position
      this.canvas.selectedArtboards.forEach((artboard) => {

        (<any>artboard).dragStartLeft = artboard.left;
        (<any>artboard).dragStartTop = artboard.top;
      });
    }

    private resetDrag() {

      // Clear the drag rectangle
      this.dragRect = null;

      // Clear the drag preview
      if (this.dragPreview) {

        this.dragPreview.remove();
        this.dragPreview = null;
      }

      // Clear the start position annotation on the dragged elements
      this.canvas.selectedArtboards.forEach((item: any) => {

        delete item.dragStart;
      });

      // Commit the changes
      this.canvas.commitArtboards(this.canvas.selectedArtboards);
    }

    private createArtboard(bounds: paper.Rectangle) {

      this.canvas.createArtboard(bounds);
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


    /**
     * Mouse up handlers
     */

    private mouseUpHandler(event) {

      if (this.dragRect) {

        this.createArtboard(this.dragRect);
      }

      this.resetDrag();
    }


    /**
     * Mouse move handlers
     */

    private mouseMoveHandler(event) {

      this.mouseMoveHighlightHandler(event);
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

        this.canvas.setCursor(Common.Drawing.Cursors.Move);
      }

      else {

        this.canvas.setCursor(Common.Drawing.Cursors.Crosshair);
      }

      // Update artboards
      this.canvas.updateArtboards();
    }


    /**
     * Mouse drag handler
     */

    private mouseDragHandler(event) {

      // Dragging an artboard
      if (this.canvas.selectedArtboards.length) {

        this.mouseDragMoveHandler(event);
      }

      // Draw a new artboard
      else {

        this.mouseDragDrawHandler(event);
      }
    }

    private mouseDragMoveHandler(event) {

      var delta = event.point.subtract(event.downPoint);

      this.canvas.selectedArtboards.forEach((artboard) => {

        artboard.left = (<any>artboard).dragStartLeft + delta.x;
        artboard.top = (<any>artboard).dragStartTop + delta.y;

        artboard.update(this.canvas);
      });
    }

    private mouseDragDrawHandler(event) {

      this.dragRect = new paper.Rectangle(event.downPoint, event.lastPoint);

      if (this.dragPreview) {

        this.dragPreview.remove();
      }

      this.canvas.layerSelections.activate();
      this.dragPreview = paper.Path.Rectangle(this.dragRect);
      this.dragPreview.strokeWidth = 1 / paper.view.zoom;
      this.dragPreview.strokeColor = this.canvas.theme.ComponentFocus;
      this.canvas.layerArtboards.activate();
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
