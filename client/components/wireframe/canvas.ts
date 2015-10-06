
// Has paper been initialized yet
var _paperInitialized;

module Higherframe.Wireframe {

	export class Canvas implements ng.IDirective {

		link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
		restrict = 'A';


		/**
		 * Configuration/constants
		 */

		hitOptions = {
 			segments: true,
 			stroke: true,
 			fill: true,
 			tolerance: 5
 		};

		colors = {
			normal: '#888',
			hover: '#7ae',
			selected: '#7ae',
			dragHandles: '#98e001'
		};


		/**
		 * Member variables
		 */

		element: ng.IAugmentedJQuery;
		scope: ng.IScope;

		isDragSelecting: boolean = false;
		dragSelectionRectangle;
		dragSelectionOverlay;

		hoveredItem;
		selectedItems = [];
		selectedSegment;
		hoveredDragHandle;
		selectedDragHandle;

		layerGrid: paper.Layer;
		layerDrawing: paper.Layer;
		layerAnnotations: paper.Layer;
		layerSelections: paper.Layer;
		layerGuides: paper.Layer;

		lastMousePosition;

		gridLines:{
			x: Array<paper.Path>,
			y: Array<paper.Path>
		} = { x: [], y: [] };


		constructor(private $window: Higherframe.IWindow) {

			Canvas.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

				this.element = element;
				this.scope = scope;


				/**
				 * Controller notifications
				 */

				scope.$on('event:keydown', (e, keyEvent) => {

					this.keyDown(keyEvent);
				});

				scope.$on('view:zoom', (e, zoom) => {

					this.changeZoom(zoom, null);
				});

				scope.$on('view:pan', (e, center) => {

					this.changeCenter(center, null);
				});

				scope.$on('component:added', (e, data) => {

					// Insertion options
					var defaults = {
							select: true
					};

					var options = angular.extend(defaults, data.options || {});

					// Select new components if requested
					if (options.select) {

							this.clearSelection();
							this.selectItems(data.components);
					}
				});

				scope.$on('component:propertyChange', (e, data) => {

					data.component.update();
					this.updateBoundingBox(data.component);
					this.updateDragHandles(data.component);
				});

				scope.$on('component:collaboratorSelect', (e, data) => {

					// Find the component with this id
					var component = _.find(this.layerDrawing.children, (child: any) => {

						if (child.model._id == data.component._id) { return true; }
					});

					// Set the color for the user
					component.collaborator = data.user;
					component.setComponentColor(data.user.color);
				});

				scope.$on('component:collaboratorDeselect', (e, data) => {

					// Find the component with this id
					var component = _.find(this.layerDrawing.children, function (child: any) {

						if (child.model._id == data.component._id) { return true; }
					});

					// Set the color for the user
					component.collaborator = null;
					component.setComponentColor(this.colors.normal);
				});


				/**
				 * Init
				 */

				this.initPaper();
				this.initProject();
				this.initLayers();
				this.updateCanvas();
				this.updateGrid();

				/**
				 * Keep canvas size updated.
				 *
				 * Not good using a loop for this. Using window.resize would be better
				 * but this doesn't account for changes in layout without the window
				 * resizing.
				 *
				 * TODO: Find a better way.
				 */

				var self = this;
				(function updateLoop() {

					self.updateCanvas();
					requestAnimationFrame(updateLoop);
				})();
			};
		}


		/**
		 * Init
		 */

		 initPaper() {

 			if (_paperInitialized) {

 				return;
 			}

 			// Initialize the paper object
 			paper.install(this.$window);

 			_paperInitialized = true;
 		};

		initProject() {

 			paper.setup(<HTMLCanvasElement>this.element[0]);
 			paper.view.onFrame = function () {};

 			// Tool may have already been created by controller
 			// We don't want multiple tools since only one can be active
 			// at once and the controller one capture key events
 			if (!this.$window.tool) {

 				this.$window.tool = new paper.Tool();
 			}

 			this.$window.tool.onMouseDown = (event) => this.mouseDown.call(this, event);
 			this.$window.tool.onMouseUp = (event) => this.mouseUp.call(this, event);
 			this.$window.tool.onMouseMove = (event) => this.mouseMove.call(this, event);
 			this.$window.tool.onMouseDrag = (event) => this.mouseDrag.call(this, event);

 			(<any>$(this.element)).mousewheel((event) => this.mouseWheel.call(this, event));
 		}

