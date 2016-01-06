
/// <reference path="../../library/higherframe.ts"/>

// Has paper been initialized yet
var _paperInitialized;

module Higherframe.Wireframe {

	export enum EditMode {
		Draw,
		Artboards,
		Annotate
	}

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

		layerArtboards: paper.Layer;
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

		components: Array<Higherframe.Drawing.Component.IComponent> = [];
		artboards: Array<Higherframe.Drawing.Artboard> = [];
		boundingBoxes: Array<paper.Item> = [];
		smartGuides: Array<paper.Item> = [];
		collaboratorLabels: Array<paper.Item> = [];

		theme: Higherframe.UI.ITheme = new Higherframe.UI.DefaultTheme();
		editMode: EditMode = EditMode.Draw;


		constructor(private $window: Higherframe.IWindow) {

			Canvas.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

				this.element = element;
				this.scope = scope;


				/**
				 * Controller notifications
				 */

				scope.$on('event:keydown', (e, keyEvent) => {

					this.onDrawKeyDown(keyEvent);
				});

				scope.$on('editMode:set', (e, mode) => {

					this.setEditMode(mode);
				});

				scope.$on('view:zoom', (e, zoom) => {

					this.changeZoom(zoom, null);
				});

				scope.$on('view:pan', (e, center) => {

					this.changeCenter(center, null);
				});

				scope.$on('controller:component:updated', (e, data) => {

					let component = <Higherframe.Drawing.Component.IComponent>data.component;
					component.update();

					// Update bounding boxes
					this.updateBoundingBoxes();
				});

				scope.$on('component:added', (e, data) => {

					// Insertion options
					var defaults = {
						select: true
					};

					var options = angular.extend(defaults, data.options || {});

					// Add to list of components
					data.components.forEach((component) => this.components.push(component));

					// Select new components if requested
					if (options.select) {

						this.clearSelection();
						this.selectItems(data.components);
					}

					// Update bounding boxes
					this.updateBoundingBoxes();
				});

				scope.$on('component:propertyChange', (e, data) => {

					data.component.update();
					this.updateBoundingBoxes();
					this.updateDragHandles(data.component);
				});

				scope.$on('component:collaboratorSelect', (e, data) => {

					// Find the component with this id
					var component = _.find(this.layerDrawing.children, (child: any) => {

						if (child.model._id == data.component._id) { return true; }
					});

					// Set the user on the component
					component.collaborator = data.user;

					// Update component and  bounding boxes
					component.update();
					this.updateBoundingBoxes();
				});

				scope.$on('component:collaboratorDeselect', (e, data) => {

					// Find the component with this id
					var component = _.find(this.layerDrawing.children, function (child: any) {

						if (child.model._id == data.component._id) { return true; }
					});

					// Set the color for the user
					component.collaborator = null;
					component.focussed = false;

					// Update bounding boxes
					this.updateBoundingBoxes();
				});


				/**
				 * Init
				 */

				this.initPaper();
				this.initProject();
				this.initLayers();
				this.updateCanvas();
				this.updateArtboards();
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

			// Configure tools
			// These tools are singletons so may be already configured from a
			// previous session, but no matter doing it again.
			var drawTool = Wireframe.Tools.Draw.get();

			drawTool.bind({
				onMouseUp: this.onDrawMouseUp,
				onMouseDown: this.onDrawMouseDown,
				onMouseMove: this.onDrawMouseMove,
				onMouseDrag: this.onDrawMouseDrag,
				onMouseWheel: this.onDrawMouseWheel
			}, this);

			var artboardsTool = Wireframe.Tools.Artboards.get();

			artboardsTool.bind({
				onMouseUp: this.onArtboardsMouseUp,
				onMouseDown: this.onArtboardsMouseDown,
				onMouseMove: this.onArtboardsMouseMove,
				onMouseDrag: this.onArtboardsMouseDrag
			}, this);
 		}

