
module Higherframe.Wireframe.Tools {

  export class Draw extends Tool {

    delegate: Higherframe.Wireframe.ToolDelegate;

    private dragRect: paper.Rectangle;
    private dragPreview: paper.Item;

    private hitOptions = {
 			segments: true,
 			stroke: true,
 			fill: true,
 			tolerance: 5
 		};

    constructor(delegate: Higherframe.Wireframe.ToolDelegate) {

      super();

      this.delegate = delegate;

      this.onMouseMove = this.mouseMoveHandler;
      this.onMouseDown = this.mouseDownHandler;
      this.onMouseUp = this.mouseUpHandler;
      this.onMouseDrag = this.mouseDragHandler;
    }

    /**
     * Manipulation functions
     */

    private startDrag(event) {

      // Create the ghost
      this.delegate.createGhost(event.point, new paper.Size(1, 1));
    }

    private resetDrag() {

      // Clear the drag rectangle
      this.dragRect = null;

      // Clear the drag preview
      if (this.dragPreview) {

        this.dragPreview.remove();
        this.dragPreview = null;
      }

      // Clear the ghost
      this.delegate.removeGhost();
    }


    /**
     * Mouse down handler
     */

    private mouseDownHandler(event) {

      // Start a drag
      this.startDrag(event);
    }


    /**
     * Mouse up handlers
     */

    private mouseUpHandler(event) {

      if (event.modifiers.command || event.modifiers.control) {

        this.mouseUpHandlerPlace(event);
      }

      else {

        this.mouseUpHandlerDrag(event);
      }
    }

    private mouseUpHandlerPlace(event) {

      let component = this.delegate.create(event.point);
    }

    private mouseUpHandlerDrag(event) {

      if (this.dragRect) {

        let component = this.delegate.create(this.dragRect.topLeft, this.dragRect.size);
      }

      this.resetDrag();
    }


    /**
     * Mouse move handlers
     */

    private mouseMoveHandler(event) {


    }


    /**
     * Mouse drag handler
     */

    private mouseDragHandler(event) {

      // Draw a new component
      this.mouseDragDrawHandler(event);
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
      this.canvas.layerDrawing.activate();

      // Update the ghost
      this.delegate.updateGhost(this.dragRect.topLeft, this.dragRect.size);
    }
  }
}
