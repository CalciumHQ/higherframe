
module Higherframe.Wireframe.Tools {

  export class Draw extends paper.Tool {

    private static tool: Wireframe.Tools.Draw;

    private dragging: boolean = false;

    // Record the starting position of a drag operation
    private dragStart: paper.Point;

    // Record the last client mouse position in a drag operation
    private clientDragPrevious: paper.Point;

    private hitOptions = {
 			segments: true,
 			stroke: true,
 			fill: true,
 			tolerance: 5
 		};


    /**
     * Exposes a singleton tool for the artboards edit mode
     */

    public static get(canvas?: Higherframe.Wireframe.Canvas): Wireframe.Tools.Draw {

      if (!Draw.tool) {

        Draw.tool = new Wireframe.Tools.Draw(canvas);
      }

      // Update the canvas reference, even if the singleton has already been
      // instantiated
      if (canvas) {

        Draw.tool.canvas = canvas;

        // Apply mousewheel event to canvas element if it doesn't have an
        // attached handler already
        (<any>$(canvas.element)).unbind('mousewheel');
        (<any>$(canvas.element)).mousewheel((event) => Draw.tool.mouseWheelHandler.call(Draw.tool, event));
      }

      return Draw.tool;
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

    private clearSelection() {

      // Clear old artboard focussed states
      this.canvas.selectedComponents.forEach((component: Common.Drawing.Component.IComponent) => {

        component.focussed = false;
      });

      this.canvas.selectedComponents = [];
    }

    private startDrag(event) {

      // Store the start point of the drag
      this.dragStart = event.downPoint;

      // Store the client start position of the drag
      this.clientDragPrevious = new paper.Point(
        event.event.screenX,
        event.event.screenY
      );

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

      // First look for a clicked drag handle
      let handleHitResult = this.canvas.layerSelections.hitTest(event.point, this.hitOptions);

      let handle: Common.Drawing.Component.DragHandle = handleHitResult
        ? this.canvas.getDragHandle(handleHitResult.item)
        : null;

      if (handle) {

        this.canvas.selectedDragHandles.push(handle);
      }

      // Now look for a clicked component
      else {

        let componentHitResult = this.canvas.layerDrawing.hitTest(event.point, this.hitOptions);

        let component: Common.Drawing.Component.IComponent = componentHitResult
          ? this.canvas.getTopmost(componentHitResult.item)
          : null;

        // Clear the selection if the shift key isn't held, and
        // the area clicked isn't part of the existing selection
        if (!(event.modifiers.shift || (component && component.focussed))) {

  				this.clearSelection();
  			}

        // Select the component
        if (component && !component.focussed) {

          component.focussed = true;
          this.canvas.selectedComponents.push(component);
        }
      }

      // Start a drag
      this.startDrag(event);

      // Start a drag selection
      this.mouseDownSelectHandler(event);

      // Update components
      this.canvas.updateBoundingBoxes();
    }

    private mouseDownSelectHandler(event) {

      // If no hit target start drag selection
			this.canvas.startDragSelection(event.downPoint);
    }


    /**
     * Mouse up handlers
     */

    private mouseUpHandler(event) {

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

      // Clear old artboard hovered states
      this.canvas.components.forEach((component) => {

        if (component.hovered) {

          component.hovered = false;
          component.update();
        }
      });

      // Look for a hovered component
      var hitResult = this.canvas.layerDrawing.hitTest(event.point, this.hitOptions);

      if (hitResult) {

        var component: Common.Drawing.Component.IComponent = this.canvas.getTopmost(hitResult.item);
        component.hovered = true;
        component.update();
      }
    }

    private mouseMoveSelectHandler(event) {

      this.canvas.updateDragSelection(event.downPoint, event.point);
    }

    private mouseMoveHandleDragHandler(event) {

      var delta = event.point.subtract(this.dragStart);

      this.canvas.selectedDragHandles.forEach((handle) => {

        // The new position
        var position = (<any>handle).dragStart.add(delta);

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

      this.canvas.selectedComponents.forEach((component: Common.Drawing.Component.IComponent) => {

        // The new position
        var position = new paper.Point(
          (<any>component).dragStartX + delta.x,
          (<any>component).dragStartY + delta.y
        );

        // Position the component
        component.model.properties.x = (<any>component).dragStartX + delta.x;
        component.model.properties.y = (<any>component).dragStartY + delta.y;
        component.update();

        // Find a snap point
        var smartGuideResult = this.canvas.updateSmartGuides(component);

        // Store if best smart guide match
        if (smartGuideResult.x) {

          if (
            !bestSmartGuideResult.x ||
            smartGuideResult.x.score < bestSmartGuideResult.x.score
          ) {

            bestSmartGuideResult.x = smartGuideResult.x;
          }
        }

        if (smartGuideResult.y) {

          if (
            !bestSmartGuideResult.y ||
            smartGuideResult.y.score < bestSmartGuideResult.y.score
          ) {

            bestSmartGuideResult.y = smartGuideResult.y;
          }
        }
      });

      // Adjust items according to smart guides
      this.canvas.selectedComponents.forEach((component) => {

        var position = new paper.Point(
          component.model.properties.x,
          component.model.properties.y
        );

        position = bestSmartGuideResult.x ? position.add(bestSmartGuideResult.x.getAdjustment()) : position;
        position = bestSmartGuideResult.y ? position.add(bestSmartGuideResult.y.getAdjustment()) : position;

        // Reposition the item
        component.model.properties.x = position.x;
        component.model.properties.y = position.y;
        component.update();
      });

      // Draw smart guides
      if (bestSmartGuideResult.x) { this.canvas.drawGuide(bestSmartGuideResult.x); }
      if (bestSmartGuideResult.y) { this.canvas.drawGuide(bestSmartGuideResult.y); }

      this.canvas.updateBoundingBoxes();
    }


    /**
     * Mouse wheel handler
     */

    private mouseWheelHandler(event) {

      event.preventDefault();

    	var mousePosition = new paper.Point(event.offsetX, event.offsetY);
    	this.canvas.changeCenter(-event.deltaX, event.deltaY);
    }


    /**
     * Key down handler
     */

    private keyDownHandler(event) {

      switch (event.key) {

				case 'backspace':

					if (this.canvas.selectedComponents.length) {

						this.canvas.removeItems(this.canvas.selectedComponents);
						event.event.preventDefault();
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
			}
    }
  }
}
