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