 		initLayers() {

 			this.layerGrid = new paper.Layer();
 			this.layerDrawing = new paper.Layer();
 			this.layerAnnotations = new paper.Layer();
 			this.layerSelections = new paper.Layer();
 			this.layerGuides = new paper.Layer();

 			this.layerDrawing.activate();
 		}

		/**
		 * Event handlers
		 */

		mouseUp(event) {

			// If dragging an item
			if (this.selectedItems.length) {

				angular.forEach(this.selectedItems, (item) => {

					this.moveItem(item, item.position);
					this.removeSmartGuides(item);
					item.mousePositionDelta = null;
				});
			}

			// If dragging a drag handle
			else if (this.selectedDragHandle) {

			}

			else {

				// End drag selection
				this.endDragSelection();
			}

			this.selectedDragHandle = null;
			this.selectedSegment = null;
		}

		mouseMove(event) {

			// Return the last hovered item to default state
			if (this.hoveredItem) {

				if (this.selectedItems.indexOf(this.hoveredItem) !== -1) {

					this.hoveredItem.setComponentColor(this.colors.selected);
				}

				else if (this.hoveredItem.collaborator) {

					this.hoveredItem.setComponentColor(this.hoveredItem.collaborator.color);
				}

				else {

					this.hoveredItem.setComponentColor(this.colors.normal);
				}
			}

			// Hit test a drag handle and set hover style
			var hitResult = this.layerSelections.hitTest(event.point, this.hitOptions);

			if (hitResult) {

				this.hoveredDragHandle = hitResult.item;
			}

			// Hit test a new item and set hover style
			hitResult = this.layerDrawing.hitTest(event.point, this.hitOptions);

			if (hitResult) {

				var component = this.getTopmost(hitResult.item);

				component.setComponentColor(this.colors.hover);
				this.hoveredItem = component;
			}
		}

		mouseDrag(event) {

			// Pan when space bar is held
			if (event.modifiers.space) {

				// Can't use event.delta since the canvas moves
				// and odd behaviour occurs. Use browser events
				// instead
				var position = new paper.Point(
					event.event.screenX,
					event.event.screenY
				);

				var delta = position.subtract(this.lastMousePosition);
				this.lastMousePosition = position;

				// Move the canvas
				this.changeCenter(delta.x, delta.y);
			}

			// Else if dragging a segment
			else if (this.selectedSegment && (this.selectedItems.length == 1)) {

				var selectedItem = this.selectedItems[0];

				// Check if component definition allows resizing
				if (!selectedItem.model.resizable) {

					return;
				}

				var scaleX = 1 + event.delta.x / selectedItem.bounds.width;
				var scaleY =
					event.modifiers.shift ?
					scaleX :
					1 + event.delta.y / selectedItem.bounds.height;

				selectedItem.scale(scaleX, scaleY);
			}

			// If dragging a drag handle
			else if (this.selectedDragHandle) {

				// The new position
				var position:paper.Point = event.point.add(this.selectedDragHandle.mouseDownDelta);
				this.selectedDragHandle.position = this.selectedDragHandle.model.move(position);
			}

			// If dragging an item
			else if (this.selectedItems.length) {

				angular.forEach(this.selectedItems, (item) => {

					// The new position
					var position = event.point.add(item.mouseDownDelta);

					// Position the item and its bounding box
					item.position = position;

					if (item.boundingBox) {

							item.boundingBox.position = position;
					}

					this.updateDragHandles(item);

					// Find a snap point
					var snapAdjustment = this.updateSmartGuides(item);

					// If a snap point was found
					if (snapAdjustment) {

						position = position.add(snapAdjustment);

						// Reposition the item and its bounding box
						item.position = position;

						if (item.boundingBox) {

								item.boundingBox.position = position;
						}

						this.updateDragHandles(item);
					}
				});
			}

			// If drag selecting
			else if (this.isDragSelecting) {

				this.updateDragSelection(event.downPoint, event.point);
			}
		}

