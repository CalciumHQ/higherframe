
module Higherframe.Wireframe.Tools {

  export class Artboard extends Higherframe.Wireframe.Tool {

    private dragRect: paper.Rectangle;
    private dragPreview: paper.Item;
    private dragComponents: Array<Common.Drawing.Component>;

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
            artboard.bounds.intersects(component.bounds)
          ) {

            // Annotate the dragged artboards with their starting position
            (<any>component).dragStartLeft = component.model.properties.x;
            (<any>component).dragStartTop = component.model.properties.y;

            this.dragComponents.push(component);
          }
        });
      });

      // Annotate the drag handles with their starting position
      this.canvas.selectedDragHandles.forEach((handle) => {

        (<any>handle).dragStart = handle.position;
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

      // Clear the start position annotation on the dragged drag handles
      this.canvas.selectedDragHandles.forEach((dragHandle: any) => {

        delete dragHandle.dragStart;
      });

      // Commit the changes
      this.canvas.commitArtboards(this.canvas.selectedArtboards);
      this.canvas.moveItems(this.dragComponents);

      // Clear the dragged component list
      this.dragComponents = [];

      // Clear the selected drag handles
      this.canvas.selectedDragHandles = [];

      // Clean up
      this.canvas.removeSmartGuides();
    }

    private createArtboard(bounds: paper.Rectangle) {

      this.canvas.createArtboard(bounds);
    }


    /**
     * Mouse down handler
     */

    private mouseDownHandler(event) {

      // Inform the rest of the view a click took place
      // This may be consumed by other UI to blur controls, for example
      this.canvas.scope.$broadcast('view:mousedown');

      // Hit test for artboards and handles
      let handleHitResult = this.canvas.layerSelections.hitTest(event.point, this.hitOptions);
      let handle: Common.Drawing.DragHandle = handleHitResult
        ? this.canvas.getDragHandle(handleHitResult.item)
        : null;

      var artboardHitResult = this.canvas.layerArtboards.hitTest(event.point, this.hitOptions);
      var artboard: Higherframe.Drawing.Artboard = artboardHitResult
        ? this.canvas.getTopmost(artboardHitResult.item)
        : null;

      // Look for a clicked drag handle
      if (handle) {

        this.canvas.selectedDragHandles.push(handle);
      }

      // Now look for a clicked artboard
      else {

        // Clear the selection if the shift key isn't held, and
        // the area clicked isn't part of the existing selection
        if (!(event.modifiers.shift || (artboard && artboard.focussed))) {

          this.canvas.clearArtboardSelection();
        }

        if (artboard) {

          // Select the artboard
          this.canvas.selectArtboards([artboard]);

          // Mark as active
          artboard.active = true;
        }
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

      // Mark components as inactive
      this.canvas.selectedArtboards.forEach((artboard) => {

        artboard.active = false;
      });

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

      // Look for hovered artboards and handles
      let handleHitResult = this.canvas.layerSelections.hitTest(event.point, this.hitOptions);
      let handle: Common.Drawing.DragHandle = handleHitResult
        ? this.canvas.getDragHandle(handleHitResult.item)
        : null;

      let artboardHitResult = this.canvas.layerArtboards.hitTest(event.point, this.hitOptions);
      let artboard: Common.Drawing.Component = artboardHitResult
        ? this.canvas.getTopmost(artboardHitResult.item)
        : null;

      // If a drag handle is hovered
      if (handle) {

        this.canvas.setCursor(handle.cursor);
      }

      // If a component is hovered
      else if (artboard) {

        artboard.hovered = true;
        artboard.update();

        this.canvas.setCursor('move');
      }

      // Otherwise display the draw artboard cursor
      else {

        this.canvas.setImageCursor(
          '/assets/cursors/artboard-draw.png',
          '/assets/cursors/artboard-draw@2x.png',
          'crosshair',
          '6 6'
        );
      }
    }


    /**
     * Mouse drag handler
     */

    private mouseDragHandler(event) {

      // Dragging a drag handle
      if (this.canvas.selectedDragHandles.length) {

        this.mouseDragHandleHandler(event);
      }

      // Dragging an artboard
      else if (this.canvas.selectedArtboards.length) {

        this.mouseDragMoveHandler(event);
      }

      // Draw a new artboard
      else {

        this.mouseDragDrawHandler(event);
      }
    }

    private mouseDragHandleHandler(event) {

      var delta = event.point.subtract(event.downPoint);

      // TODO: Currently supporting only one selected artboart
      var artboard = this.canvas.selectedArtboards[0];

      this.canvas.selectedDragHandles.forEach((handle) => {

        // The new position
        var position = (<any>handle).dragStart.add(delta);

        // Position the drag handle
        handle.position = handle.onMove
          ? handle.onMove(position)
          : position;
      });

      // TODO: Only supports one drag handle
      let dragHandle = this.canvas.selectedDragHandles[0];

      // Find a snap point
      var smartGuideResult = Higherframe.Drawing.SnapEngine.snap(
        this.canvas,
        [artboard],
        <Array<Common.Drawing.Item>>this.canvas.layerArtboards.children,
        dragHandle.getSnapPoints(dragHandle.position),
        { snapScoreThreshold: 2000 }
      );

      // Adjust handles according to smart guides
      this.canvas.selectedDragHandles.forEach((handle) => {

        var position = handle.position;

        position = smartGuideResult.x ? position.add(smartGuideResult.x.getAdjustment()) : position;
        position = smartGuideResult.y ? position.add(smartGuideResult.y.getAdjustment()) : position;

        // Position the drag handle
        handle.position = handle.onMove
          ? handle.onMove(position)
          : position;
      });

      this.canvas.updateBoundingBoxes();
    }

    private mouseDragMoveHandler(event) {

      var delta = event.point.subtract(event.downPoint);

      // Move the artboards
      this.canvas.selectedArtboards.forEach((artboard) => {

        artboard.left = (<any>artboard).dragStartLeft + delta.x;
        artboard.top = (<any>artboard).dragStartTop + delta.y;
      });

      // Find smart guides for the component being moved
      var smartGuideResult = Higherframe.Drawing.SnapEngine.snap(
        this.canvas,
        this.canvas.selectedArtboards,
        <Array<Common.Drawing.Item>>this.canvas.layerArtboards.children,
        null,
        { snapScoreThreshold: 500 }
      );

      // Adjust artboards according to smart guides
      this.canvas.selectedArtboards.forEach((artboard) => {

        var position = new paper.Point(
          artboard.left,
          artboard.top
        );

        position = smartGuideResult.x ? position.add(smartGuideResult.x.getAdjustment()) : position;
        position = smartGuideResult.y ? position.add(smartGuideResult.y.getAdjustment()) : position;

        // Reposition the item
        artboard.left = position.x;
        artboard.top = position.y;
        artboard.update();
      });

      delta = smartGuideResult.x ? delta.add(smartGuideResult.x.getAdjustment()) : delta;
      delta = smartGuideResult.y ? delta.add(smartGuideResult.y.getAdjustment()) : delta;

      // Move the contained components
      this.dragComponents.forEach((component) => {

        component.model.properties.x = (<any>component).dragStartLeft + delta.x;
        component.model.properties.y = (<any>component).dragStartTop + delta.y;

        component.update();
      });

      this.canvas.updateBoundingBoxes();
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
