
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
		public selectedComponents: Array<Common.Drawing.Component> = [];
		public selectedArtboards: Array<Higherframe.Drawing.Artboard> = [];
		public selectedDragHandles: Array<Common.Drawing.DragHandle> = [];

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

		components: Array<Common.Drawing.Component> = [];
		artboards: Array<Higherframe.Drawing.Artboard> = [];
		transformHandles: Array<Common.Drawing.DragHandle> = [];
		boundingBoxes: Array<paper.Item> = [];
		smartGuides: Array<paper.Item> = [];
		collaboratorLabels: Array<paper.Item> = [];

		theme: Common.UI.ITheme = new Common.UI.DefaultTheme();
		tool: Higherframe.Wireframe.Tool;


		constructor(
			private $window: Higherframe.IWindow,
			private $timeout: ng.ITimeoutService,
			private CanvasRegistry: Higherframe.Wireframe.CanvasRegistry
		) {

			Canvas.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

				this.element = element;
				this.scope = scope;

				// Register as the current canvas
				CanvasRegistry.setCanvas(this);


				/**
				 * Toolbox notifications
				 */

				scope.$on('toolbox:tool:selected', (e, tool) => {

					if (!tool) {

						return;
					}

					this.setTool(tool);
				});


				/**
				 * Controller notifications
				 */

				scope.$on('event:keydown', (e, keyEvent) => {

					this.onKeyDown(keyEvent);
				});

				scope.$on('view:zoom', (e, zoom) => {

					this.changeZoom(zoom, null);
				});

				scope.$on('view:pan', (e, center) => {

					this.changeCenter(center, null);
				});

				scope.$on('controller:artboard:added', (e, data) => {

					// Insertion options
					var defaults = {
						select: true
					};

					var options = angular.extend(defaults, data.options || {});

					// Add the artboards
					data.artboards.forEach((artboard: Higherframe.Drawing.Artboard) => {

						this.artboards.push(artboard);

						// Ensure the artboard is on the artboards layer
						this.layerArtboards.addChild(artboard);

						artboard.update();
					});

					// Select new artboards if requested
					if (options.select) {

						this.clearArtboardSelection();
						// this.selectArtboards(data.artboards);
					}
				});

				scope.$on('controller:artboard:removed', (e, data) => {

					var model = data.artboard;

					// Find the artboard with the corresponding data model
					this.layerArtboards.children.forEach((artboard: Higherframe.Drawing.Artboard) => {

						if (artboard.model._id == model._id) {

			        // Remove the artboard
							artboard.remove();
						}
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
							artboard.update();
						}
					});
				});

				scope.$on('controller:component:updated', (e, data) => {

					let component = <Common.Drawing.Component>data.component;
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

						this.clearComponentSelection();
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

			// Apply mousewheel event to canvas element if it doesn't have an
			// attached handler already
			(<any>$(this.element)).unbind('mousewheel');
			(<any>$(this.element)).mousewheel((event) => this.mouseWheelHandler.call(this, event));
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

     mouseWheelHandler(event) {

       event.preventDefault();

			 var mousePosition = new paper.Point(event.offsetX, event.offsetY);
			 this.changeCenter(-event.deltaX, event.deltaY);
     }

		onKeyDown(event) {

			// Proxy the event to the currently active tool
			if ((<any>paper.tool).keyDownHandler) {

				(<any>paper.tool).keyDownHandler(event);
			}
		}


		/**
		 * State handlers
		 */

		onItemChanged(item: Common.Drawing.Component) {

			item.update();
			this.updateBoundingBoxes();
			this.updateDragHandles(item);
		}

		onArtboardChanged(artboard: Higherframe.Drawing.Artboard) {

			artboard.update();
			this.updateBoundingBoxes();
			this.updateDragHandles(artboard);
		}


		/**
		 * Data methods
		 */

		public clearArtboardSelection() {

 			angular.forEach(this.selectedArtboards, (artboard) => {

 				artboard.focussed = false;
 			});

 			this.scope.$emit('view:artboard:deselected', this.selectedArtboards);
 			this.selectedArtboards = [];

			this.layerArtboards.children.forEach((artboard: Higherframe.Drawing.Artboard) => {

				this.onArtboardChanged(artboard);
			});
 		}

		public clearComponentSelection() {

			angular.forEach(this.selectedComponents, (item) => {

				item.focussed = false;
			});

			this.scope.$emit('view:component:deselected', this.selectedComponents);
			this.selectedComponents = [];

			this.layerDrawing.children.forEach((item: Common.Drawing.Component) => {

				this.onItemChanged(item);
			});
		}

		public selectArtboards(artboards: Array<Higherframe.Drawing.Artboard>) {

			var newselectedArtboards = [];

			artboards.forEach((artboard) => {

				var exists = !!_.find(this.selectedArtboards, (selectedArtboard) => {

					return selectedArtboard.id == artboard.id;
				});

				if (!exists) {

					artboard.focussed = true;
					this.selectedArtboards.push(artboard);
					this.onArtboardChanged(artboard);
					newselectedArtboards.push(artboard);

					artboard.update();
				}
			});

			this.scope.$emit('view:artboard:selected', newselectedArtboards);
		}

		selectItems(items: Array<Common.Drawing.Component>) {

			var newselectedComponents = [];

			angular.forEach(items, (item) => {

				var exists = !!_.find(this.selectedComponents, (selectedItem) => {

					return selectedItem.id == item.id;
				});

				if (!exists) {

					item.focussed = true;
					this.selectedComponents.push(item);
					this.onItemChanged(item);
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

		removeItems(items: Array<Common.Drawing.Component>) {

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

		public createArtboard(bounds: paper.Rectangle) {

			var data: any = {
				left: bounds.left,
				top: bounds.top,
				width: bounds.width,
				height: bounds.height
			};

			// Find a suitable name
			var i = 1;
			while(_.find(this.artboards, (artboard) => artboard.name == `Artboard ${i}`)) {

				i++;
			}
			data.name = `Artboard ${i}`;

			this.scope.$emit('view:artboard:create', [data]);
		}

		public commitArtboards(artboards: Array<Higherframe.Drawing.Artboard>) {

			this.scope.$emit('view:artboard:updated', artboards);
		}

		moveItems(items: Array<Common.Drawing.Component>) {

			this.scope.$emit('componentsMoved', items);
		}

		nudge(items: Array<Common.Drawing.Component>, x, y) {

			angular.forEach(items, (item) => {

				var delta = new paper.Point(x, y);
				item.position = item.position.add(delta);
				this.updateBoundingBoxes();
				this.updateDragHandles(item);
			});

			this.scope.$emit('componentsMoved', items);
		}

		moveForward(items: Array<Common.Drawing.Component>) {

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

		moveToFront(items: Array<Common.Drawing.Component>) {

			angular.forEach(items, (item) => {

				item.bringToFront();
			});

			this.scope.$emit('componentsIndexModified', items);
		}

		moveBackward(items: Array<Common.Drawing.Component>) {

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

		moveToBack(items: Array<Common.Drawing.Component>) {

			angular.forEach(items, (item) => {

				item.sendToBack();
			});

			this.scope.$emit('componentsIndexModified', items);
		}


		/**
		 * View methods
		 */

		setCursor(cursor: string) {

			this.element.css('cursor', cursor);
		}

		setImageCursor(url: string, urlHidpi: string, fallback: string, focus?: string) {

			this.element.css('cursor', `${ url } ${ focus }`);
			this.element.css('cursor', `-webkit-image-set(url(${ url }) 1x, url(${ urlHidpi }) 2x) ${ focus }, ${ fallback }`);
		}

		setTool(tool: Higherframe.Wireframe.Tool) {

			// Activate the tool
			tool.activate();
			this.tool = tool;
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
			angular.forEach(this.layerDrawing.children, (item: Common.Drawing.Component) => {

				if (item.isInside(this.dragSelectionRectangle) &&
					this.selectedComponents.indexOf(item) === -1
				) {

					this.selectItems([<Common.Drawing.Component>item]);
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
			this.dragSelectionOverlay.fillColor = theme.BoundsDefault;
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
		getDragHandle(item: paper.Item): Common.Drawing.DragHandle {

			var result = item;

			if (result instanceof Common.Drawing.DragHandle) {

				return result;
			}

			// Find the top-level group
			while (result.parent) {

				result = result.parent;

				if (result instanceof Common.Drawing.DragHandle) {

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

				var boundingBox = this.drawBoundingBox(selection, new paper.Color(collaborator.color));
				this.addCollaboratorLabel(collaborator, boundingBox.bounds.topRight);
			});

			// Drawing the current user's bounding box
			let selection = (<Array<any>>this.selectedComponents).concat(this.selectedArtboards);

			// Draw the bounding box for each item in the current user's selection
			// If there is more than one item selected, we will apply the transform
			// handles to the composite selection instead of the individual item
			selection.forEach((item) => {

				this.drawBoundingBox([item], this.theme.BoundsDefault, !(selection.length > 1));
			});

			// Draw the bounding box for the current user's composite selection
			if (this.selectedComponents.length > 1) {

				this.drawBoundingBox(
					selection,
					this.theme.BoundsDefault,
					true
				);
			}
		}

		removeBoundingBoxes() {

			this.boundingBoxes.forEach((bb) => {

				bb.remove();
			});

			this.transformHandles.forEach((th) => {

				th.remove();
			});

			this.boundingBoxes.splice(0, this.boundingBoxes.length);
			this.transformHandles.splice(0, this.transformHandles.length);
		}

		// Get a rectangle containing the given items
		public getBounds(items: Array<Common.Drawing.Item>) {

			var x1 = Infinity,
					x2 = -x1,
					y1 = x1,
					y2 = x2;

			items.forEach((item) => {

				let bounds = item.getBoundsRectangle();
				x1 = Math.min(bounds.left, x1);
				y1 = Math.min(bounds.top, y1);
				x2 = Math.max(bounds.right, x2);
				y2 = Math.max(bounds.bottom, y2);
			});

			return isFinite(x1)
				? new paper.Rectangle(x1, y1, x2 - x1, y2 - y1)
				: null;
		}

		private drawBoundingBox(items: Array<Common.Drawing.Item>, color: paper.Color, handles: boolean = false): paper.Group {

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

			// Add handles
			if (handles) {

				// A single component is selected
				if (items.length == 1) {

					var component = <Common.Drawing.Component>items[0];

					// Add the transform handles
					_.forEach(component.getTransformHandles(color), (transformHandle) => {

						this.transformHandles.push(transformHandle);
					});
				}

				// Multiple components are selected
				else {

					let addHandle = (center: paper.Point) => {

						var handle = new Common.Drawing.DragHandle(center);
						this.transformHandles.push(handle);
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
		updateDragHandles(item: Common.Drawing.Item) {

			var selected = (this.selectedComponents.indexOf(<any>item) !== -1);

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

		addDragHandles(item: Common.Drawing.Item) {

			this.layerSelections.activate();

			item.dragHandles = [];

			angular.forEach(item.getDragHandles(this.theme.BoundsDefault), (dh) => {

				item.dragHandles.push(dh);
			});

			this.layerDrawing.activate();
		}

		removeDragHandles(item) {

			item.dragHandles.forEach((dh) => dh.remove());
			item.dragHandles = [];
		}


		/**
		 * Smart guides
		 */

		drawSmartGuide(smartGuide: Common.Drawing.SmartGuide) {

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
		      bubble.fillColor = new paper.Color(component.collaborator.color);

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

				artboard.update();
			});
		}


		/**
		 * Grid
		 */

		updateGrid() {

				/* var gridMajorSize = 100,
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

				this.layerDrawing.activate(); */
		}


		static factory(): ng.IDirectiveFactory {

			const directive = ($window: Higherframe.IWindow, $timeout, CanvasRegistry: Higherframe.Wireframe.CanvasRegistry) => new Canvas($window, $timeout, CanvasRegistry);
			directive.$inject = ['$window', '$timeout', 'CanvasRegistry'];
			return directive;
		}
	}
}

angular
	.module('siteApp')
	.directive('wireframe', Higherframe.Wireframe.Canvas.factory());