		mouseDown(event) {

			this.lastMousePosition = new paper.Point(
				event.event.screenX,
				event.event.screenY
			);

			// If a drag handle is clicked
			var hitResult = this.layerSelections.hitTest(event.point, this.hitOptions);

			if (hitResult) {

				var handle = hitResult.item;

				this.selectedDragHandle = handle;

				// Store where the mouse down point is in relation
				// to the position of the handle
				// This is used to position an handle correctly during
				// a drag
				this.selectedDragHandle.mouseDownDelta = this.selectedDragHandle.position.subtract(event.point);

				return;
			}

			hitResult = this.layerDrawing.hitTest(event.point, this.hitOptions);

			// Clear the last selection unless the shift key
			// is held down, or the hit target is already selected
			if (!event.modifiers.shift && !hitResult) {

				this.clearSelection();
			}

			// If a component is clicked
			if (hitResult) {

				// Find the top-level group
				var item = this.getTopmost(hitResult.item);

				// Clear the last selection unless the shift key
				// is held down, or the hit target is already selected
				if (!event.modifiers.shift && this.selectedItems.indexOf(item) === -1) {

					this.clearSelection();
				}

				// Select the hit target
				if (hitResult.type == 'segment') {

					this.selectedSegment = hitResult.segment;
					this.selectItems(item);
				}

				else if (hitResult.type == 'fill' || hitResult.type == 'stroke') {

					this.selectItems(item);
				}

				// Store where the mouse down point is in relation
				// to the position of each selected item
				// This is used to position an item correctly during
				// a drag
				angular.forEach(this.selectedItems, function (item) {

					item.mouseDownDelta = item.position.subtract(event.point);
				});

				return;
			}

			// If no hit target start drag selection
			this.startDragSelection(event.downPoint);
		}

		mouseWheel(event) {

			event.preventDefault();

			var mousePosition = new paper.Point(event.offsetX, event.offsetY);
			this.changeCenter(-event.deltaX, event.deltaY);
		}

		keyDown(event) {

			switch (event.key) {
				case 'backspace':

					if (this.selectedItems.length) {

						this.removeItems(this.selectedItems);
						event.event.preventDefault();
					}

					break;

				// Nudge left on the left key
				case 'left':

					var amount = event.modifiers.shift ? -10 : -1;
					if (this.selectedItems.length) {

						this.nudge(this.selectedItems, amount, 0);
					}

					break;

				// Nudge right on the right key
				case 'right':

					var amount = event.modifiers.shift ? 10 : 1;
					if (this.selectedItems.length) {

						this.nudge(this.selectedItems, amount, 0);
					}

					break;

				// Nudge up on the up key
				case 'up':

					var amount = event.modifiers.shift ? -10 : -1;
					if (this.selectedItems.length) {

						this.nudge(this.selectedItems, 0, amount);
					}

					break;

				// Nudge down on the down key
				case 'down':

					var amount = event.modifiers.shift ? 10 : 1;
					if (this.selectedItems) {

						this.nudge(this.selectedItems, 0, amount);
					}

					break;

				// Move forward on the ']' key
				case ']':

					if (this.selectedItems) {

						this.moveForward(this.selectedItems);
					}

					break;

				// Move to front on the 'shift+]' key
				case '}':

					if (this.selectedItems) {

						this.moveToFront(this.selectedItems);
					}

					break;

				// Move backward on the '[' key
				case '[':

					if (this.selectedItems) {

						this.moveBackward(this.selectedItems);
					}

					break;

				// Move to back on the 'shift+[' key
				case '{':

					if (this.selectedItems) {

						this.moveToBack(this.selectedItems);
					}

					break;

				// Copy on the 'c' key
				case 'c':

					if (event.modifiers.command || event.modifiers.control) {

						event.event.preventDefault();
						this.scope.$emit('component:copied', this.selectedItems);
					}

					break;

					// Paste on the 'v' key
					case 'v':

						if (event.modifiers.command || event.modifiers.control) {

							event.event.preventDefault();
							this.scope.$emit('component:pasted');
						}

						break;
			}
		}


		/**
		 * State handlers
		 */

		onItemUpdated(item) {

			item.update();
			this.updateBoundingBox(item);
			this.updateDragHandles(item);
		}


		/**
		 * Data methods
		 */

