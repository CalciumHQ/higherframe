
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
					var selectedItem;
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
	
						selectedSegment = null;
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
						else if (selectedSegment) {

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
						else if (selectedItem) {

							selectedItem.position = selectedItem.position.add(event.delta);
						}
					};
	
					function mouseDown(event) {

						project.activeLayer.selected = false;
						selectedItem = null;
						
						lastMousePosition = new paper.Point(
							event.event.screenX,
							event.event.screenY
						);
						
						var hitResult = project.hitTest(event.point, hitOptions);

						if (hitResult) {
							
							var item = hitResult.item;
							
							// Find the top-level group
							while (item.parent && item.parent.className == 'Group'
							) {
							
								item = item.parent;
							}

							if (hitResult.type == 'segment') {

								selectedSegment = hitResult.segment;

								item.selected = true;
								selectedItem = item;
							}

							else if (hitResult.type == 'fill' || hitResult.type == 'stroke') {

								item.selected = true;
								selectedItem = item;
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
							
								if (selectedItem) {
									
									selectedItem.remove();
									selectedItem = null;
									event.event.preventDefault();
								}
									
								break;
							
							// Move forward on the ']' key
							case ']':
							
								if (selectedItem) {
									
									moveForward(selectedItem);
								}
								
								break;
								
							// Move to front on the 'shift+]' key
							case '}':
							
								if (selectedItem) {
									
									moveToFront(selectedItem);
								}
								
								break;
								
							// Move backward on the '[' key
							case '[':
							
								if (selectedItem) {
									
									moveBackward(selectedItem);
								}
								
								break;
								
							// Move to back on the 'shift+[' key
							case '{':
							
								if (selectedItem) {
									
									moveToBack(selectedItem);	
								}
								
								break;
						}
							
					};
					
					
					/**
					 * Data methods
					 */
					 
					function moveForward(item) {
						
						if (!item) {
							
							return;
						}
						
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
					};
					
					function moveToFront(item) {
						
						if (!item) {
							
							return;
						}
						
						var siblings = item.parent.children;
						var index = siblings.indexOf(item);
						
						// Remove from stack
						siblings.splice(index, 1);
						
						// Push element onto end of stack
						siblings.push(item);
						
						// Redraw
						paper.view.draw();
					};
					
					function moveBackward(item) {
						
						if (!item) {
							
							return;
						}
						
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
					};
					
					function moveToBack(item) {
						
						if (!item) {
							
							return;
						}
						
						var siblings = item.parent.children;
						var index = siblings.indexOf(item);
						
						// Remove from stack
						siblings.splice(index, 1);
						
						// Push element onto start of stack 
						siblings.unshift(item);
						
						// Redraw
						paper.view.draw();
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