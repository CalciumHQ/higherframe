
angular
	.module('siteApp')
	.directive('wireframe', ['$window', function ($window) {
	
			return {
				restrict: 'A',
				scope: {
					data: '='
				},
				link: function postLink(scope, element, attrs) {
	
					var path;
					var drag = false;

					var colors = {
						normal: '#888',
						hover: '#333'
					};

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
	
					/**
					 * Event handlers
					 */

					function mouseUp(event) {
	
						selectedSegments = [];
					};

					function mouseMove(event) {

						if (hoveredItem) {

							hoveredItem.strokeColor = colors.normal;
						}

						var hitResult = project.hitTest(event.point, hitOptions);

						if (hitResult) {

							hitResult.item.strokeColor = colors.hover;
							hoveredItem = hitResult.item;
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
							if (!selectedItem.component.resizable) {
								
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
							
								item.position = item.position.add(event.delta);	
							});
						}
					};
	
					function mouseDown(event) {
						
						lastMousePosition = new paper.Point(
							event.event.screenX,
							event.event.screenY
						);
						
						// Add the new selection
						var hitResult = project.hitTest(event.point, hitOptions);
						
						// If no hit target clear the last selection
						if (!hitResult) {
						
							clearSelection();
						}

						// Add the new selection
						else {
							
							var item = hitResult.item;
							
							// Find the top-level group
							while (item.parent && item.parent.className == 'Group'
							) {
							
								item = item.parent;
							}
							
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
						}
					};
					
					function mouseWheel(event) {
					
						event.preventDefault();
						
						var mousePosition = new paper.Point(event.offsetX, event.offsetY);
						var viewPosition = paper.view.viewToProject(mousePosition);
						changeZoom(event.deltaY, viewPosition);
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
					 * Data methods
					 */
					 
					function clearSelection() {
						
						project.activeLayer.selected = false;
						selectedItems = [];
					};
					
					function selectItems(items) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
					
						angular.forEach(items, function (item) {
							
							if (selectedItems.indexOf(item) === -1) {
								
								item.selected = true;
								selectedItems.push(item);
							}
						});
					};
					
					function removeItems(items) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
						
						while(items.length) {
						
							var item = items[items.length-1];
								
							item.remove();
							
							var index = selectedItems.indexOf(item);
							
							if (index !== -1) {
								
								selectedItems.splice(index, 1);
							}
						}
					};
					 
					function nudge(items, x, y) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
					
						angular.forEach(items, function (item) {
							
							var delta = new paper.Point(x, y);
							item.position = item.position.add(delta);
						});
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
							siblings[index] = siblings[index+1];
							siblings[index+1] = item;
							
							// Redraw
							paper.view.draw();
						});
					};
					
					function moveToFront(items) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
					
						angular.forEach(items, function (item) {
	
							var siblings = item.parent.children;
							var index = siblings.indexOf(item);
							
							// Remove from stack
							siblings.splice(index, 1);
							
							// Push element onto end of stack
							siblings.push(item);
							
							// Redraw
							paper.view.draw();
						});
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
							siblings[index] = siblings[index-1];
							siblings[index-1] = item;
							
							// Redraw
							paper.view.draw();
						});
					};
					
					function moveToBack(items) {
						
						if (!angular.isArray(items)) {
							
							items = [items];
						}
					
						angular.forEach(items, function (item) {
	
							var siblings = item.parent.children;
							var index = siblings.indexOf(item);
							
							// Remove from stack
							siblings.splice(index, 1);
							
							// Push element onto start of stack 
							siblings.unshift(item);
							
							// Redraw
							paper.view.draw();
						});
					};
	

					/**
					 * View methods
					 */

					function changeCenter(deltaX, deltaY) {
					
						paper.view.center = paper.view.center.add(new paper.Point(
							-deltaX / paper.view.zoom, 
							-deltaY / paper.view.zoom
						));
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
					};
					
					/**
					 * Init
					 */

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
	
					initPaper();
				}
			};
		}]);