		clearSelection() {

			angular.forEach(this.selectedItems, (item) => {

				if (item == this.hoveredItem) {

					item.setComponentColor(this.colors.hover);
				}

				else if (item.collaborator) {

					this.hoveredItem.setComponentColor(item.collaborator.color);
				}

				else {

					this.hoveredItem.setComponentColor(this.colors.normal);
				}
			});

			this.scope.$emit('componentsDeselected', this.selectedItems);
			this.selectedItems = [];

			angular.forEach(this.layerDrawing.children, (item) => {

				this.onItemUpdated(item);
			});
		}

		selectItems(items: Array<Higherframe.Drawing.Component.IComponent>) {

			angular.forEach(items, (item) => {

				if (this.selectedItems.indexOf(item) === -1) {

					item.setComponentColor(this.colors.selected);
					this.selectedItems.push(item);
					this.onItemUpdated(item);
					(<any>paper.view).draw();
				}
			});

			this.scope.$emit('componentsSelected', items);
		}

		removeItems(items: Array<Higherframe.Drawing.Component.IComponent>) {

			this.scope.$emit('componentsDeleted', items);

			while(items.length) {

				var item = items[items.length-1];

				item.remove();

				var index = this.selectedItems.indexOf(item);

				if (index !== -1) {

					this.selectedItems.splice(index, 1);
				}

				this.removeBoundingBox(item);
				this.removeDragHandles(item);
			}
		}

		moveItem(items: Array<Higherframe.Drawing.Component.IComponent>, position) {

			angular.forEach(items, (item) => {

				item.position = position;
				this.updateBoundingBox(item);
				this.updateDragHandles(item);
			});

			this.scope.$emit('componentsMoved', items);
		}

		nudge(items: Array<Higherframe.Drawing.Component.IComponent>, x, y) {

			angular.forEach(items, (item) => {

				var delta = new paper.Point(x, y);
				item.position = item.position.add(delta);
				this.updateBoundingBox(item);
				this.updateDragHandles(item);
			});

			this.scope.$emit('componentsMoved', items);
		}

		moveForward(items: Array<Higherframe.Drawing.Component.IComponent>) {

			angular.forEach(items, (item) => {

				var siblings = item.parent.children;
				var index = siblings.indexOf(item);

				// Return if at top of stack
				if (!siblings[index+1]) {

					return;
				}

				// Switch with next element on stack
				item.remove();
				item.insertAbove(siblings[index]);
			});

			this.scope.$emit('componentsIndexModified', items);
		}

		moveToFront(items: Array<Higherframe.Drawing.Component.IComponent>) {

			angular.forEach(items, (item) => {

				item.bringToFront();
			});

			this.scope.$emit('componentsIndexModified', items);
		}

		moveBackward(items: Array<Higherframe.Drawing.Component.IComponent>) {

			angular.forEach(items, (item) => {

				var siblings = item.parent.children;
				var index = siblings.indexOf(item);

				// Return if at bottom of stack
				if (!siblings[index-1]) {

					return;
				}

				// Switch with previous element on stack
				item.remove();
				item.insertBelow(siblings[index-1]);
			});

			this.scope.$emit('componentsIndexModified', items);
		}

		moveToBack(items: Array<Higherframe.Drawing.Component.IComponent>) {

			angular.forEach(items, (item) => {

				item.sendToBack();
			});

			this.scope.$emit('componentsIndexModified', items);
		}


		/**
		 * View methods
		 */

		updateCanvas() {

			var w = this.element.width();
			var h = this.element.height();

			paper.view.viewSize = new paper.Size(w, h);
			this.updateGrid();
		};

		changeCenter(deltaX, deltaY) {

			if (angular.isUndefined(deltaX) || deltaX === null ) {

				return;
			}

			// May provide a point object for first argument instead.
			// In this case calculate the delta from the current center.
			if (angular.isObject(deltaX)) {

				paper.view.center = deltaX;
			}

			else {

				paper.view.center = paper.view.center.add(new paper.Point(
					-deltaX / paper.view.zoom,
					-deltaY / paper.view.zoom
				));
			}

			this.updateGrid();

			this.scope.$emit('view:panned', paper.view.center);
		};

