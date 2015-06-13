
angular
	.module('siteApp')
	.directive('wireframe', ['$window', function ($window) {
	
			return {
				restrict: 'A',
				scope: {
					data: '='
				},
				link: function postLink($scope, element, attrs) {
					
					
					/**
					 * Constants
					 */
					
					var layerGrid,
						layerDrawing,
					 	layerAnnotations,
					 	layerSelections,
						layerGuides;
					
					var colors = {
						normal: '#888',
						hover: '#7ae'
					};
					 
					/**
					 * Variables
					 */
	
					var isDragSelecting = false;
					var dragSelectionRectangle;
					var dragSelectionOverlay;

					var hoveredItem;
					var selectedItems = [];
					var selectedSegment;
					
					var lastMousePosition;

					var hitOptions = {
						segments: true,
						stroke: true,
						fill: true,
						tolerance: 5
					};
					
					var gridLines = { x: [], y: [] };
	
	
					/**
					 * Event handlers
					 */

					function mouseUp(event) {
						
						// If dragging an item
						if (selectedItems.length) {

							angular.forEach(selectedItems, function (item) {
								
								moveItem(item, item.position);
								removeSmartGuides(item);
								item.mousePositionDelta = null;
							});	
						}
						
						else {
							
							// End drag selection
							endDragSelection();
						}
						
						selectedSegment = null;
					};

					function mouseMove(event) {

						// Return the last hovered item to default state
						if (hoveredItem) {

							if (hoveredItem.collaborator) {
								
								hoveredItem.setComponentColor(hoveredItem.collaborator.color);
							}
							
							else {
							
								hoveredItem.setComponentColor(colors.normal);	
							}
						}

						// Hit test a new item and set hover style
						var hitResult = layerDrawing.hitTest(event.point, hitOptions);

						if (hitResult) {

							var component = getTopmost(hitResult.item);
							
							component.setComponentColor(colors.hover);
							hoveredItem = component;
						}
					};
	
					function mouseDrag(event) {
						
						// Pan when space bar is held
						if (event.modifiers.space) {
						
							// Can't use event.delta since the canvas moves
							// and odd behaviour occurs. Use browser events
							// instead
							var position = new paper.Point(
								event.event.screenX,
								event.event.screenY
							);
							
							var delta = position.subtract(lastMousePosition);
							lastMousePosition = position;
							
							// Move the canvas
							changeCenter(delta.x, delta.y);
						}
						
						// Else if dragging a segment	
						else if (selectedSegment && (selectedItems.length == 1)) {
							
							var selectedItem = selectedItems[0];

							// Check if component definition allows resizing
							if (!selectedItem.definition.resizable) {
								
								return;
							}
						
							var scaleX = 1 + event.delta.x / selectedItem.bounds.width;
							var scaleY = 
								event.modifiers.shift ? 
								scaleX : 
								1 + event.delta.y / selectedItem.bounds.height;
								
							selectedItem.scale(scaleX, scaleY);
						}

						// If dragging an item
						else if (selectedItems.length) {

							angular.forEach(selectedItems, function(item) {
								
								// The new position
								var position = event.point.add(item.mouseDownDelta);
								
								// Position the item and its bounding box
								item.position = position;
								item.boundingBox.position = position;	
								
								// Find a snap point
								var snapAdjustment = updateSmartGuides(item);
							
								// If a snap point was found
								if (snapAdjustment) {
									
									position = position.add(snapAdjustment);
									
									// Reposition the item and its bounding box
									item.position = position;
									item.boundingBox.position = position;	
								}	
							});
						}
						
						// If drag selecting
						else if (isDragSelecting) {

							updateDragSelection(event.downPoint, event.point);
						}
					};
	
					function mouseDown(event) {
						
						lastMousePosition = new paper.Point(
							event.event.screenX,
							event.event.screenY
						);
						
						// Add the new selection
						var hitResult = layerDrawing.hitTest(event.point, hitOptions);
						
						// If no hit target clear the last selection
						if (!hitResult) {
						
							clearSelection();
							
							// Start drag selection
							startDragSelection(event.downPoint);
						}

						// Add the new selection
						else {
							
							// Find the top-level group
							var item = getTopmost(hitResult.item);
							
							// First clear the last selection unless the shift key
							// is held down, or the hit target is selected 
							if (!event.modifiers.shift && selectedItems.indexOf(item) === -1) {
							
								clearSelection();	
							}

							// Select the hit target
							if (hitResult.type == 'segment') {

								selectedSegment = hitResult.segment;
								selectItems(item);
							}

							else if (hitResult.type == 'fill' || hitResult.type == 'stroke') {

								selectItems(item);
							}
							
							// Store where the mouse down point is in relation
							// to the position of each selected item
							// This is used to position an item correctly during
							// a drag
							angular.forEach(selectedItems, function (item) {
								
								item.mouseDownDelta = item.position.subtract(event.point);
							});
						}
					};
					
					function mouseWheel(event) {
					
						event.preventDefault();
						
						var mousePosition = new paper.Point(event.offsetX, event.offsetY);
						changeCenter(-event.deltaX, event.deltaY);
					};

					function keyDown(event) {

						switch (event.key) {
							case 'backspace':
							
								if (selectedItems.length) {
									
									removeItems(selectedItems);
									event.event.preventDefault();
								}
									
								break;
							
							// Nudge left on the left key
							case 'left':
								
								var amount = event.modifiers.shift ? -10 : -1;
								if (selectedItems.length) {
								
									nudge(selectedItems, amount, 0);	
								}
								
								break;
								
							// Nudge right on the right key
							case 'right':
								
								var amount = event.modifiers.shift ? 10 : 1;
								if (selectedItems.length) {
								
									nudge(selectedItems, amount, 0);
								}
								
								break;
								
							// Nudge up on the up key
							case 'up':
								
								var amount = event.modifiers.shift ? -10 : -1;
								if (selectedItems.length) {
								
									nudge(selectedItems, 0, amount);	
								}
								
								break;
								
							// Nudge down on the down key
							case 'down':
								
								var amount = event.modifiers.shift ? 10 : 1;
								if (selectedItems) {
								
									nudge(selectedItems, 0, amount);
								}
								
								break;
							
							// Move forward on the ']' key
							case ']':
							
								if (selectedItems) {
									
									moveForward(selectedItems);
								}
								
								break;
								
							// Move to front on the 'shift+]' key
							case '}':
							
								if (selectedItems) {
									
									moveToFront(selectedItems);
								}
								
								break;
								
							// Move backward on the '[' key
							case '[':
							
								if (selectedItems) {
									
									moveBackward(selectedItems);
								}
								
								break;
								
							// Move to back on the 'shift+[' key
							case '{':
							
								if (selectedItems) {
									
									moveToBack(selectedItems);	
								}
								
								break;
						}
							
					};
					
					
					/**
					 * Controller notifications
					 */
					 
					$scope.$on('component:collaboratorSelect', function (e, data) {
						
						// Find the component with this id
						var component = _.find(layerDrawing.children, function (child) {
							
							if (child.remoteId == data.component._id) { return true; }
						});
						
						// Set the color for the user
						component.collaborator = data.user;
						component.setComponentColor(data.user.color);
					});
					
					$scope.$on('component:collaboratorDeselect', function (e, data) {
						
						// Find the component with this id
						var component = _.find(layerDrawing.children, function (child) {
							
							if (child.remoteId == data.component._id) { return true; }
						});
						
						// Set the color for the user
						component.collaborator = null;
						component.setComponentColor(colors.normal);
					});
					
					
					/**
					 * State handlers
					 */
					 
					var onItemUpdated = function (item) {
						
						updateBoundingBox(item);
					};
					
					
					/**
					 * Data methods
					 */
					 
					function clearSelection() {
						
						$scope.$emit('componentsDeselected', selectedItems);
						
						selectedItems = [];
						
						angular.forEach(layerDrawing.children, function (item) {
							
							onItemUpdated(item);
						});
					};
					
					function selectItems(items) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
					
						angular.forEach(items, function (item) {
							
							if (selectedItems.indexOf(item) === -1) {
								
								selectedItems.push(item);
								onItemUpdated(item);
							}
						});
						
						$scope.$emit('componentsSelected', items);
					};
					
					function removeItems(items) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
						
						$scope.$emit('componentsDeleted', items);
						
						while(items.length) {
						
							var item = items[items.length-1];
							
							item.remove();
							
							var index = selectedItems.indexOf(item);
							
							if (index !== -1) {
								
								selectedItems.splice(index, 1);
							}
							
							removeBoundingBox(item);
						}
					};
					
					function moveItem(items, position) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
					
						angular.forEach(items, function (item) {
							
							item.position = position;
							updateBoundingBox(item);
						});
						
						$scope.$emit('componentsMoved', items);
					};
					 
					function nudge(items, x, y) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
					
						angular.forEach(items, function (item) {
							
							var delta = new paper.Point(x, y);
							item.position = item.position.add(delta);
						});
						
						$scope.$emit('componentsMoved', items);
					};
					 
					function moveForward(items) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
					
						angular.forEach(items, function (item) {
	
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
						
						$scope.$emit('componentsIndexModified', items);
					};
					
					function moveToFront(items) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
					
						angular.forEach(items, function (item) {
	
							item.bringToFront();
						});
						
						$scope.$emit('componentsIndexModified', items);
					};
					
					function moveBackward(items) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
					
						angular.forEach(items, function (item) {
	
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
						
						$scope.$emit('componentsIndexModified', items);
					};
					
					function moveToBack(items) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
					
						angular.forEach(items, function (item) {
	
							item.sendToBack();
						});
						
						$scope.$emit('componentsIndexModified', items);
					};
	

					/**
					 * View methods
					 */

					function changeCenter(deltaX, deltaY) {
					
						paper.view.center = paper.view.center.add(new paper.Point(
							-deltaX / paper.view.zoom, 
							-deltaY / paper.view.zoom
						));
						
						updateGrid();
					};

					function changeZoom(delta, target) {
						
						var factor = 1.04;
						var center = paper.view.center;
						var oldZoom = paper.view.zoom;
						var newZoom;
								
						if (!target) {
							
							target = center;	
						}
						
						if (delta == 0) {
							
							return;
						}
						
						else if (delta < 0) {
						
							newZoom = oldZoom * factor;
						}
						
						else if (delta > 0) {
						
							newZoom = oldZoom / factor;	
						}
						
						var beta = oldZoom / newZoom;
						var pc = target.subtract(center);
						var a = target.subtract(pc.multiply(beta)).subtract(center);
						
						paper.view.zoom = newZoom;
						paper.view.center = paper.view.center.add(a);
						
						updateGrid();
					};
					
					function startDragSelection(from) {
					
						isDragSelecting = true;
						dragSelectionRectangle = new paper.Rectangle(from, from);
						
						layerSelections.activate();
						dragSelectionOverlay = new paper.Path.Rectangle(dragSelectionRectangle);
						layerDrawing.activate();
					};
					
					function endDragSelection() {
						
						// Select the items in the rectangle
						angular.forEach(layerDrawing.children, function (item) {
							
							if (item.isInside(dragSelectionRectangle) && 
								selectedItems.indexOf(item) === -1
							) {
								
								selectItems([item]);
							}
						});
						
						// Clean up after selection
						isDragSelecting = false;
						dragSelectionRectangle = null;
						
						if (dragSelectionOverlay) {
						
							dragSelectionOverlay.remove();
							dragSelectionOverlay = null;	
						}
					};
					
					function updateDragSelection(from, to) {
							
						dragSelectionRectangle = new paper.Rectangle(from, to);
						
						// Update the overlay indicating the drag region
						if (dragSelectionOverlay) {
						
							dragSelectionOverlay.remove();	
						}
						
						layerSelections.activate();
						dragSelectionOverlay = new paper.Path.Rectangle(dragSelectionRectangle);
						dragSelectionOverlay.fillColor = '#4d7cb8';
						dragSelectionOverlay.strokeColor = '#0047a1';
						dragSelectionOverlay.strokeWidth = 2;
						dragSelectionOverlay.opacity = 0.3;
						layerDrawing.activate();
					};
					
					
					/**
					 * Helper methods
					 */
					 
					// Given a paper item, finds the top-most item in its
					// hierarchy. This is typically a component.
					var getTopmost = function (item) {
						
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
					var updateBoundingBox = function(item) {
						
						var selected = (selectedItems.indexOf(item) !== -1);
						
						if (selected && !item.boundingBox) {
							
							addBoundingBox(item);
						}
						
						else if (!selected && item.boundingBox) {
							
							removeBoundingBox(item);
						}
						
						else if (selected && item.boundingBox) {
							
							removeBoundingBox(item);
							addBoundingBox(item);
						}
					};
					
					var addBoundingBox = function (item) {
						
						if (!item.boundingBox) {
							
							layerSelections.activate();
							
							var bb = new paper.Path.Rectangle(item.bounds);
							bb.strokeColor = colors.hover;
							bb.strokeWidth = 1;
							
							var drawHandle = function (point) {
								
								var handle = new paper.Path.Rectangle(
									new paper.Point(point.x - 3, point.y - 3),
									new paper.Point(point.x + 3, point.y + 3)
								);
								
								handle.strokeColor = colors.hover;
								handle.strokeWidth = 1;
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
							
							layerDrawing.activate();
						}
					};
					
					var removeBoundingBox = function (item) {
						
						if (item.boundingBox) {
							
							item.boundingBox.remove();
							item.boundingBox = null;
						}
					};
					
					
					/**
					 * Smart guides
					 */
					 
					var updateSmartGuides = function (item) {
						
						var snapAdjustment;
						
						if (!item.smartGuides || !item.smartGuides.length) {
							
							snapAdjustment = addSmartGuides(item);
						}
						
						else if (item.smartGuides.length) {
							
							removeSmartGuides(item);
							snapAdjustment = addSmartGuides(item);
						}
						
						return snapAdjustment;
					};
					
					var addSmartGuides = function (item) {
						
						var snaps = [];
						var snapAdjustment = new paper.Point();
						
						item.smartGuides = [];
						
						var snapPoints = item.getSnapPoints();
						
						// TODO: Whittle down to elements in the nearby area
						
						// Work through each element
						angular.forEach(layerDrawing.children, function (relation) {
							
							// Don't compare target element to itself
							if (relation == item) {
								
								return;
							}
							
							var relationSnapPoints = relation.getSnapPoints();
							
							// Look for alignment in snap points
							angular.forEach(snapPoints, function (snapPoint) {
							
								angular.forEach(relationSnapPoints, function (relationSnapPoint) {
								
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
											axis: axis
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
						
						angular.forEach(snaps, function (snap) {
							
							// Draw a guide from the adjusted point through the 
							// relation snap point to the extent of the window
							var from, to;
							if (snap.axis == 'x') {
								
								from = new paper.Point(snap.relation.x, view.bounds.top);
								to = new paper.Point(snap.relation.x, view.bounds.bottom);
							}
							
							else {
								
								from = new paper.Point(view.bounds.left, snap.relation.y);
								to = new paper.Point(view.bounds.right, snap.relation.y);
							}
							
							layerGuides.activate();
							
							var guide = new paper.Path.Line(from, to);
							guide.strokeColor = 'magenta';
							guide.strokeWidth = 1;
							item.smartGuides.push(guide);
							
							layerDrawing.activate();
						});
						
						// Return the required adjustment on the item
						return snapAdjustment;
					};
					
					var removeSmartGuides = function (item) {
						
						if (item.smartGuides) {
							
							angular.forEach(item.smartGuides, function (guide) {
								
								guide.remove();
							});
							
							item.smartGuides = [];
						}
					};
					
					
					/**
					 * Grid
					 */
					 
					var updateGrid = function () {
					
							var gridMajorSize = 100,
								gridMinorSize = 20,
								gridMajorColor = 'rgba(0,0,0,0.07)',
								gridMinorColor = 'rgba(0,0,0,0.03)';
					
							layerGrid.activate();
							
							// Establish an origin and line count, 
							// starting just outside the viewport
							var startX = Math.floor(view.bounds.topLeft.x / gridMajorSize) * gridMajorSize,
								endX = Math.ceil(view.bounds.bottomRight.x / gridMajorSize) * gridMajorSize,
								startY = Math.floor(view.bounds.topLeft.y / gridMajorSize) * gridMajorSize,
								endY = Math.ceil(view.bounds.bottomRight.y / gridMajorSize) * gridMajorSize,
								countX = (endX - startX) / gridMinorSize,
								countY = (endY - startY) / gridMinorSize;
								
							// Don't display grid beyond a zoom level
							if (paper.view.zoom < 0.4) {
								
								countX = countY = 0;
							}
								
							// Create or remove existing grid lines to match
							// the required number
							while(gridLines.x.length > countX) {
								
								var line = gridLines.x.pop();
								line.remove();
							}
							
							while(gridLines.y.length > countY) {
								
								var line = gridLines.y.pop();
								line.remove();
							}
							
							while(gridLines.x.length < countX) {
								
								var line = new paper.Path.Line(paper.Point(0, 0), paper.Point(0, 0));
								gridLines.x.push(line);
							}
							
							while(gridLines.y.length < countY) {
								
								var line = new paper.Path.Line(paper.Point(0, 0), paper.Point(0, 0));
								line.strokeWidth = 1;
								gridLines.y.push(line);
							}
							
							// Position the grid lines
							for (var i = 0; i < countY; i++) {
								
								var y = i*gridMinorSize;
								
								var from = new paper.Point(view.bounds.left, startY + y);
								var to = new paper.Point(view.bounds.right, startY + y);
								
								var line = gridLines.y[i];
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
								
								var from = new paper.Point(startX + x, view.bounds.top);
								var to = new paper.Point(startX + x, view.bounds.bottom);
								
								var line = gridLines.x[i];
								line.segments[0].point = from;
								line.segments[1].point = to;
								
								if (x % gridMajorSize == 0) {
								
									line.strokeColor = gridMajorColor;	
								} else {
									
									line.strokeColor = gridMinorColor;
								}
							}
							
							layerDrawing.activate();
					};
					
					
					/**
					 * Init
					 */
					 
					function initLayers() {
						
						layerGrid = new paper.Layer();
						layerDrawing = new paper.Layer();
					 	layerAnnotations = new paper.Layer();
					 	layerSelections = new paper.Layer();
						layerGuides = new paper.Layer();
						
						layerDrawing.activate();
					};

					function initPaper() {
						
						paper.install($window);
						paper.setup(element[0]);
						paper.view.onFrame = function () {};

						var tool = new Tool();
						tool.onMouseDown = mouseDown;
						tool.onMouseUp = mouseUp;
						tool.onMouseMove = mouseMove;
						tool.onMouseDrag = mouseDrag;
						tool.onKeyDown = keyDown;
						
						$(element).mousewheel(mouseWheel);
					};
					
					function initPrototypes() {
						
						paper.Item.prototype._collaborator;
						
						Object.defineProperty(paper.Item.prototype, 'collaborator', {
							get: function () { return this._collaborator; },
							set: function (value) { this._collaborator = value; }
						});
						
						paper.Item.prototype.setComponentColor = function (color) {
							
							var item = this;
							
							// Set on the item
							(function loop(item) {
								
								// A group with children
								if (item.className == 'Group') {
									
									angular.forEach(item.children, function (child) {
										
										loop(child);							
									});
								}
									
								// A leaf item
								else {
								
									if (item.className == 'PointText') {
								
										item.fillColor = color;	
									}
									
									else if (item.strokeWidth) {
									
										item.strokeColor = color;
									}
									
									if (
										item.fillColor && 							// Has fill
										item.fillColor.alpha &&					// Not transparent
										item.fillColor.lightness != 1		// Not white
									) {
										
										item.fillColor = color;
									}	
								}
							})(item);
						};
						
						paper.Item.prototype.getSnapPoints = function () {
						
							var snapPoints = [];
							
							if (!this.definition || !this.definition.snapPoints) {
								
								return [];
							}
							
							var that = this;
							angular.forEach(this.definition.snapPoints, function (snapPoint) {
								
								snapPoints.push(that.position.add(snapPoint));
							});
							
							return snapPoints;
						};
					};
	
					initPaper();
					initLayers();
					initPrototypes();
					updateGrid();
				}
			};
		}]);