'use strict';

angular
  .module('siteApp')
  .controller('FrameCtrl', function (frame, $scope, $http, $filter, $stateParams, socket, ComponentFactory, Session) {

    /*
     * Controller variables
     */
     
    $scope.quickAdd = '';
    $scope.components = [];

    $scope.wireframe = {
      components: []
    };


    /*
     * Initialization
     */
     
    var registerComponents = function () {

      $scope.components.push(ComponentFactory.definitions.rectangle);
      $scope.components.push(ComponentFactory.definitions.circle);
      $scope.components.push(ComponentFactory.definitions.triangle);
      $scope.components.push(ComponentFactory.definitions.iphone);
      $scope.components.push(ComponentFactory.definitions.iphoneTitlebar);
    };
		
		var registerSockets = function () {
			
			socket.syncUpdates('component', $scope.wireframe.components, function (event, component, array) {
				
				// If the event was triggered by this session
				// don't update
				if (component.lastModifiedBy == Session.getSessionId()) {
					
					return;
				}
				
				if (event == 'created') {
					
					console.log('created', component);
					addComponentToView(component.componentId, component.properties, component._id);
				}
				
				else if (event == 'updated') {
					
					console.log('updated', component);
					updateComponentInView(component, component._id);
				}
				
				else if (event == 'deleted') {
					
					console.log('deleted', component);
					removeComponentFromView(component);
				}
			});
			
			$scope.$on('$destroy', function () {
				
				socket.unsyncUpdates('component');
			});
		};


    /* 
     * Serialization
     */
     
    var deserialize = function (document) {

      setTimeout(function () {
				
				// Add components in order of z index
				document.components = _.sortBy(
					document.components,
					function (component) { return component.properties.index; });
        
        angular.forEach(document.components, function (component) {
          
					$scope.wireframe.components.push(component);
          addComponentToView(component.componentId, component.properties, component._id);
        });
      }, 200);
    };

    var serialize = function () {

      var document = {
				view: {},
        components: []
      };  
    };
		
		
		/*
		 * Data methods
		 */
		 
		var saveComponent = function (component) {
			
			var serialized = {
				lastModifiedBy: Session.getSessionId(),
        componentId: component.definition.id,
        properties: {
          position: { x: component.position.x, y: component.position.y },
					index: component.index
        }
      };
			
			// Update
			if (component.remoteId) {
				
				$http
	        .patch('/api/components/' + component.remoteId, serialized)
	        .success(function (data) {
	          
	        });
			}
			
			// Create
			else {
				
				$http
	        .post('/api/frames/' + $stateParams.id + '/components', serialized)
	        .success(function (data) {
	          
						component.remoteId = data._id;
	        });
			}
		};
		
		var deleteComponent = function (component) {
			
			if (component.remoteId) {
				
				$http
	        .delete('/api/components/' + component.remoteId)
	        .success(function (data) {
	          
	        });
			}
		};


    /*
     * View methods
     */
     
    var addComponentToView = function (componentId, options, remoteId) {
      
      var instance = ComponentFactory.create(componentId, options, remoteId);
			return instance;
    };
		
		var removeComponentFromView = function (component) {
			
			// Find the component with this remoteId
			angular.forEach(project.activeLayer.children, function (item) {
				
				if (item.remoteId == component._id) {
					
					item.remove();
				}
			});
		};
		
		var updateComponentInView = function (component) {
			
			// Find the component with this remoteId
			angular.forEach(project.activeLayer.children, function (item) {
				
				if (item.remoteId == component._id) {
					
					item.position = component.properties.position;
				}
			});
		};
    
    
    /*
     * Wireframe notifications
     */
    
    $scope.$on('componentsMoved', function (e, components) {
    
			angular.forEach(components, function (component) {
				
				saveComponent(component);	
			});
    });
		
		$scope.$on('componentsIndexModified', function (e, components) {
    
      angular.forEach(components, function (component) {
			
				saveComponent(component);	
			});
    });
		
		$scope.$on('componentsDeleted', function (e, components) {
    
			angular.forEach(components, function (component) {
			
				deleteComponent(component);	
			});
    });


    /*
     * Event handlers
     */
     
    $scope.onComponentClick = function (definition) {
			
			var options = {
        position: new paper.Point(400, 400),
        radius: 100
      };

      var instance = addComponentToView(definition.id, options);
			saveComponent(instance);
    };

    $scope.onQuickAddKeyDown = function (event) {

      if (!$scope.quickAdd) {

        return;
      }

      if (event.keyCode == 13 || event.keyCode == 9) {

        var component = $filter('filter')($scope.components, $scope.quickAdd)[0];

        if (component) {

          addComponentToView(component.id);
					saveComponent(component);
          $scope.quickAdd = '';
        }

        event.preventDefault();
      }
    };

    (function init() {
    
      registerComponents();
			registerSockets();
      
      // Deserialize the loaded frame
      deserialize(frame);
    })();
  });