		changeZoom(newZoom, target) {

			if (angular.isUndefined(newZoom) || newZoom === null ) {

				return;
			}

			var factor = 1.04;
			var center = paper.view.center;
			var oldZoom = paper.view.zoom;

			if (!target) {

				target = center;
			}

			var beta = oldZoom / newZoom;
			var pc = target.subtract(center);
			var a = target.subtract(pc.multiply(beta)).subtract(center);

			paper.view.zoom = newZoom;
			paper.view.center = paper.view.center.add(a);

			this.updateGrid();

			this.scope.$emit('view:zoomed', paper.view.zoom);
			this.scope.$emit('view:panned', paper.view.center);
		};

		startDragSelection(from) {

			this.isDragSelecting = true;
			this.dragSelectionRectangle = new paper.Rectangle(from, from);

			this.layerSelections.activate();
			this.dragSelectionOverlay = paper.Path.Rectangle(this.dragSelectionRectangle);
			this.layerDrawing.activate();
		};

		endDragSelection() {

			// Select the items in the rectangle
			angular.forEach(this.layerDrawing.children, (item) => {

				if (item.isInside(this.dragSelectionRectangle) &&
					this.selectedItems.indexOf(item) === -1
				) {

					this.selectItems([<Higherframe.Drawing.Component.Base>item]);
				}
			});

			// Clean up after selection
			this.isDragSelecting = false;
			this.dragSelectionRectangle = null;

			if (this.dragSelectionOverlay) {

				this.dragSelectionOverlay.remove();
				this.dragSelectionOverlay = null;
			}
		};

		updateDragSelection(from, to) {

			this.dragSelectionRectangle = new paper.Rectangle(from, to);

			// Update the overlay indicating the drag region
			if (this.dragSelectionOverlay) {

				this.dragSelectionOverlay.remove();
			}

			this.layerSelections.activate();
			this.dragSelectionOverlay = paper.Path.Rectangle(this.dragSelectionRectangle);
			this.dragSelectionOverlay.fillColor = '#4d7cb8';
			this.dragSelectionOverlay.strokeColor = '#0047a1';
			this.dragSelectionOverlay.strokeWidth = 2;
			this.dragSelectionOverlay.opacity = 0.3;
			this.layerDrawing.activate();
		};


		/**
		 * Helper methods
		 */

		// Given a paper item, finds the top-most item in its
		// hierarchy. This is typically a component.
		getTopmost(item) {

			var result = item;

			// Find the top-level group
			while (result.parent && result.parent.className == 'Group'
			) {

				result = result.parent;
			}

			return result;
		};


		/**
		 * Bounding box
		 *
		 * Updates an item's bounding box according to
		 * whether it is selected. The bounding box will
		 * be added/removed/updated as appropriate.
		 */
		updateBoundingBox(item) {

			if (!item.showBounds) {

				return;
			}

			var selected = (this.selectedItems.indexOf(item) !== -1);

			if (selected && !item.boundingBox) {

				this.addBoundingBox(item);
			}

			else if (!selected && item.boundingBox) {

				this.removeBoundingBox(item);
			}

			else if (selected && item.boundingBox) {

				this.removeBoundingBox(item);
				this.addBoundingBox(item);
			}
		}

		addBoundingBox(item) {

			if (!item.boundingBox) {

				this.layerSelections.activate();

				var lineWidth = 1/paper.view.zoom;
				var bb = paper.Path.Rectangle(item.bounds);
				bb.strokeColor = this.colors.hover;
				bb.strokeWidth = lineWidth;

				var drawHandle = (point) => {

					var handleSize = 3/paper.view.zoom;
					var handle = paper.Path.Rectangle(
						new paper.Point(point.x - handleSize, point.y - handleSize),
						new paper.Point(point.x + handleSize, point.y + handleSize)
					);

					handle.strokeColor = this.colors.hover;
					handle.strokeWidth = lineWidth;
					handle.fillColor = 'white';

					return handle;
				};

				var topLeft = drawHandle(item.bounds.topLeft);
				var topCenter = drawHandle(item.bounds.topCenter);
				var topRight = drawHandle(item.bounds.topRight);
				var rightCenter = drawHandle(item.bounds.rightCenter);
				var bottomRight = drawHandle(item.bounds.bottomRight);
				var bottomCenter = drawHandle(item.bounds.bottomCenter);
				var bottomLeft = drawHandle(item.bounds.bottomLeft);
				var leftCenter = drawHandle(item.bounds.leftCenter);

				item.boundingBox = new paper.Group([
					bb,
					topLeft,
					topCenter,
					topRight,
					rightCenter,
					bottomRight,
					bottomCenter,
					bottomLeft,
					leftCenter
				]);

				this.layerDrawing.activate();
			}
		}

