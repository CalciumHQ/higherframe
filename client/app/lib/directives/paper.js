
angular
	.module('siteApp')
	.directive('wireframe', ['$window', function ($window) {
	
			return {
				restrict: 'A',
				link: function postLink(scope, element, attrs) {
	
					var path;
					var drag = false;

					function getOffset(evt) {

					  var el = evt.target,
					      x = 0,
					      y = 0;

					  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
					    x += el.offsetLeft - el.scrollLeft;
					    y += el.offsetTop - el.scrollTop;
					    el = el.offsetParent;
					  }

					  x = evt.clientX - x;
					  y = evt.clientY - y;

					  return { x: x, y: y };
					};
	
					function mouseUp(event) {
	
						// Clear Mouse Drag Flag
						drag = false;
					}
	
					function mouseDrag(event) {
	
						if (drag) {
	
							var offset = getOffset(event);
							path.add(new paper.Point(offset.x, offset.y));
							path.smooth();
						}
					}
	
					function mouseDown(event) {
	
						// Set flag to detect mouse drag
						drag = true;
						path = new paper.Path();
						path.strokeColor = 'black';
						var offset = getOffset(event);
						path.add(new paper.Point(offset.x, offset.y));
					}
	
					function initPaper() {
						
						paper.install($window);
						paper.setup(element[0]);
					}
	
					element
						.on('mousedown', mouseDown)
						.on('mouseup', mouseUp)
						.on('mousemove', mouseDrag);
	
					initPaper();
				}
			};
		}]);