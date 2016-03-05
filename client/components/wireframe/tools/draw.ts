
module Higherframe.Wireframe.Tools {

  export class Draw extends Tool {

    delegate: Higherframe.Wireframe.ToolDelegate;

    private mousePosition: paper.Point;
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
      this.onKeyDown = this.keyDownHandler;
      this.onKeyUp = this.keyUpHandler;
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

    private createComponent(component: Common.Drawing.Component.Component) {

      this.canvas.scope.$emit('toolbox:component:added', component);
    }


    /**
     * Mouse down handler
     */

    private mouseDownHandler(event) {

      if (!event.modifiers.command && !event.modifiers.control) {

        // Start a drag
        this.startDrag(event);
      }
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

      let component = this.delegate.createWithCenter(event.point);
      this.createComponent(component);
    }

    private mouseUpHandlerDrag(event) {

      if (this.dragRect) {

        let component = this.delegate.create(this.dragRect.topLeft, this.dragRect.size);
        this.createComponent(component);
      }

      this.resetDrag();
    }


    /**
     * Mouse move handlers
     */

    private mouseMoveHandler(event) {

      // Store the mouse position
      this.mousePosition = event.point;

      // Update the ghost
      this.delegate.updateGhostWithCenter(event.point);
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

    private keyDownHandler(event) {

      if (event.key == 'command') {

        this.delegate.createGhostWithCenter(this.mousePosition);
        this.canvas.setImageCursor(
          this.delegate.placeCursor,
          this.delegate.placeCursorHidpi,
          this.delegate.placeCursorFallback,
          this.delegate.placeCursorFocus
        );
      }
    }

    private keyUpHandler(event) {

      if (event.key == 'command') {

        this.delegate.removeGhost();
        this.canvas.setImageCursor(
          this.delegate.drawCursor,
          this.delegate.drawCursorHidpi,
          this.delegate.drawCursorFallback,
          this.delegate.drawCursorFocus
        );
      }
    }

    public onActivated() {

      // Set the cursor
      if (this.canvas) {

        this.canvas.setImageCursor(
          this.delegate.drawCursor,
          this.delegate.drawCursorHidpi,
          this.delegate.drawCursorFallback,
          this.delegate.drawCursorFocus
        );
      }
    }
  }
}
