
module Higherframe.Wireframe.Tools {

  export class Select extends Higherframe.Wireframe.Tool {

    private dragging: boolean = false;

    // Record the starting position of a drag operation
    private dragStart: paper.Point;

    // Record the aspect ratio at the start of a drag operation
    private aspect: number;

    // Record the last paper mouse position
    private point: paper.Point;

    // Record the last client mouse position in a drag operation
    private clientDragPrevious: paper.Point;

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
      this.onKeyDown = this.keyDownHandler;
      this.onKeyUp = this.keyUpHandler;
    }


    /**
     * Manipulation functions
     */

    private startDrag(event) {

      // Store the start point of the drag
      this.dragStart = event.downPoint;

      // Store the client start position of the drag
      this.clientDragPrevious = new paper.Point(
        event.event.screenX,
        event.event.screenY
      );

      // Store the starting aspect ratio of the selection
      if (this.canvas.selectedComponents.length) {

        let bounds = this.canvas.getBounds(this.canvas.selectedComponents);
        this.aspect = bounds.width / bounds.height;
      }

      // Annotate the dragged elements with their starting position
      this.canvas.selectedComponents.forEach((component) => {

        (<any>component).dragStartX = component.model.properties.x;
        (<any>component).dragStartY = component.model.properties.y;
      });

      // Annotate the drag handles with their starting position
      this.canvas.selectedDragHandles.forEach((handle) => {

        (<any>handle).dragStart = handle.position;
      });

      // Mark the drag as started
      this.dragging = true;
    }

    private resetDrag() {

      // Clear the start point of the drag
      this.dragStart = null;

      // Clear the start position annotation on the dragged components
      this.canvas.selectedComponents.forEach((component: any) => {

        delete component.dragStart;
      });

      // Clear the start position annotation on the dragged handles
      this.canvas.selectedDragHandles.forEach((handle: any) => {

        delete handle.dragStart;
      });

      // Clear the selected drag handles
      this.canvas.selectedDragHandles = [];

      // Indicate the components have moved
      this.canvas.moveItems(this.canvas.selectedComponents);

      // Mark the drag as started
      this.dragging = false;

      // Clean up
      this.canvas.removeSmartGuides();
    }


    /**
     * Mouse down handler
     */

    private mouseDownHandler(event) {

      // Inform the rest of the view a click took place
      // This may be consumed by other UI to blur controls, for example
      this.canvas.scope.$broadcast('view:mousedown');

      // Hit test for components and handles
      let handleHitResult = this.canvas.layerSelections.hitTest(event.point, this.hitOptions);
      let handle: Common.Drawing.DragHandle = handleHitResult
        ? this.canvas.getDragHandle(handleHitResult.item)
        : null;

      let componentHitResult = this.canvas.layerDrawing.hitTest(event.point, this.hitOptions);
      let component: Common.Drawing.Component = componentHitResult
        ? this.canvas.getTopmost(componentHitResult.item)
        : null;

      // Look for a clicked drag handle
      if (handle) {

        this.canvas.selectedDragHandles.push(handle);
      }

      // Now look for a clicked component
      else {

        // Clear the selection if the shift key isn't held, and
        // the area clicked isn't part of the existing selection
        if (!(event.modifiers.shift || (component && component.focussed))) {

  				this.canvas.clearComponentSelection();
  			}

        // Select the component if one was found
        if (component) {

          this.canvas.selectItems([component]);

          // Mark as active
          component.active = true;
        }
      }

      // Start a drag
      this.startDrag(event);

      // Start a drag selection
      this.mouseDownSelectHandler(event);

      // Update components
      this.canvas.updateBoundingBoxes();

      // Check for right click and open properties panel
      if (event.event.button == 2) {

        let bounds = this.canvas.getBounds(this.canvas.selectedComponents);
        let documentBounds = paper.view.bounds;
        var point = bounds.bottomRight
          .subtract(documentBounds.topLeft)
          .add(new paper.Point(10, 5));

        point.y = event.event.offsetY;

        this.canvas.scope.$emit('view:properties:open', { point: point });
      }
    }

    private mouseDownSelectHandler(event) {

      // If no hit target start drag selection
			this.canvas.startDragSelection(event.downPoint);
    }


