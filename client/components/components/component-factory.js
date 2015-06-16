'use strict';

angular
	.module('siteApp')
	.factory('ComponentFactory', [function () {
		
		var definitions = [];	// component definitions
		
		
		/*
     * Component definitions
     */
		
		// Rectangle component
		definitions.rectangle = {
			id: 'rectangle',
			name: 'Rectangle',
			tags: [
		      'shape',
		      'basic'
		    ],
			thumbnail: '/assets/images/components/rectangle-thumbnail@2x.png',
			resizable: true,
			create: function (options) {
				
				var rectangle = new paper.Rectangle(new Point(100, 200), new Point(200, 300));
				var path = new paper.Path.Rectangle(rectangle);
				path.strokeColor = '#888';
				path.fillColor = 'white';
				
				return path;
			}
		};
	     
	  // Circle component
	 	definitions.circle = {
			id: 'circle',
			name: 'Circle',
			tags: [
		      'shape',
		      'basic'
		    ],
			thumbnail: '/assets/images/components/circle-thumbnail@2x.png',
			resizable: true,
			create: function (options) {
				
				if (!options.radius) {
					
					options.radius = 100;
				}
				
				var path = new paper.Path.Circle(options.position, options.radius);
				path.strokeColor = '#888';
				path.fillColor = 'white';
				
				return path;
			}
		};
	
	    // Triangle component
		definitions.triangle = {
			id: 'triangle',
			name: 'Triangle',
			tags: [
		      'shape',
		      'basic'
		    ],
			thumbnail: '/assets/images/components/triangle-thumbnail@2x.png',
			resizable: true,
			create: function (options) {
		
		      var path = new paper.Path.RegularPolygon(options.position, 3, 50);
		      path.strokeColor = '#888';
		      path.fillColor = 'white';
		
		      return path;
		    }		
		};
	    
	  // iPhone component
		definitions.iphone = {
			id: 'iphone',
			name: 'iPhone',
			tags: [
		      'container',
		      'apple',
		      'phone'
		    ],
			thumbnail: '/assets/images/components/iphone-thumbnail@2x.png',
			resizable: false,
			properties: {
				index: {
					label: 'Index',
					visible: false
				},
				x: {
					label: 'x',
					visible: true
				},
				y: {
					label: 'y',
					visible: true
				}
			},
			snapPoints: [
				{ x: -116, y: -232 },		// Bounding box
				{ x: 116, y: -232 },
				{ x: 116, y: 232 },
				{ x: -116, y: 232 },
				{ x: -110, y: -184 },		// Screen corners
				{ x: 110, y: -184 },
				{ x: 110, y: 162 },
				{ x: -110, y: 162 },
			],
			create: function (options) {
		
		      // Group the parts as a component
		      var component = new paper.Group([]);
					
					// Set properties on the component
					component.properties = options;
					
					// Perform the initial draw
					this.update(component);
					
					return component;
		    },
				update: function (component) {
					
					var WIDTH = 232;
		      var HEIGHT = 464;
					
					// Remove the old parts
					component.removeChildren();
		      
		      var topLeft = new paper.Point(component.properties.x - WIDTH/2, component.properties.y - HEIGHT/2);
		      var bottomRight = new paper.Point(component.properties.x + WIDTH/2, component.properties.y + HEIGHT/2);
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
		      var buttonposition = new paper.Point(component.properties.x, bounds.bottom - 35);
		      var button = new paper.Path.Circle(buttonposition, 24);
		      button.strokeColor = '#888';
		      
		      // Draw the speaker
		      var speakerRectangle = new paper.Rectangle(
		        new paper.Point(component.properties.x - 23, bounds.top + 27),
		        new paper.Point(component.properties.x + 23, bounds.top + 33)
		      );
		      var speaker = new paper.Path.Rectangle(speakerRectangle, 3);
		      speaker.strokeColor = '#888';
		      
		      // Draw the camera
		      var cameraposition = new paper.Point(component.properties.x, bounds.top + 18);
		      var camera = new paper.Path.Circle(cameraposition, 4);
		      camera.strokeColor = '#888';
		      
		      // Group the parts as a component
		      component.addChild(outer);
		      component.addChild(screen);
		      component.addChild(button);
		      component.addChild(camera);
		      component.addChild(speaker);
					
					// Define the component parts
					component.parts.outer = outer;
					component.parts.screen = screen;
					component.parts.button = button;
					component.parts.camera = camera;
					component.parts.speaker = speaker;
		      
		      return component;
				}
		};
		
		// iPhone titlebar component
		definitions.iphoneTitlebar = {
			id: 'iphoneTitlebar',
			name: 'iPhone titlebar',
			tags: [
	      'apple',
	      'phone'
	    ],
			thumbnail: '/assets/images/components/iphone-thumbnail@2x.png',
			resizable: false,
			snapPoints: [
				{ x: -110, y: -7 },
				{ x: 110, y: -7 },
				{ x: 110, y: 7 },
				{ x: -110, y: 7 }
			],
			create: function (options) {
		
	      var WIDTH = 220;
	      var HEIGHT = 14;
	      
	      var topLeft = new paper.Point(options.position.x - WIDTH/2, options.position.y - HEIGHT/2);
	      var bottomRight = new paper.Point(options.position.x + WIDTH/2, options.position.y + HEIGHT/2);
	      var bounds = new paper.Rectangle(topLeft, bottomRight);
	      
	      // Draw the bar
	      var bar = new paper.Path.Rectangle(bounds);
	      bar.strokeWidth = 0;
		  	bar.fillColor = 'rgba(255,255,255,0)';
			  
			  // Draw the mobile area
			  var c1 = paper.Path.Circle(new paper.Point(topLeft.x + 6, topLeft.y + HEIGHT/2), 2);
			  c1.strokeWidth = 0;
			  c1.fillColor = '#888';
			  
			  var c2 = paper.Path.Circle(new paper.Point(topLeft.x + 11, topLeft.y + HEIGHT/2), 2);
			  c2.strokeWidth = 0;
			  c2.fillColor = '#888';
			  
			  var c3 = paper.Path.Circle(new paper.Point(topLeft.x + 16, topLeft.y + HEIGHT/2), 2);
			  c3.strokeWidth = 0;
			  c3.fillColor = '#888';
			  
			  var c4 = paper.Path.Circle(new paper.Point(topLeft.x + 21, topLeft.y + HEIGHT/2), 2);
			  c4.strokeWidth = 0;
			  c4.fillColor = '#888';
			  
			  var c5 = paper.Path.Circle(new paper.Point(topLeft.x + 26, topLeft.y + HEIGHT/2), 2);
			  c5.strokeWidth = 0;
			  c5.fillColor = '#888';
			  
			  var carrier = new paper.PointText({
				  point: new paper.Point(topLeft.x + 32, topLeft.y + HEIGHT/2 + 3),
				  content: 'Carrier',
				  fillColor: '#888',
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
			  batteryOuter.strokeColor = '#888';
			  
			  var batteryInnerRect = new paper.Rectangle(
				  new paper.Point(bottomRight.x - 19, bottomRight.y - 5),
				  new paper.Point(bottomRight.x - 6, bottomRight.y - HEIGHT + 5)
			  );
			  
			  var batteryInner = new paper.Path.Rectangle(batteryInnerRect);
			  batteryInner.strokeWidth = 0;
			  batteryInner.fillColor = '#888'; 
			  
			  var batteryKnobRect = new paper.Rectangle(
				new paper.Point(bottomRight.x - 5, bottomRight.y - 8),
				new paper.Point(bottomRight.x - 3, bottomRight.y - HEIGHT + 8)  
			  );
			  
			  var batteryKnob = new paper.Path.Rectangle(batteryKnobRect);
			  batteryKnob.strokeWidth = 0;
			  batteryKnob.fillColor = '#888';
			  
			  var indicators = new paper.Group([
				  batteryOuter,
				  batteryInner,
				  batteryKnob
			  ]);
			  
			  var time = new paper.PointText({
				  point: new paper.Point(topLeft.x + WIDTH/2 - 16, topLeft.y + HEIGHT/2 + 3),
				  content: '7:54 am',
				  fillColor: '#888',
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
		 * Methods
		 */
		 
		var _create = function (componentId, options, remoteId) {
			
			if (!options) {
				
				options = {};
			}
			
			var definition = _get(componentId);
			
			// Create an instance
			if (!options.position) {
				
				throw 'ComponentFactory requires a position option for component name "' + component.name + '".';
			}
			
			var instance = definition.create(options);
			
			// Attach metadata and return
			instance.remoteId = remoteId;
			instance.definition = definition;
			return instance;
		};
		
		var _get = function (componentId) {
			
			// Attempt to find a component definition with 
			// this id
			var definition = definitions[componentId];
			
			if (!definition) {
				
				throw 'No component with id "' + componentId + '".';
			}
			
			return definition;	
		};
	
		
		/*
		 * Component factory
		 */
		 
		return {
			create: _create,
			get: _get,
			definitions: definitions
		};
	}]);