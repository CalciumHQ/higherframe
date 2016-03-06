
module Higherframe.Wireframe.Tools {

  export class Artboard extends Higherframe.Wireframe.Tool {

    private dragRect: paper.Rectangle;
    private dragPreview: paper.Item;
    private dragComponents: Array<Common.Drawing.Component.Component>;

    private hitOptions = {
 			segments: true,
 			stroke: true,
 			fill: true,
 			tolerance: 5
 		};


    /**
     * Constructor
     */

    constructor() {

      super();

      this.onMouseMove = this.mouseMoveHandler;
      this.onMouseDown = this.mouseDownHandler;
      this.onMouseUp = this.mouseUpHandler;
      this.onMouseDrag = this.mouseDragHandler;
      this.onKeyDown = this.keyDownHandler;
    }


    /**
     * Manipulation functions
     */

    private startDrag(event) {

      this.dragComponents = [];

      this.canvas.selectedArtboards.forEach((artboard) => {

        // Annotate the dragged artboards with their starting position
        (<any>artboard).dragStartLeft = artboard.left;
        (<any>artboard).dragStartTop = artboard.top;

        // Get components that are on this artboard
        this.canvas.components.forEach((component) => {

          if (
            component.isInside(artboard.bounds) ||
            artboard.intersects(component)
          ) {

            // Annotate the dragged artboards with their starting position
            (<any>component).dragStartLeft = component.model.properties.x;
            (<any>component).dragStartTop = component.model.properties.y;

            this.dragComponents.push(component);
          }
        });
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

      // Clear the start position annotation on the dragged artboards
      this.canvas.selectedArtboards.forEach((artboard: any) => {

        delete artboard.dragStartLeft;
        delete artboard.dragStartTop
      });

      // Clear the start position annotation on the dragged components
      this.dragComponents.forEach((component: any) => {

        delete component.dragStartLeft;
        delete component.dragStartTop;
      });

      // Commit the changes
      this.canvas.commitArtboards(this.canvas.selectedArtboards);
      this.canvas.moveItems(this.dragComponents);

      // Clear the dragged component list
      this.dragComponents = [];
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

        this.canvas.clearArtboardSelection();
      }

      if (artboard) {

        // Select the artboard
        this.canvas.selectArtboards([artboard]);
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

        this.canvas.setCursor('move');
      }

      else {

        this.canvas.setImageCursor(
          '/assets/cursors/artboard-draw.png',
          '/assets/cursors/artboard-draw@2x.png',
          'crosshair',
          '6 6'
        );
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

      this.dragComponents.forEach((component) => {

        component.model.properties.x = (<any>component).dragStartLeft + delta.x;
        component.model.properties.y = (<any>component).dragStartTop + delta.y;

        component.update();
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

    public onActivated() {

      // Style the canvas
      this.canvas.layerDrawing.opacity = 0.3;
    }

    public onDeactivated() {

      // Clean up
      this.canvas.clearArtboardSelection();
      this.canvas.updateArtboards();

      // Style the canvas
      this.canvas.layerDrawing.opacity = 1;
    }
  }
}