 		initLayers() {

			this.layerArtboards = new paper.Layer();
 			this.layerGrid = new paper.Layer();
 			this.layerDrawing = new paper.Layer();
 			this.layerAnnotations = new paper.Layer();
 			this.layerSelections = new paper.Layer();
 			this.layerGuides = new paper.Layer();

 			this.layerDrawing.activate();

			this.layerArtboards.activate();
			var artboard = new Higherframe.Drawing.Artboard('Artboard 1');
			this.artboards.push(artboard);
			this.layerDrawing.activate();
			this.updateArtboards();
 		}

		/**
		 * Event handlers
		 */

		onDrawMouseUp(event) {

			// If dragging a drag handle
			if (this.selectedDragHandle) {}

			// If dragging an item
			else if (this.selectedItems.length) {

				this.selectedItems.forEach((item) => {

					this.moveItems([item], {
						position: item.position,
						delta: event.delta
					});

					this.removeSmartGuides();
					item.mouseDownDelta = null;
					item.update();
				});
			}

			else {

				// End drag selection
				this.endDragSelection();
			}

			this.selectedDragHandle = null;
			this.selectedSegment = null;
		}

		onDrawMouseMove(event) {

			// Return the last hovered item to default state
			if (this.hoveredItem) {

				if (this.selectedItems.indexOf(this.hoveredItem) !== -1) {

					this.hoveredItem.hovered = false;
				}

				else if (this.hoveredItem.collaborator) {

					this.hoveredItem.hovered = false;
				}

				else {

					this.hoveredItem.hovered = false;
				}
			}

			// Hit test a drag handle and set hover style
			var hitResult = this.layerSelections.hitTest(event.point, this.hitOptions);

			if (hitResult) {

				var dragHandle = this.getDragHandle(hitResult.item);

				if (dragHandle) {

					this.hoveredDragHandle = dragHandle;
				}

				else {

					this.hoveredDragHandle = null;
				}
			}

			else {

				this.hoveredDragHandle = null;
			}

			// Hit test a new item and set hover style
			hitResult = this.layerDrawing.hitTest(event.point, this.hitOptions);

			if (hitResult) {

				var component = this.getTopmost(hitResult.item);

				component.hovered = true;
				this.hoveredItem = component;
			}

			// Set the cursor
			if (this.hoveredDragHandle && this.hoveredDragHandle.cursor) {

				this.element.css('cursor', this.hoveredDragHandle.cursor);
			}

			else {

				this.element.css('cursor', 'default');
			}
		}

		onDrawMouseDrag(event) {

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

			// If dragging a drag handle
			else if (this.selectedDragHandle) {

				// The new position
				var position:paper.Point = event.point.add(this.selectedDragHandle.mouseDownDelta);

				// Position the drag handle
				this.selectedDragHandle.position = this.selectedDragHandle.onMove
					? this.selectedDragHandle.onMove(position)
					: position;

				// TODO: Currently supporting only one selected item
				var item = this.selectedItems[0];

				// Find a snap point
				var smartGuideResult = this.updateSmartGuides(
					item,
					this.selectedDragHandle.getSnapPoints(this.selectedDragHandle.position)
				);

				// If a snap point was found
				if (smartGuideResult) {

					position = smartGuideResult.x ? position.add(smartGuideResult.x.getAdjustment()) : position;
					position = smartGuideResult.y ? position.add(smartGuideResult.y.getAdjustment()) : position;

					// Reposition the drag handle
					this.selectedDragHandle.position = this.selectedDragHandle.onMove
						? this.selectedDragHandle.onMove(position)
						: position;
				}

				// Draw smart guides
				if (smartGuideResult.x) { this.drawGuide(smartGuideResult.x); }
				if (smartGuideResult.y) { this.drawGuide(smartGuideResult.y); }
			}

			// If dragging an item
			else if (this.selectedItems.length) {

				var bestSmartGuideResult: {
					x?: Drawing.SmartGuide,
					y?: Drawing.SmartGuide
				} = {};

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
					var smartGuideResult = this.updateSmartGuides(item);

					// If a snap point was found
					if (smartGuideResult) {

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
					}
				});

				// Adjust items according to smart guides
				angular.forEach(this.selectedItems, (item) => {

					var position = item.position;

					position = bestSmartGuideResult.x ? position.add(bestSmartGuideResult.x.getAdjustment()) : position;
					position = bestSmartGuideResult.y ? position.add(bestSmartGuideResult.y.getAdjustment()) : position;

					// Reposition the item and its bounding box
					item.position = position;

					if (item.boundingBox) {

						item.boundingBox.position = position;
					}

					this.updateDragHandles(item);
				});

