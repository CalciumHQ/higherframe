
/// <reference path="../../library/higherframe.ts"/>

// Has paper been initialized yet
var _paperInitialized;

module Higherframe.Wireframe {

	export class Canvas implements ng.IDirective {

		link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
		restrict = 'A';


		/**
		 * Member variables
		 */

		element: ng.IAugmentedJQuery;
		scope: ng.IScope;

		isDragSelecting: boolean = false;
		dragSelectionRectangle;
		dragSelectionOverlay;

		// Drawing interaction
		public selectedComponents: Array<Common.Drawing.Component.IComponent> = [];
		public selectedArtboards: Array<Higherframe.Drawing.Artboard> = [];
		public selectedDragHandles: Array<Common.Drawing.Component.DragHandle> = [];

		hoveredItem;
		selectedSegment;
		hoveredDragHandle;
		selectedDragHandle;

		// Artboard interaction


		// Layers
		layerArtboards: paper.Layer;
		layerGrid: paper.Layer;
		layerDrawing: paper.Layer;
		layerAnnotations: paper.Layer;
		layerSelections: paper.Layer;
		layerGuides: paper.Layer;

		gridLines:{
			x: Array<paper.Path>,
			y: Array<paper.Path>
		} = { x: [], y: [] };

		components: Array<Common.Drawing.Component.IComponent> = [];
		artboards: Array<Higherframe.Drawing.Artboard> = [];
		boundingBoxes: Array<paper.Item> = [];
		smartGuides: Array<paper.Item> = [];
		collaboratorLabels: Array<paper.Item> = [];

		theme: Common.UI.ITheme = new Common.UI.DefaultTheme();
		editMode: Common.Drawing.EditMode = Common.Drawing.EditMode.Draw;


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

				scope.$on('controller:artboard:added', (e, data) => {

					data.artboards.forEach((artboard: Higherframe.Drawing.Artboard) => {

						this.artboards.push(artboard);

						// Ensure the artboard is on the artboards layer
						this.layerArtboards.addChild(artboard);

						artboard.update(this);
					});
				});

				scope.$on('controller:artboard:updated', (e, data) => {

					var model = data.artboard;

					// Find the artboard with the corresponding data model
					this.layerArtboards.children.forEach((artboard: Higherframe.Drawing.Artboard) => {

						if (artboard.model._id == model._id) {

			        // Merge the changes into the view component object
			        artboard.model = angular.extend(artboard.model, model);
							artboard.sync();

			        // Update
							artboard.update(this);
						}
					});
				});