    /**
     * Mouse up handlers
     */

    private mouseUpHandler(event) {

      // Mark components as inactive
      this.canvas.selectedComponents.forEach((component) => {

        component.active = false;
      });

      this.resetDrag();
      this.canvas.endDragSelection();
    }


    /**
     * Mouse move handlers
     */

    private mouseMoveHandler(event) {

      // Dragging
      if (this.dragging) {

        // Pan when space bar is held
  			if (event.modifiers.space) {

  				this.mouseMovePanHandler(event);
  			}

        // Dragging a drag handle
        else if (this.canvas.selectedDragHandles.length) {

          this.mouseMoveHandleDragHandler(event);
        }

        // Dragging a component
        else if (this.canvas.selectedComponents.length) {

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

      // Save the position for miscellaneous use
      this.point = event.point;
    }

    private mouseMovePanHandler(event) {

      // Can't use event.delta since the canvas moves
      // and odd behaviour occurs. Use browser events
      // instead
      var clientPosition = new paper.Point(
        event.event.screenX,
        event.event.screenY
      );

      var delta = clientPosition.subtract(this.clientDragPrevious);
      this.clientDragPrevious = clientPosition;

      // Move the canvas
      this.canvas.changeCenter(delta.x, delta.y);
    }

    private mouseMoveHighlightHandler(event) {

      // Clear old component hovered states
      this.canvas.components.forEach((component) => {

        if (component.hovered) {

          component.hovered = false;
          component.update();
        }
      });

      this.canvas.transformHandles.forEach((th) => {

        th.hovered = false;
        th.update();
      });

      // Hit test for components and handles
      let handleHitResult = this.canvas.layerSelections.hitTest(event.point, this.hitOptions);
      let handle: Common.Drawing.DragHandle = handleHitResult
        ? this.canvas.getDragHandle(handleHitResult.item)
        : null;

      let componentHitResult = this.canvas.layerDrawing.hitTest(event.point, this.hitOptions);
      let component: Common.Drawing.Component = componentHitResult
        ? this.canvas.getTopmost(componentHitResult.item)
        : null;

      // If a drag handle is hovered
      if (handle) {

        handle.hovered = true;
        handle.update();

        this.canvas.setCursor(handle.cursor);
      }

      // If a component is hovered
      else if (component) {

        component.hovered = true;
        component.update();

        this.canvas.setCursor('move');
      }

      else {

        this.canvas.setCursor('default');
      }
    }

    private mouseMoveSelectHandler(event) {

      this.canvas.updateDragSelection(event.downPoint, event.point);
    }

    private mouseMoveHandleDragHandler(event) {

      var delta = event.point.subtract(this.dragStart);

      // TODO: Currently supporting only one selected item
      var item = this.canvas.selectedComponents[0];

      // TODO: Only supports one drag handle
      let dragHandle = this.canvas.selectedDragHandles[0];

      // Constrain aspect ratio if the shift key is held
      if (
        dragHandle.axis == Common.Drawing.DragHandleAxis.Both &&
        event.modifiers.shift
      ) {

        delta = new paper.Point(delta.x, delta.x / this.aspect);
      }

      this.canvas.selectedDragHandles.forEach((handle) => {

        // The new position
        var position = (<any>handle).dragStart.add(delta);

        // Position the drag handle
        handle.position = handle.onMove
          ? handle.onMove(position)
          : position;
      });

      // Find a snap point
      var smartGuideResult = Higherframe.Drawing.SnapEngine.snap(
        this.canvas,
        [item],
        <Array<Common.Drawing.Item>>this.canvas.layerDrawing.children,
        dragHandle.getSnapPoints(dragHandle.position)
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

    private mouseMoveDragHandler(event) {

      var delta = event.point.subtract(this.dragStart);

      var bestSmartGuideResult: {
        x?: Common.Drawing.SmartGuide,
        y?: Common.Drawing.SmartGuide
      } = {};

      this.canvas.selectedComponents.forEach((component: Common.Drawing.Component) => {

        // The new position
        var position = new paper.Point(
          (<any>component).dragStartX + delta.x,
          (<any>component).dragStartY + delta.y
        );

        // Position the component
        component.model.properties.x = (<any>component).dragStartX + delta.x;
        component.model.properties.y = (<any>component).dragStartY + delta.y;
        component.update();
      });

      // Find smart guides for the component being moved
      var smartGuideResult = Higherframe.Drawing.SnapEngine.snap(
        this.canvas,
        this.canvas.selectedComponents,
        <Array<Common.Drawing.Item>>this.canvas.layerDrawing.children
      );

      // Adjust items according to smart guides
      this.canvas.selectedComponents.forEach((component) => {

        var position = new paper.Point(
          component.model.properties.x,
          component.model.properties.y
        );

        position = smartGuideResult.x ? position.add(smartGuideResult.x.getAdjustment()) : position;
        position = smartGuideResult.y ? position.add(smartGuideResult.y.getAdjustment()) : position;

        // Reposition the item
        component.model.properties.x = position.x;
        component.model.properties.y = position.y;
        component.update();
      });

      this.canvas.updateBoundingBoxes();
    }


    /**
     * Key down handler
     */

    private keyDownHandler(event) {

      switch (event.key) {

				case 'backspace':

          event.event.preventDefault();
          event.event.stopPropagation();

					if (this.canvas.selectedComponents.length) {

						this.canvas.removeItems(this.canvas.selectedComponents);
					}

					break;

				// Nudge left on the left key
				case 'left':

					var amount = event.modifiers.shift ? -10 : -1;
					if (this.canvas.selectedComponents.length) {

						this.canvas.nudge(this.canvas.selectedComponents, amount, 0);
					}

					break;

				// Nudge right on the right key
				case 'right':

					var amount = event.modifiers.shift ? 10 : 1;
					if (this.canvas.selectedComponents.length) {

						this.canvas.nudge(this.canvas.selectedComponents, amount, 0);
					}

					break;

				// Nudge up on the up key
				case 'up':

					var amount = event.modifiers.shift ? -10 : -1;
					if (this.canvas.selectedComponents.length) {

						this.canvas.nudge(this.canvas.selectedComponents, 0, amount);
					}

					break;

				// Nudge down on the down key
				case 'down':

					var amount = event.modifiers.shift ? 10 : 1;
					if (this.canvas.selectedComponents) {

						this.canvas.nudge(this.canvas.selectedComponents, 0, amount);
					}

					break;

				// Move forward on the ']' key
				case ']':

					if (this.canvas.selectedComponents) {

						this.canvas.moveForward(this.canvas.selectedComponents);
					}

					break;

				// Move to front on the 'shift+]' key
				case '}':

					if (this.canvas.selectedComponents) {

						this.canvas.moveToFront(this.canvas.selectedComponents);
					}

					break;

				// Move backward on the '[' key
				case '[':

					if (this.canvas.selectedComponents) {

						this.canvas.moveBackward(this.canvas.selectedComponents);
					}

					break;

				// Move to back on the 'shift+[' key
				case '{':

					if (this.canvas.selectedComponents) {

						this.canvas.moveToBack(this.canvas.selectedComponents);
					}

					break;

				// Copy on the 'c' key
				case 'c':

					if (event.modifiers.command || event.modifiers.control) {

						event.event.preventDefault();
						this.canvas.scope.$emit('component:copied', this.canvas.selectedComponents);
					}

					break;

				// Paste on the 'v' key
				case 'v':

					if (event.modifiers.command || event.modifiers.control) {

						event.event.preventDefault();
						this.canvas.scope.$emit('component:pasted');
					}

					break;

        // Trigger a mouse move event when shift is pressed, to perform a redraw
        // This is required because shift constrains dimensions, and we want
        // immediate feedback on this operation
        case 'shift':

          this.mouseMoveHandler({
            point: this.point,
            modifiers: event.modifiers
          });

          break;
			}
    }


    /**
     * Key up handler
     */

    private keyUpHandler(event) {

      switch (event.key) {

				// Trigger a mouse move event when shift is released, to perform a redraw
        // This is required because shift constrains dimensions, and we want
        // immediate feedback on this operation
        case 'shift':

          this.mouseMoveHandler({
            point: this.point,
            modifiers: event.modifiers
          });

          break;
      }
    }

    public onDeactivated() {

      // Clean up
      this.canvas.clearComponentSelection();
    }
  }
}