				// Draw smart guides
				if (bestSmartGuideResult.x) { this.drawGuide(bestSmartGuideResult.x); }
				if (bestSmartGuideResult.y) { this.drawGuide(bestSmartGuideResult.y); }
			}

			// If drag selecting
			else if (this.isDragSelecting) {

				this.updateDragSelection(event.downPoint, event.point);
			}
		}

		onDrawMouseDown(event) {

			this.lastMousePosition = new paper.Point(
				event.event.screenX,
				event.event.screenY
			);

			// If a drag handle is clicked
			var hitResult = this.layerSelections.hitTest(event.point, this.hitOptions);

			if (hitResult) {

				var handle = this.getDragHandle(hitResult.item);

				if (handle) {

					this.selectedDragHandle = handle;

					// Store where the mouse down point is in relation
					// to the position of the handle
					// This is used to position an handle correctly during
					// a drag
					this.selectedDragHandle.mouseDownDelta = this.selectedDragHandle.position.subtract(event.point);
				}

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
					this.selectItems([item]);
				}

				else if (hitResult.type == 'fill' || hitResult.type == 'stroke') {

					this.selectItems([item]);
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

		onDrawMouseWheel(event) {

			event.preventDefault();

			var mousePosition = new paper.Point(event.offsetX, event.offsetY);
			this.changeCenter(-event.deltaX, event.deltaY);
		}

		onDrawKeyDown(event) {

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


		onArtboardsMouseDown(event) {

			// Clear old artboard focussed states
			this.artboards.forEach((artboard) => {

				artboard.focussed = false;
			});

			// Look for a clicked artboard
			var hitResult = this.layerArtboards.hitTest(event.point, this.hitOptions);

			if (hitResult) {

				var artboard: Higherframe.Drawing.Artboard = this.getTopmost(hitResult.item);
				artboard.focussed = true;
			}

			// Update artboards
			this.updateArtboards();
		}

		onArtboardsMouseUp() {

		}

		onArtboardsMouseMove(event) {

			// Clear old artboard hover states
			this.artboards.forEach((artboard) => {

				artboard.hovered = false;
			});

			// Look for a hovered artboard
			var hitResult = this.layerArtboards.hitTest(event.point, this.hitOptions);

			if (hitResult) {

				var artboard: Higherframe.Drawing.Artboard = this.getTopmost(hitResult.item);
				artboard.hovered = true;
			}

			// Update artboards
			this.updateArtboards();
		}

		onArtboardsMouseDrag() {

		}


		/**
		 * State handlers
		 */

		onItemUpdated(item: Higherframe.Drawing.Component.IComponent) {

			item.update();
			this.updateBoundingBoxes();
			this.updateDragHandles(item);
		}


		/**
		 * Data methods
		 */

		clearSelection() {

			angular.forEach(this.selectedItems, (item) => {

				item.focussed = false;
			});

			this.scope.$emit('componentsDeselected', this.selectedItems);
			this.selectedItems = [];

			angular.forEach(this.layerDrawing.children, (item: Higherframe.Drawing.Component.IComponent) => {

				this.onItemUpdated(item);
			});
		}

		selectItems(items: Array<Higherframe.Drawing.Component.IComponent>) {

			var newSelectedItems = [];

			angular.forEach(items, (item) => {

				var exists = !!_.find(this.selectedItems, (selectedItem) => {

					return selectedItem.id == item.id;
				});

				if (!exists) {

					item.focussed = true;
					this.selectedItems.push(item);
					this.onItemUpdated(item);
					(<any>paper.view).draw();
					newSelectedItems.push(item);
				}
			});

			this.scope.$emit('componentsSelected', newSelectedItems);
		}

		removeItems(items: Array<Higherframe.Drawing.Component.IComponent>) {

			this.scope.$emit('componentsDeleted', items);

			while(items.length) {

				var item = items[items.length-1];

				item.remove();

				var index = this.components.indexOf(item);
				if (index !== -1) {

					this.components.splice(index, 1);
				}

				index = this.selectedItems.indexOf(item);
				if (index !== -1) {

					this.selectedItems.splice(index, 1);
				}

				this.updateBoundingBoxes();
				this.removeDragHandles(item);
			}
		}

		moveItems(items: Array<Higherframe.Drawing.Component.IComponent>, event: Higherframe.Drawing.Component.IComponentMoveEvent) {

			angular.forEach(items, (item) => {

				item.position = event.position;

				if (item.onMove) { item.onMove(event); }

				this.updateBoundingBoxes();
				this.updateDragHandles(item);
			});

			this.scope.$emit('componentsMoved', items);
		}

		nudge(items: Array<Higherframe.Drawing.Component.IComponent>, x, y) {

			angular.forEach(items, (item) => {

				var delta = new paper.Point(x, y);
				item.position = item.position.add(delta);
				this.updateBoundingBoxes();
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

		setEditMode(mode: EditMode) {

			this.editMode = mode;
			this.updateArtboards();

			switch (mode) {

				case EditMode.Draw:

					Wireframe.Tools.Draw.get().activate();

					// Clean up
					this.artboards.forEach((artboard) => {

						artboard.hovered = false;
						artboard.focussed = false;
					});

					this.updateArtboards();

					// Style the canvas
					this.layerDrawing.opacity = 1;

					break;

				case EditMode.Artboards:

					Wireframe.Tools.Artboards.get().activate();

					// Style the canvas
					this.layerDrawing.opacity = 0.3;
					break;
			}
		}

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

			this.updateArtboards();
			this.updateGrid();
			this.updateBoundingBoxes();

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

			let theme: Higherframe.UI.ITheme = new Higherframe.UI.DefaultTheme();
			this.dragSelectionRectangle = new paper.Rectangle(from, to);

			// Update the overlay indicating the drag region
			if (this.dragSelectionOverlay) {

				this.dragSelectionOverlay.remove();
			}

			this.layerSelections.activate();
			this.dragSelectionOverlay = paper.Path.Rectangle(this.dragSelectionRectangle);
			this.dragSelectionOverlay.fillColor = theme.ComponentActive;
			this.dragSelectionOverlay.strokeColor = theme.ComponentActiveDark;
			this.dragSelectionOverlay.strokeWidth = 2;
			this.dragSelectionOverlay.opacity = 0.3;
			this.layerDrawing.activate();
		};


		/**
		 * Helper methods
		 */

		// Given a paper item, finds the top-most item in its
		// hierarchy. This is typically a component or artboard.
		getTopmost(item) {

			var result = item;

			// Find the top-level group
			while (result.parent && result.parent.className == 'Group'
			) {

				result = result.parent;
			}

			return result;
		};


		// Given a paper item, finds the next item in its
		// hierarchy with a given class name.
		getDragHandle(item: paper.Item): paper.Item {

			var result = item;

			if (result instanceof Higherframe.Drawing.Component.DragHandle) {

				return result;
			}

			// Find the top-level group
			while (result.parent) {

				result = result.parent;

				if (result instanceof Higherframe.Drawing.Component.DragHandle) {

					return result;
				}
			}

			return;
		};


		/**
		 * Bounding box
		 *
		 * Updates an item's bounding box according to
		 * whether it is selected. The bounding box will
		 * be added/removed/updated as appropriate.
		 */
		updateBoundingBoxes() {

			this.removeBoundingBoxes();
			this.removeCollaboratorLabels();
			this.addBoundingBoxes();
		}

		addBoundingBoxes() {

			// Draw the bounding box for other users' selections
			var selections = _.groupBy(
				this.components.filter((component) => !!component.collaborator),
				(component) => component.collaborator._id
			);

			angular.forEach(selections, (selection) => {

				var collaborator = selection[0].collaborator;

				var boundingBox = this.drawBoundingBox(selection, collaborator.color);
				this.addCollaboratorLabel(collaborator, boundingBox.bounds.topRight);
			});

			// Draw the bounding box for the current user's selection
			this.drawBoundingBox(this.selectedItems, this.theme.BoundsDefault);
		}

		removeBoundingBoxes() {

			angular.forEach(this.boundingBoxes, function (boundingBox) {

				boundingBox.remove();
			});

			this.boundingBoxes.splice(0, this.boundingBoxes.length);
		}

		// Get a rectangle containing the given items
		private getBounds(items: Array<paper.Item>) {

			var x1 = Infinity,
					x2 = -x1,
					y1 = x1,
					y2 = x2;

			items.forEach((item) => {

				x1 = Math.min(item.bounds.left, x1);
				y1 = Math.min(item.bounds.top, y1);
				x2 = Math.max(item.bounds.right, x2);
				y2 = Math.max(item.bounds.bottom, y2);
			});

			return isFinite(x1)
				? new paper.Rectangle(x1, y1, x2 - x1, y2 - y1)
				: null;
		}

		private drawBoundingBox(items: Array<Drawing.Component.IComponent>, color: paper.Color): paper.Group {

			var rect = this.getBounds(items);

			if (!rect) {

				return;
			}

			this.layerSelections.activate();

			var boundingBox = new paper.Group();

			var lineWidth = 1/paper.view.zoom;
			var box = paper.Path.Rectangle(rect);
			box.strokeColor = color;
			box.strokeWidth = lineWidth;
			boundingBox.addChild(box);

			// A single component is selected
			if (items.length == 1) {

				var component: Higherframe.Drawing.Component.IComponent = items[0];

				// Add the transform handles
				_.forEach(component.getTransformHandles(color), (transformHandle) => {

					boundingBox.addChild(transformHandle);
				});
			}

			// Multiple components are selected
			else {

				function addHandle(center: paper.Point) {

					var handle = new Drawing.Component.DragHandle(center, color);
					boundingBox.addChild(handle);
				}

				addHandle(rect.topLeft);
				addHandle(rect.topCenter);
				addHandle(rect.topRight);
				addHandle(rect.rightCenter);
				addHandle(rect.bottomRight);
				addHandle(rect.bottomCenter);
				addHandle(rect.bottomLeft);
				addHandle(rect.leftCenter);
			}

			this.boundingBoxes.push(boundingBox);
			this.layerDrawing.activate();

			return boundingBox
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

			if (selected && !item.dragHandles) {

				this.addDragHandles(item);
			}

			else if (!selected && item.dragHandles) {

				this.removeDragHandles(item);
			}

			else if (selected && item.dragHandles) {

				this.removeDragHandles(item);
				this.addDragHandles(item);
			}
		}

		addDragHandles(item: Higherframe.Drawing.Component.IComponent) {

			this.layerSelections.activate();

			item.dragHandles = new paper.Group();

			angular.forEach(item.getDragHandles(this.theme.BoundsDefault), (dh) => {

				item.dragHandles.addChild(dh);
			});

			this.layerDrawing.activate();
		}

		removeDragHandles(item) {

			item.dragHandles.remove();
			item.dragHandles = null;
		}


		/**
		 * Smart guides
		 */

		updateSmartGuides(item, sp?: Array<Drawing.SnapPoint>): { x: Drawing.SmartGuide, y: Drawing.SmartGuide } {

			this.removeSmartGuides();
			return this.addSmartGuides(item, sp);
		}

		addSmartGuides(item, sp?: Array<Drawing.SnapPoint>): { x: Drawing.SmartGuide, y: Drawing.SmartGuide } {

			var smartGuideX: Drawing.SmartGuide,
				smartGuideY: Drawing.SmartGuide;

			var majorDeltaWeighting = 1,
				minorDeltaWeighting = 0.1,
				snapScoreThreshold = 200;

			item.smartGuides = [];

			var snapPoints = sp ? sp : item.getSnapPoints();

			// TODO: Whittle down to elements in the nearby area

			// Work through each element
			this.layerDrawing.children.forEach((relation) => {

				// Don't compare target element with other selected elements
				if (this.selectedItems.indexOf(relation) !== -1) {

					return;
				}

				var relationSnapPoints = (<any>relation).getSnapPoints();

				// Look for alignment in snap points
				snapPoints.forEach((snapPoint: Drawing.SnapPoint) => {

					relationSnapPoints.forEach((relationSnapPoint) => {

						var xDelta = relationSnapPoint.point.x - snapPoint.point.x;
						var yDelta = relationSnapPoint.point.y - snapPoint.point.y;

						// If within the snap threshold
						if (Math.abs(xDelta) <= 10 || Math.abs(yDelta) <= 10) {

							// Which axis is the snap in?
							var axis: Drawing.SmartGuideAxis =
								(Math.abs(xDelta) <= Math.abs(yDelta)) ?
								Drawing.SmartGuideAxis.X :
								Drawing.SmartGuideAxis.Y;

							// Establish a score for this snap point
							var score = 0;

							if (axis == Drawing.SmartGuideAxis.X) {

								score += minorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(xDelta);
								score += majorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(yDelta);

								// Exclude snaps with a score too high
								if (score > snapScoreThreshold) { return; }

								// If a snap already exists in this axis with a
								// smaller score, don't continue
								if (smartGuideX && smartGuideX.score < score) { return; }
							}

							else if (axis == Drawing.SmartGuideAxis.Y) {

								score += minorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(yDelta);
								score += majorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(xDelta);

								// Exclude snaps with a score too high
								if (score > snapScoreThreshold) { return; }

								// If a snap already exists in this axis with a
								// smaller score, don't continue
								if (smartGuideY && smartGuideY.score < score) { return; }
							}

							// Create the new smart guide
							var smartGuide = new Drawing.SmartGuide();
							smartGuide.origin = snapPoint;
							smartGuide.relation = relationSnapPoint;
							smartGuide.axis = axis;
							smartGuide.score = score;
							smartGuide.delta = {
								x: xDelta,
								y: yDelta
							};

							if (smartGuide.axis == Drawing.SmartGuideAxis.X) {

								smartGuideX = smartGuide;
							}

							else {

								smartGuideY = smartGuide;
							}
						}
					});
				});
			});

			// Return the required adjustment on the item
			return {
				x: smartGuideX,
				y: smartGuideY
			};
		}

		drawGuide(smartGuide: Drawing.SmartGuide) {

			this.layerGuides.activate();

			var guide = new paper.Group();
			var guideStrokeWidth = 1/paper.view.zoom

			var line = paper.Path.Line(
				smartGuide.getAdjustedOriginPoint(),
				smartGuide.relation.point
			);
			line.strokeColor = this.theme.GuideDefault;
			line.strokeWidth = guideStrokeWidth;
			guide.addChild(line);

			var crossOneSE = paper.Path.Line(
				smartGuide.getAdjustedOriginPoint().subtract(new paper.Point(4, 4)),
				smartGuide.getAdjustedOriginPoint().add(new paper.Point(4, 4))
			);
			crossOneSE.strokeColor = this.theme.GuideDefault;
			crossOneSE.strokeWidth = guideStrokeWidth;
			guide.addChild(crossOneSE);

			var crossOneNE = paper.Path.Line(
				smartGuide.getAdjustedOriginPoint().subtract(new paper.Point(4, -4)),
				smartGuide.getAdjustedOriginPoint().add(new paper.Point(4, -4))
			);
			crossOneNE.strokeColor = this.theme.GuideDefault;
			crossOneNE.strokeWidth = guideStrokeWidth;
			guide.addChild(crossOneNE);

			var crossTwoSE = paper.Path.Line(
				smartGuide.relation.point.subtract(new paper.Point(4, 4)),
				smartGuide.relation.point.add(new paper.Point(4, 4))
			);
			crossTwoSE.strokeColor = this.theme.GuideDefault;
			crossTwoSE.strokeWidth = guideStrokeWidth;
			guide.addChild(crossTwoSE);

			var crossTwoNE = paper.Path.Line(
				smartGuide.relation.point.subtract(new paper.Point(4, -4)),
				smartGuide.relation.point.add(new paper.Point(4, -4))
			);
			crossTwoNE.strokeColor = this.theme.GuideDefault;
			crossTwoNE.strokeWidth = guideStrokeWidth;
			guide.addChild(crossTwoNE);

			if (smartGuide.axis == Drawing.SmartGuideAxis.X && smartGuide.relation.xName) {

				var snapText = new paper.PointText({
	        point: smartGuide.relation.point.add(new paper.Point(-10, 13)),
	        content: smartGuide.relation.xName,
	        fillColor: this.theme.GuideDefault,
	        fontSize: 9,
					justification: 'right'
	      });
				guide.addChild(snapText);
			}

			else if (smartGuide.axis == Drawing.SmartGuideAxis.Y && smartGuide.relation.yName) {

				var snapText = new paper.PointText({
	        point: smartGuide.relation.point.add(new paper.Point(-10, 13)),
	        content: smartGuide.relation.yName,
	        fillColor: this.theme.GuideDefault,
	        fontSize: 9,
					justification: 'right'
	      });
				guide.addChild(snapText);
			}

			this.layerDrawing.activate();

			this.smartGuides.push(guide);
		}

		removeSmartGuides() {

			angular.forEach(this.smartGuides, function (smartGuide) {

				smartGuide.remove();
			});

			this.smartGuides.splice(0, this.smartGuides.length);
		}


		/**
		 * Collaborator label
		 */

		addCollaboratorLabel(collaborator, anchor: paper.Point) {

			this.layerGuides.activate();

			this.components
				.filter((component) => !!component.collaborator)
				.forEach((component) => {

					var label = new paper.Group();

					// Draw the collaborator label
		      var calloutStart = anchor;
		      var calloutEnd = calloutStart.add(new paper.Point(10 / paper.view.zoom, -10 / paper.view.zoom));

		      var callout = paper.Path.Line(calloutStart, calloutEnd);
		      callout.strokeColor = collaborator.color;
		      callout.strokeWidth = 1;
					label.addChild(callout);

		      var text = new paper.PointText({
		        point: calloutEnd.add(new paper.Point(3 / paper.view.zoom, -2 / paper.view.zoom)),
		        content: component.collaborator.name,
		        fillColor: 'white',
		        fontSize: 9 / paper.view.zoom,
		        fontWeight: 600,
		        justification: 'left'
		      });

		      var bubbleRect = new paper.Rectangle(
		        new paper.Point(calloutEnd.x - 2 / paper.view.zoom, calloutEnd.y - 13 / paper.view.zoom),
		        new paper.Point(calloutEnd.x + text.bounds.width + 8 / paper.view.zoom, calloutEnd.y + 2 / paper.view.zoom)
		      );

		      var bubble = paper.Path.Rectangle(bubbleRect, 6 / paper.view.zoom);
		      bubble.fillColor = component.collaborator.color;

					label.addChild(bubble);
					label.addChild(text);

					this.collaboratorLabels.push(label);
				});

			this.layerDrawing.activate();
		}

		removeCollaboratorLabels() {

			this.collaboratorLabels.forEach((label) => {

				label.remove();
			});

			this.collaboratorLabels.splice(0, this.collaboratorLabels.length);
		}


		/**
		 * Artboards
		 */

		updateArtboards() {

			this.artboards.forEach((artboard) => {

				artboard.update(this);
			});
		}


		/**
		 * Grid
		 */

		updateGrid() {
return;
				var gridMajorSize = 100,
					gridMinorSize = 20,
					gridMajorColor = 'rgba(0,0,0,0.07)',
					gridMinorColor = 'rgba(0,0,0,0.03)',
					gridStrokeWidth = 1/paper.view.zoom;

				this.layerGrid.activate();

				this.artboards.forEach((artboard) => {

					// Establish an origin and line count,
					// starting just outside the viewport
					var startX = artboard.bounds.left,
						endX = Math.floor(artboard.bounds.right / gridMajorSize) * gridMajorSize,
						startY = artboard.bounds.top,
						endY = Math.floor(artboard.bounds.bottom / gridMajorSize) * gridMajorSize,
						countX = (endX - startX) / gridMinorSize,
						countY = (endY - startY) / gridMinorSize;

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

						var from = new paper.Point(artboard.bounds.left, startY + y);
						var to = new paper.Point(artboard.bounds.right, startY + y);

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

						var from = new paper.Point(startX + x, artboard.bounds.top);
						var to = new paper.Point(startX + x, artboard.bounds.bottom);

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
				});

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