				scope.$on('controller:component:updated', (e, data) => {

					let component = <Common.Drawing.Component.IComponent>data.component;
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
			var drawTool = Wireframe.Tools.Draw.get(this);
			var artboardsTool = Wireframe.Tools.Artboards.get(this);
 		}

 		initLayers() {

			this.layerArtboards = new paper.Layer();
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

		onDrawKeyDown(event) {

			// Proxy the event to the currently active tool
			if ((<any>paper.tool).keyDownHandler) {

				(<any>paper.tool).keyDownHandler(event);
			}
		}


		/**
		 * State handlers
		 */

		onItemUpdated(item: Common.Drawing.Component.IComponent) {

			item.update();
			this.updateBoundingBoxes();
			this.updateDragHandles(item);
		}


		/**
		 * Data methods
		 */

		clearSelection() {

			angular.forEach(this.selectedComponents, (item) => {

				item.focussed = false;
			});

			this.scope.$emit('componentsDeselected', this.selectedComponents);
			this.selectedComponents = [];

			angular.forEach(this.layerDrawing.children, (item: Common.Drawing.Component.IComponent) => {

				this.onItemUpdated(item);
			});
		}

		selectItems(items: Array<Common.Drawing.Component.IComponent>) {

			var newselectedComponents = [];

			angular.forEach(items, (item) => {

				var exists = !!_.find(this.selectedComponents, (selectedItem) => {

					return selectedItem.id == item.id;
				});

				if (!exists) {

					item.focussed = true;
					this.selectedComponents.push(item);
					this.onItemUpdated(item);
					(<any>paper.view).draw();
					newselectedComponents.push(item);
				}
			});

			this.scope.$emit('componentsSelected', newselectedComponents);
		}

		public removeArtboards(artboards: Array<Higherframe.Drawing.Artboard>) {

			this.scope.$emit('view:artboard:deleted', artboards);

			while(artboards.length) {

				var artboard = artboards[artboards.length-1];

				artboard.remove();

				var index = this.artboards.indexOf(artboard);
				if (index !== -1) {

					this.artboards.splice(index, 1);
				}

				index = this.selectedArtboards.indexOf(artboard);
				if (index !== -1) {

					this.selectedArtboards.splice(index, 1);
				}
			}
		}

		removeItems(items: Array<Common.Drawing.Component.IComponent>) {

			this.scope.$emit('componentsDeleted', items);

			while(items.length) {

				var item = items[items.length-1];

				item.remove();

				var index = this.components.indexOf(item);
				if (index !== -1) {

					this.components.splice(index, 1);
				}

				index = this.selectedComponents.indexOf(item);
				if (index !== -1) {

					this.selectedComponents.splice(index, 1);
				}

				this.updateBoundingBoxes();
				this.removeDragHandles(item);
			}
		}

		public commitArtboards(artboards: Array<Higherframe.Drawing.Artboard>) {

			this.scope.$emit('view:artboard:updated', artboards);
		}

		moveItems(items: Array<Common.Drawing.Component.IComponent>) {

			this.scope.$emit('componentsMoved', items);
		}

		nudge(items: Array<Common.Drawing.Component.IComponent>, x, y) {

			angular.forEach(items, (item) => {

				var delta = new paper.Point(x, y);
				item.position = item.position.add(delta);
				this.updateBoundingBoxes();
				this.updateDragHandles(item);
			});

			this.scope.$emit('componentsMoved', items);
		}

		moveForward(items: Array<Common.Drawing.Component.IComponent>) {

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

		moveToFront(items: Array<Common.Drawing.Component.IComponent>) {

			angular.forEach(items, (item) => {

				item.bringToFront();
			});

			this.scope.$emit('componentsIndexModified', items);
		}

		moveBackward(items: Array<Common.Drawing.Component.IComponent>) {

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

		moveToBack(items: Array<Common.Drawing.Component.IComponent>) {

			angular.forEach(items, (item) => {

				item.sendToBack();
			});

			this.scope.$emit('componentsIndexModified', items);
		}


		/**
		 * View methods
		 */

		setEditMode(mode: Common.Drawing.EditMode) {

			this.editMode = mode;
			this.updateArtboards();

			switch (mode) {

				case Common.Drawing.EditMode.Draw:

					Wireframe.Tools.Draw.get(this).activate();

					// Clean up
					this.artboards.forEach((artboard) => {

						artboard.hovered = false;
						artboard.focussed = false;
					});

					this.updateArtboards();

					// Style the canvas
					this.layerDrawing.opacity = 1;

					break;

				case Common.Drawing.EditMode.Artboards:

					Wireframe.Tools.Artboards.get(this).activate();

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
			angular.forEach(this.layerDrawing.children, (item: Common.Drawing.Component.IComponent) => {

				if (item.isInside(this.dragSelectionRectangle) &&
					this.selectedComponents.indexOf(item) === -1
				) {

					this.selectItems([<Common.Drawing.Component.Base>item]);
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

			let theme: Common.UI.ITheme = new Common.UI.DefaultTheme();
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
		getDragHandle(item: paper.Item): Common.Drawing.Component.DragHandle {

			var result = item;

			if (result instanceof Common.Drawing.Component.DragHandle) {

				return result;
			}

			// Find the top-level group
			while (result.parent) {

				result = result.parent;

				if (result instanceof Common.Drawing.Component.DragHandle) {

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
			this.drawBoundingBox(this.selectedComponents, this.theme.BoundsDefault);
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

		private drawBoundingBox(items: Array<Common.Drawing.Component.IComponent>, color: paper.Color): paper.Group {

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

				var component: Common.Drawing.Component.IComponent = items[0];

				// Add the transform handles
				_.forEach(component.getTransformHandles(color), (transformHandle) => {

					boundingBox.addChild(transformHandle);
				});
			}

			// Multiple components are selected
			else {

				function addHandle(center: paper.Point) {

					var handle = new Common.Drawing.Component.DragHandle(center, color);
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

			var selected = (this.selectedComponents.indexOf(item) !== -1);

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

		addDragHandles(item: Common.Drawing.Component.IComponent) {

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

		updateSmartGuides(item, sp?: Array<Common.Drawing.SnapPoint>): { x: Common.Drawing.SmartGuide, y: Common.Drawing.SmartGuide } {

			this.removeSmartGuides();
			return this.addSmartGuides(item, sp);
		}

		addSmartGuides(item, sp?: Array<Common.Drawing.SnapPoint>): { x: Common.Drawing.SmartGuide, y: Common.Drawing.SmartGuide } {

			var smartGuideX: Common.Drawing.SmartGuide,
				smartGuideY: Common.Drawing.SmartGuide;

			var majorDeltaWeighting = 1,
				minorDeltaWeighting = 0.1,
				snapScoreThreshold = 200;

			item.smartGuides = [];

			var snapPoints = sp ? sp : item.getSnapPoints();

			// TODO: Whittle down to elements in the nearby area

			// Work through each element
			this.layerDrawing.children.forEach((relation: Common.Drawing.Component.IComponent) => {

				// Don't compare target element with other selected elements
				if (this.selectedComponents.indexOf(relation) !== -1) {

					return;
				}

				var relationSnapPoints = (<any>relation).getSnapPoints();

				// Look for alignment in snap points
				snapPoints.forEach((snapPoint: Common.Drawing.SnapPoint) => {

					relationSnapPoints.forEach((relationSnapPoint) => {

						var xDelta = relationSnapPoint.point.x - snapPoint.point.x;
						var yDelta = relationSnapPoint.point.y - snapPoint.point.y;

						// If within the snap threshold
						if (Math.abs(xDelta) <= 10 || Math.abs(yDelta) <= 10) {

							// Which axis is the snap in?
							var axis: Common.Drawing.SmartGuideAxis =
								(Math.abs(xDelta) <= Math.abs(yDelta)) ?
								Common.Drawing.SmartGuideAxis.X :
								Common.Drawing.SmartGuideAxis.Y;

							// Establish a score for this snap point
							var score = 0;

							if (axis == Common.Drawing.SmartGuideAxis.X) {

								score += minorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(xDelta);
								score += majorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(yDelta);

								// Exclude snaps with a score too high
								if (score > snapScoreThreshold) { return; }

								// If a snap already exists in this axis with a
								// smaller score, don't continue
								if (smartGuideX && smartGuideX.score < score) { return; }
							}

							else if (axis == Common.Drawing.SmartGuideAxis.Y) {

								score += minorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(yDelta);
								score += majorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(xDelta);

								// Exclude snaps with a score too high
								if (score > snapScoreThreshold) { return; }

								// If a snap already exists in this axis with a
								// smaller score, don't continue
								if (smartGuideY && smartGuideY.score < score) { return; }
							}

							// Create the new smart guide
							var smartGuide = new Common.Drawing.SmartGuide();
							smartGuide.origin = snapPoint;
							smartGuide.relation = relationSnapPoint;
							smartGuide.axis = axis;
							smartGuide.score = score;
							smartGuide.delta = {
								x: xDelta,
								y: yDelta
							};

							if (smartGuide.axis == Common.Drawing.SmartGuideAxis.X) {

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

		drawGuide(smartGuide: Common.Drawing.SmartGuide) {

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

			if (smartGuide.axis == Common.Drawing.SmartGuideAxis.X && smartGuide.relation.xName) {

				var snapText = new paper.PointText({
	        point: smartGuide.relation.point.add(new paper.Point(-10, 13)),
	        content: smartGuide.relation.xName,
	        fillColor: this.theme.GuideDefault,
	        fontSize: 9,
					justification: 'right'
	      });
				guide.addChild(snapText);
			}

			else if (smartGuide.axis == Common.Drawing.SmartGuideAxis.Y && smartGuide.relation.yName) {

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