		removeBoundingBox(item) {

			if (item.boundingBox) {

				item.boundingBox.remove();
				item.boundingBox = null;
			}
		}


		/**
		 * Drag handles
		 *
		 * Updates an item's drag handles according to
		 * whether it is selected. The drag handles will
		 * be added/removed/updated as appropriate.
		 */
		updateDragHandles(item) {

			var selected = (this.selectedItems.indexOf(item) !== -1);
			this.removeDragHandles(item);

			if (selected) {

				this.addDragHandles(item);
			}
		}

		addDragHandles(item) {

			this.layerSelections.activate();

			var drawHandle = (point) => {

				var handleSize = 3/paper.view.zoom;
				var handle = paper.Path.Rectangle(
					new paper.Point(point.x - handleSize, point.y - handleSize),
					new paper.Point(point.x + handleSize, point.y + handleSize)
				);

				handle.fillColor = this.colors.dragHandles;

				return handle;
			};

			angular.forEach(item.getDragHandles(), (dh) => {

				var handle = drawHandle(dh.position);
				(<any>handle).model = dh;

				item.dragHandles.push(handle);
			});

			this.layerDrawing.activate();
		}

		removeDragHandles(item) {

			angular.forEach(item.dragHandles, function (dh) {

				dh.remove();
			});

			item.dragHandles = [];
		}


		/**
		 * Smart guides
		 */

		updateSmartGuides(item) {

			var snapAdjustment;

			if (!item.smartGuides || !item.smartGuides.length) {

				snapAdjustment = this.addSmartGuides(item);
			}

			else if (item.smartGuides.length) {

				this.removeSmartGuides(item);
				snapAdjustment = this.addSmartGuides(item);
			}

			return snapAdjustment;
		}

		addSmartGuides(item) {

			var snaps = [];
			var snapAdjustment = new paper.Point(0, 0);
			var guideStrokeWidth = 1/paper.view.zoom;

			item.smartGuides = [];

			var snapPoints = item.getSnapPoints();

			// TODO: Whittle down to elements in the nearby area

			// Work through each element
			angular.forEach(this.layerDrawing.children, (relation) => {

				// Don't compare target element with other selected elements
				if (this.selectedItems.indexOf(relation) !== -1) {

					return;
				}

				var relationSnapPoints = (<any>relation).getSnapPoints();

				// Look for alignment in snap points
				angular.forEach(snapPoints, (snapPoint) => {

					angular.forEach(relationSnapPoints, (relationSnapPoint) => {

						var xDelta = relationSnapPoint.x - snapPoint.x;
						var yDelta = relationSnapPoint.y - snapPoint.y;

						// If within the snap threshold
						if (Math.abs(xDelta) <= 10 || Math.abs(yDelta) <= 10) {

							// Which axis is the snap in?
							var axis = (Math.abs(xDelta) <= Math.abs(yDelta)) ? 'x' : 'y';

							// If a snap already exists in this axis with a
							// smaller delta, don't continue
							var previous = _.find(snaps, function (snap) {

								if (snap.axis != axis) { return false; }

								if (snap.axis == 'x') { return snap.delta <= xDelta; }
								else { return snap.delta <= yDelta; }
							});

							if (previous) {

								return;
							}

							// Create the new snap
							var snap = {
								relation: relationSnapPoint,
								axis: axis,
								delta: 0
							};

							if (snap.axis == 'x') {

								snap.delta = Math.abs(xDelta);
								snapAdjustment.x = xDelta;
							}

							else {

								snap.delta = Math.abs(yDelta);
								snapAdjustment.y = yDelta;
							}

							snaps.push(snap);
						}
					});
				});
			});

			angular.forEach(snaps, (snap) => {

				// Draw a guide from the adjusted point through the
				// relation snap point to the extent of the window
				var from, to;
				if (snap.axis == 'x') {

					from = new paper.Point(snap.relation.x, paper.view.bounds.top);
					to = new paper.Point(snap.relation.x, paper.view.bounds.bottom);
				}

				else {

					from = new paper.Point(paper.view.bounds.left, snap.relation.y);
					to = new paper.Point(paper.view.bounds.right, snap.relation.y);
				}

				this.layerGuides.activate();

				var guide = paper.Path.Line(from, to);
				guide.strokeColor = 'magenta';
				guide.strokeWidth = guideStrokeWidth;
				item.smartGuides.push(guide);

				this.layerDrawing.activate();
			});

			// Return the required adjustment on the item
			return snapAdjustment;
		}

