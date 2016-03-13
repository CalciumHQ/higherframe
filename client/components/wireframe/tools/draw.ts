
module Higherframe.Wireframe.Tools {

  export class Draw extends Tool {

    delegate: Higherframe.Wireframe.ToolDelegate;

    private mousePosition: paper.Point;
    private dragRect: paper.Rectangle;
    private dragPreview: paper.Item;
    private dragStart: paper.Point;

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

      let snapPoint = new Common.Drawing.SnapPoint(event.point, '', '');
      let result = Higherframe.Drawing.SnapEngine.snap(
        this.canvas,
        [snapPoint],
        <Array<Common.Drawing.Item>>this.canvas.layerDrawing.children
      );

      // Update ghost with snap
      this.dragStart = event.point;
      this.dragStart = result.x ? this.dragStart.add(result.x.getAdjustment()) : this.dragStart;
      this.dragStart = result.y ? this.dragStart.add(result.y.getAdjustment()) : this.dragStart;

      // Create the ghost
      this.delegate.createGhost(this.dragStart, new paper.Size(1, 1));
    }

    private resetDrag() {

      // Clear the drag rectangle
      this.dragRect = null;
      this.dragStart = null;

      // Clear the drag preview
      if (this.dragPreview) {

        this.dragPreview.remove();
        this.dragPreview = null;
      }

      // Clear the ghost
      this.delegate.removeGhost();

      // Clear smart guides
      this.canvas.removeSmartGuides();
    }

    private createComponent(component: Common.Drawing.Component) {

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

      let component = this.delegate.createWithCenter(this.delegate.getGhostPosition());
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

      if (event.modifiers.control || event.modifiers.command) {

        this.mouseMovePlaceHandler(event);
      }

      else {

        this.mouseMoveDrawHandler(event);
      }
    }

    private mouseMovePlaceHandler(event) {

      // Update the ghost
      let ghost = this.delegate.updateGhostWithCenter(event.point);

      // Find a snap point
      var smartGuideResult = Higherframe.Drawing.SnapEngine.snap(
        this.canvas,
        [ghost],
        <Array<Common.Drawing.Item>>this.canvas.layerDrawing.children
      );

      // Update ghost with snap
      let adjustedCenter = this.mousePosition;
      adjustedCenter = smartGuideResult.x ? adjustedCenter.add(smartGuideResult.x.getAdjustment()) : adjustedCenter;
      adjustedCenter = smartGuideResult.y ? adjustedCenter.add(smartGuideResult.y.getAdjustment()) : adjustedCenter;
      this.delegate.updateGhostWithCenter(adjustedCenter);
    }

    private mouseMoveDrawHandler(event) {

      let snapPoint = new Common.Drawing.SnapPoint(event.point, '', '');
      let result = Higherframe.Drawing.SnapEngine.snap(
        this.canvas,
        [snapPoint],
        <Array<Common.Drawing.Item>>this.canvas.layerDrawing.children
      );
    }


    /**
     * Mouse drag handler
     */

    private mouseDragHandler(event) {

      // Draw a new component
      this.mouseDragDrawHandler(event);
    }

    private mouseDragDrawHandler(event) {

      this.dragRect = new paper.Rectangle(this.dragStart, event.lastPoint);

      // Update the ghost
      let ghost = this.delegate.updateGhost(this.dragRect.topLeft, this.dragRect.size);

      // Find a snap point
      var smartGuideResult = Higherframe.Drawing.SnapEngine.snap(
        this.canvas,
        [ghost],
        <Array<Common.Drawing.Item>>this.canvas.layerDrawing.children
      );

      // Update ghost with snap
      this.dragRect.size.width += smartGuideResult.x ? smartGuideResult.x.getAdjustment().x : 0;
      this.dragRect.size.height += smartGuideResult.y ? smartGuideResult.y.getAdjustment().y : 0;
      this.delegate.updateGhost(this.dragRect.topLeft, this.dragRect.size);

      // Draw the drag preview
      if (this.dragPreview) {

        this.dragPreview.remove();
      }

      this.canvas.layerSelections.activate();
      this.dragPreview = paper.Path.Rectangle(this.dragRect);
      this.dragPreview.strokeWidth = 1 / paper.view.zoom;
      this.dragPreview.strokeColor = this.canvas.theme.ComponentFocus;
      this.canvas.layerDrawing.activate();
    }

    private keyDownHandler(event) {

      if (event.key == 'control' || event.key == 'meta') {

        // Set the cursor
        this.canvas.setImageCursor(
          this.delegate.placeCursor,
          this.delegate.placeCursorHidpi,
          this.delegate.placeCursorFallback,
          this.delegate.placeCursorFocus
        );

        // Create the ghost
        let ghost = this.delegate.createGhostWithCenter(this.mousePosition);

        // Find a snap point
        var smartGuideResult = Higherframe.Drawing.SnapEngine.snap(
          this.canvas,
          [ghost],
          <Array<Common.Drawing.Item>>this.canvas.layerDrawing.children
        );

        // Update ghost with snap
        let adjustedCenter = this.mousePosition;
        adjustedCenter = smartGuideResult.x ? adjustedCenter.add(smartGuideResult.x.getAdjustment()) : adjustedCenter;
        adjustedCenter = smartGuideResult.y ? adjustedCenter.add(smartGuideResult.y.getAdjustment()) : adjustedCenter;
        this.delegate.updateGhostWithCenter(adjustedCenter);
      }
    }

    private keyUpHandler(event) {

      if (event.key == 'control' || event.key == 'meta') {

        // Set the cursor
        this.canvas.setImageCursor(
          this.delegate.drawCursor,
          this.delegate.drawCursorHidpi,
          this.delegate.drawCursorFallback,
          this.delegate.drawCursorFocus
        );

        // Clean up
        this.delegate.removeGhost();
        this.canvas.removeSmartGuides();
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
