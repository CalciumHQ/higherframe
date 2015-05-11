'use strict';

angular
	.module('siteApp')
	.factory('ComponentFactory', [function () {
		
		var components = [];	// component definitions
		
		
		/*
	     * Component definitions
	     */
		
		// Rectangle component
		components.rectangle = {
			id: 'rectangle',
			name: 'Rectangle',
			tags: [
		      'shape',
		      'basic'
		    ],
			thumbnail: '/assets/images/components/rectangle-thumbnail@2x.png',
			resizable: true,
			new: function () {
				
				var rectangle = new paper.Rectangle(new Point(100, 200), new Point(200, 300));
				var path = new paper.Path.Rectangle(rectangle);
				path.strokeColor = '#888';
				path.fillColor = 'white';
				
				return path;
			}
		};
	     
	    // Circle component
	    components.circle = {
			id: 'circle',
			name: 'Circle',
			tags: [
		      'shape',
		      'basic'
		    ],
			thumbnail: '/assets/images/components/circle-thumbnail@2x.png',
			resizable: true,
			new: function (options) {
				
				var path = new paper.Path.Circle(options.center, options.radius);
				path.strokeColor = '#888';
				path.fillColor = 'white';
				
				return path;
			}	
		};
	
	    // Triangle component
		components.triangle = {
			id: 'triangle',
			name: 'Triangle',
			tags: [
		      'shape',
		      'basic'
		    ],
			thumbnail: '/assets/images/components/triangle-thumbnail@2x.png',
			resizable: true,
			new: function (options) {
		
		      var center = new paper.Point(100, 200);
		      var path = new paper.Path.RegularPolygon(center, 3, 50);
		      path.strokeColor = '#888';
		      path.fillColor = 'white';
		
		      return path;
		    }		
		};
	    
	    // iPhone component
		components.iphone = {
			id: 'iphone',
			name: 'iPhone',
			tags: [
		      'container',
		      'apple',
		      'phone'
		    ],
			thumbnail: '/assets/images/components/iphone-thumbnail@2x.png',
			resizable: false,
			new: function (options) {
		
		      var WIDTH = 232;
		      var HEIGHT = 464;
		      
		      var topLeft = new paper.Point(options.center.x - WIDTH/2, options.center.y - HEIGHT/2);
		      var bottomRight = new paper.Point(options.center.x + WIDTH/2, options.center.y + HEIGHT/2);
		      var bounds = new paper.Rectangle(topLeft, bottomRight);
		      
		      // Draw the outer frame
		      var outer = new paper.Path.Rectangle(bounds, 20);
		      outer.strokeColor = '#888';
		      outer.fillColor = 'white';
		      
		      // Draw the screen
		      var screenRectangle = new paper.Rectangle(
		        new paper.Point(bounds.left + 6, bounds.top + 48),
		        new paper.Point(bounds.right - 6, bounds.bottom - 70)
		      );
		      var screen = new paper.Path.Rectangle(screenRectangle, 2);
		      screen.strokeColor = '#888';
		      
		      // Draw the button
		      var buttonCenter = new paper.Point(options.center.x, bounds.bottom - 35);
		      var button = new paper.Path.Circle(buttonCenter, 24);
		      button.strokeColor = '#888';
		      
		      // Draw the speaker
		      var speakerRectangle = new paper.Rectangle(
		        new paper.Point(options.center.x - 23, bounds.top + 27),
		        new paper.Point(options.center.x + 23, bounds.top + 33)
		      );
		      var speaker = new paper.Path.Rectangle(speakerRectangle, 3);
		      speaker.strokeColor = '#888';
		      
		      // Draw the camera
		      var cameraCenter = new paper.Point(options.center.x, bounds.top + 18);
		      var camera = new paper.Path.Circle(cameraCenter, 4);
		      camera.strokeColor = '#888';
		      
		      // Group the parts and flatten into a symbol
		      var group = new paper.Group([
		        outer,
		        screen,
		        button,
		        camera,
		        speaker
		      ]);
		      
		      return group;
		    }	
		};
		
		// iPhone titlebar component
		components.iphoneTitlebar = {
			id: 'iphoneTitlebar',
			name: 'iPhone titlebar',
			tags: [
		      'apple',
		      'phone'
		    ],
			thumbnail: '/assets/images/components/iphone-thumbnail@2x.png',
			resizable: false,
			new: function (options) {
		
		      var WIDTH = 219;
		      var HEIGHT = 14;
		      
		      var topLeft = new paper.Point(options.center.x - WIDTH/2, options.center.y - HEIGHT/2);
		      var bottomRight = new paper.Point(options.center.x + WIDTH/2, options.center.y + HEIGHT/2);
		      var bounds = new paper.Rectangle(topLeft, bottomRight);
		      
		      // Draw the bar
		      var bar = new paper.Path.Rectangle(bounds);
		      bar.strokeWidth = 0;
			  bar.fillColor = '#DDDDDD';
			  
			  // Draw the mobile area
			  var c1 = paper.Path.Circle(new paper.Point(topLeft.x + 6, topLeft.y + HEIGHT/2), 2);
			  c1.strokeWidth = 0;
			  c1.fillColor = '#AAAAAA';
			  
			  var c2 = paper.Path.Circle(new paper.Point(topLeft.x + 11, topLeft.y + HEIGHT/2), 2);
			  c2.strokeWidth = 0;
			  c2.fillColor = '#AAAAAA';
			  
			  var c3 = paper.Path.Circle(new paper.Point(topLeft.x + 16, topLeft.y + HEIGHT/2), 2);
			  c3.strokeWidth = 0;
			  c3.fillColor = '#AAAAAA';
			  
			  var c4 = paper.Path.Circle(new paper.Point(topLeft.x + 21, topLeft.y + HEIGHT/2), 2);
			  c4.strokeWidth = 0;
			  c4.fillColor = '#AAAAAA';
			  
			  var c5 = paper.Path.Circle(new paper.Point(topLeft.x + 26, topLeft.y + HEIGHT/2), 2);
			  c5.strokeWidth = 0;
			  c5.fillColor = '#AAAAAA';
			  
			  var carrier = new paper.PointText({
				  point: new paper.Point(topLeft.x + 32, topLeft.y + HEIGHT/2 + 3),
				  content: 'Carrier',
				  fillColor: '#AAAAAA',
				  fontSize: 9
			  });
			   
			  var mobile = new paper.Group([
				  c1,
				  c2,
				  c3,
				  c4,
				  c5,
				  carrier
			  ]);
			  
			  // Draw the indicators
			  var batteryOuterRect = new paper.Rectangle(
				  new paper.Point(bottomRight.x - 20, bottomRight.y - 4),
				  new paper.Point(bottomRight.x - 5, bottomRight.y - HEIGHT + 4)
			  );
			  
			  var batteryOuter = new paper.Path.Rectangle(batteryOuterRect);
			  batteryOuter.strokeWidth = 1;
			  batteryOuter.strokeColor = '#AAAAAA';
			  
			  var batteryInnerRect = new paper.Rectangle(
				  new paper.Point(bottomRight.x - 19, bottomRight.y - 5),
				  new paper.Point(bottomRight.x - 6, bottomRight.y - HEIGHT + 5)
			  );
			  
			  var batteryInner = new paper.Path.Rectangle(batteryInnerRect);
			  batteryInner.strokeWidth = 0;
			  batteryInner.fillColor = '#AAAAAA'; 
			  
			  var batteryKnobRect = new paper.Rectangle(
				new paper.Point(bottomRight.x - 5, bottomRight.y - 8),
				new paper.Point(bottomRight.x - 3, bottomRight.y - HEIGHT + 8)  
			  );
			  
			  var batteryKnob = new paper.Path.Rectangle(batteryKnobRect);
			  batteryKnob.strokeWidth = 0;
			  batteryKnob.fillColor = '#AAAAAA';
			  
			  var indicators = new paper.Group([
				  batteryOuter,
				  batteryInner,
				  batteryKnob
			  ]);
			  
			  var time = new paper.PointText({
				  point: new paper.Point(topLeft.x + WIDTH/2 - 16, topLeft.y + HEIGHT/2 + 3),
				  content: '7:54 am',
				  fillColor: '#AAAAAA',
				  fontSize: 9,
				  fontWeight: 'bold'
			  });
		      
		      // Group the parts and flatten into a symbol
		      var group = new paper.Group([
		        bar,
				mobile,
				indicators,
				time
		      ]);
		      
		      return group;
		    }	
		};
		
		
		/*
		 * Component factory
		 */
		return {
			create: function (name, options) {
				
				if (!options) {
					
					options = {};
				}
				
				// Attempt to find a component definition with 
				// this name
				var component = components[name];
				
				if (!component) {
					
					throw 'No component with name "' + name + '".';
				}
				
				// Create an instance
				if (!options.center) {
					
					throw 'ComponentFactory requires a center option for component name "' + name + '".';
				}
				
				var instance = component.new(options);
				
				// Attach metadata and return
				instance.component = component;
				return instance;
			},
			components: components
		};
	}]);