'use strict';

angular
  .module('siteApp')
  .controller('FrameCtrl', function (frame, $scope, $http, $filter, $stateParams, socket, localStorageService, ComponentFactory, Session, Auth) {

		/**
		 * Constants
		 */
		 
		var STORAGE_LEFTSIDEBAR_OPEN_KEY = 'frame.leftSidebar.open';


    /*
     * Controller variables
     */
     
		$scope.leftSidebarOpen = localStorageService.get(STORAGE_LEFTSIDEBAR_OPEN_KEY);
    $scope.components = [];
		$scope.collaborators = frame.collaborators;

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
			
			// Document updating
			socket.syncUpdates('collaborator', $scope.collaborators);
			
			// Components updating
			socket.syncUpdates('component', $scope.wireframe.components, function (event, component, array) {
				
				// If the event was triggered by this session
				// don't update
				if (component.lastModifiedBy == Session.getSessionId()) {
					
					return;
				}
				
				if (event == 'created') {
					
					addComponentToView(component.componentId, component.properties, component._id);
				}
				
				else if (event == 'updated') {
					
					updateComponentInView(component, component._id);
				}
				
				else if (event == 'deleted') {
					
					removeComponentFromView(component);
				}
			});
			
			$scope.$on('$destroy', function () {
				
				socket.unsyncUpdates('component');
			});
		};
		
		var registerUser = function () {
			
			// Broadcast the connected user
			socket.emit('collaborator:save', { 
				frame: { _id: $stateParams.id },
				user: Auth.getCurrentUser() 
			});
			
			$scope.$on('$destroy', function () {
				
				socket.emit('collaborator:remove', {
					frame: { _id: $stateParams.id },
					user: Auth.getCurrentUser()
				});
			});
		};
		
		$scope.$watchCollection('collaborators', function () {
			
			// Don't include the current user
			var user = _.findWhere($scope.collaborators, { _id: Auth.getCurrentUser()._id });
			if (user) {
			
				$scope.collaborators.splice($scope.collaborators.indexOf(user), 1);
			}
			
			// Assign a colour to each user
			angular.forEach($scope.collaborators, function (user) {
				
				if (!user.color) {
					
					user.color = "#" + Math.random().toString(16).slice(2, 8);
				}
			});
		});


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
		 
		var toggleSidebar = function () {
			
			$scope.leftSidebarOpen = !$scope.leftSidebarOpen;
			localStorageService.set(STORAGE_LEFTSIDEBAR_OPEN_KEY, $scope.leftSideabarOpen);
		};
     
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
		 * Server notifications
		 */
		 
		socket.on('component:select', function (data) {
			
			// Find the collaborator who selected
			var user = _.find($scope.collaborators, function (user) {
				
				if (user._id == data.user._id) { return true; }
			});
			
			if (!user) {
				
				return;
			}
			
			$scope.$broadcast('component:collaboratorSelect', {
				component: data.component, 
				user: user
			});
		});
		
		socket.on('component:deselect', function (data) {
			
			// Find the collaborator who deselected
			var user = _.find($scope.collaborators, function (user) {
				
				if (user._id == data.user._id) { return true; }
			});
			
			if (!user) {
				
				return;
			}
			
			$scope.$broadcast('component:collaboratorDeselect', {
				component: data.component, 
				user: user
			});
		});
    
    
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
		
		$scope.$on('componentsSelected', function (e, components) {
    
			angular.forEach(components, function (component) {
				
				socket.emit('component:select', {
					component: { _id: component.remoteId },
					user: { _id: Auth.getCurrentUser()._id }
				});	
			});
    });
		
		$scope.$on('componentsDeselected', function (e, components) {
    
			angular.forEach(components, function (component) {
				
				socket.emit('component:deselect', {
					component: { _id: component.remoteId },
					user: { _id: Auth.getCurrentUser()._id }
				});	
			});
    });


    /*
     * Event handlers
     */
		 
		$scope.onToggleSidebarClick = function () {
			
			toggleSidebar();
		};
     
    $scope.onComponentClick = function (definition) {
			
			var options = {
        position: new paper.Point(400, 400),
        radius: 100
      };

      var instance = addComponentToView(definition.id, options);
			saveComponent(instance);
    };

    (function init() {
    
      registerComponents();
			registerSockets();
			registerUser();
      
      // Deserialize the loaded frame
      deserialize(frame);
    })();
  });