		removeSmartGuides(item) {

			if (item.smartGuides) {

				angular.forEach(item.smartGuides, function (guide) {

					guide.remove();
				});

				item.smartGuides = [];
			}
		}


		/**
		 * Grid
		 */

		updateGrid() {

				var gridMajorSize = 100,
					gridMinorSize = 20,
					gridMajorColor = 'rgba(0,0,0,0.07)',
					gridMinorColor = 'rgba(0,0,0,0.03)',
					gridStrokeWidth = 1/paper.view.zoom;

				this.layerGrid.activate();

				// Establish an origin and line count,
				// starting just outside the viewport
				var startX = Math.floor(paper.view.bounds.topLeft.x / gridMajorSize) * gridMajorSize,
					endX = Math.ceil(paper.view.bounds.bottomRight.x / gridMajorSize) * gridMajorSize,
					startY = Math.floor(paper.view.bounds.topLeft.y / gridMajorSize) * gridMajorSize,
					endY = Math.ceil(paper.view.bounds.bottomRight.y / gridMajorSize) * gridMajorSize,
					countX = (endX - startX) / gridMinorSize,
					countY = (endY - startY) / gridMinorSize;

				// Don't display grid beyond a zoom level
				if (paper.view.zoom < 0.4) {

					countX = countY = 0;
				}

				// Create or remove existing grid lines to match
				// the required number
				while(this.gridLines.x.length > countX) {

					var line: paper.Path = this.gridLines.x.pop();
					line.remove();
				}

				while(this.gridLines.y.length > countY) {

					var line: paper.Path = this.gridLines.y.pop();
					line.remove();
				}

				while(this.gridLines.x.length < countX) {

					var line: paper.Path = paper.Path.Line(new paper.Point(0, 0), new paper.Point(0, 0));
					line.strokeWidth = gridStrokeWidth;
					this.gridLines.x.push(line);
				}

				while(this.gridLines.y.length < countY) {

					var line: paper.Path = paper.Path.Line(new paper.Point(0, 0), new paper.Point(0, 0));
					line.strokeWidth = gridStrokeWidth;
					this.gridLines.y.push(line);
				}

				// Position the grid lines
				for (var i = 0; i < countY; i++) {

					var y = i*gridMinorSize;

					var from = new paper.Point(paper.view.bounds.left, startY + y);
					var to = new paper.Point(paper.view.bounds.right, startY + y);

					var line: paper.Path = this.gridLines.y[i];
					line.strokeWidth = gridStrokeWidth;
					line.segments[0].point = from;
					line.segments[1].point = to;

					if (y % gridMajorSize == 0) {

						line.strokeColor = gridMajorColor;
					} else {

						line.strokeColor = gridMinorColor;
					}
				}

				for (var i = 0; i < countX; i++) {

					var x = i*gridMinorSize;

					var from = new paper.Point(startX + x, paper.view.bounds.top);
					var to = new paper.Point(startX + x, paper.view.bounds.bottom);

					var line: paper.Path = this.gridLines.x[i];
					line.strokeWidth = gridStrokeWidth;
					line.segments[0].point = from;
					line.segments[1].point = to;

					if (x % gridMajorSize == 0) {

						line.strokeColor = gridMajorColor;
					} else {

						line.strokeColor = gridMinorColor;
					}
				}

				this.layerDrawing.activate();
		}


		static factory(): ng.IDirectiveFactory {

			const directive = ($window: Higherframe.IWindow) => new Canvas($window);
			directive.$inject = ['$window'];
			return directive;
		}
	}
}

angular
	.module('siteApp')
	.directive('wireframe', Higherframe.Wireframe.Canvas.factory());
