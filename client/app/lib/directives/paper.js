
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

						if (selectedItem) {

							selectedItem.position = selectedItem.position.add(event.delta);
						}
					};
	
					function mouseDown(event) {

						project.activeLayer.selected = false;
						
						var hitResult = project.hitTest(event.point, hitOptions);

						if (hitResult) {

							hitResult.item.selected = true;
							selectedItem = hitResult.item;
						}
					};

					function keyDown(event) {

						if (event.key == 'backspace') {

							if (selectedItem) {

								selectedItem.remove();
							}
							
							event.event.preventDefault();
						}
					};
	

					/**
					 * View methods
					 */


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
					};
	
					initPaper();
				}
			};
		}]);