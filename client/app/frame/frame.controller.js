'use strict';

angular
  .module('siteApp')
  .controller('FrameCtrl', function (frame, $scope, $window, $http, $filter, $stateParams, $state, $timeout, socket, localStorageService, ComponentFactory, Session, Auth) {

		/**
		 * Constants
		 */

		var STORAGE_LEFTSIDEBAR_OPEN_KEY = 'frame.leftSidebar.open';

    var ZOOM_LEVELS = [0.1, 0.15, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0];


    /*
     * Controller variables
     */

		$scope.leftSidebarOpen = localStorageService.get(STORAGE_LEFTSIDEBAR_OPEN_KEY);
    $scope.quickAdd = {
      open: false,
      focus: false,
      query: '',
      results: [],
      index: 0
    };
		$scope.currentComponent;

    var components = [];
		$scope.collaborators = frame.collaborators;

    $scope.wireframe = {
      components: [],
      zoom: 1
    };

    // Temporarily stores components
    var clipboard = [];

		$scope.propertyModels = {};


    /*
     * Initialization
     */

    var registerComponents = function () {

      components.push(ComponentFactory.definitions.rectangle);
      components.push(ComponentFactory.definitions.circle);
      components.push(ComponentFactory.definitions.triangle);
			components.push(ComponentFactory.definitions.label);
      components.push(ComponentFactory.definitions.iphone);
      components.push(ComponentFactory.definitions.iphoneTitlebar);
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

					addComponentsToView({
            id: component.componentId,
            properties: component.properties,
            remoteId: component._id
          });
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

      // When the user navigates away from the frame
			$scope.$on('$destroy', function () {

				socket.emit('collaborator:remove', {
					frame: { _id: $stateParams.id },
					user: Auth.getCurrentUser()
				});
			});

      // When the user closes the window/navigates
      $window.addEventListener('beforeunload', function (e) {

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

				if (user && !user.color) {

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
          addComponentsToView({
            id: component.componentId,
            properties: component.properties,
            remoteId: component._id
          }, { select: false });
        });
      }, 200);
    };

    var serialize = function () {

      var document = {
				view: {},
        components: []
      };
    };

    var save = function () {

      $http.get('/api/frames/' + frame._id + '/export?type=png');
    };


		/*
		 * Data methods
		 */

		var saveComponents = function (components) {

      if (!angular.isArray(components)) {

          components = [components];
      }

      if (!components.length) {

        return;
      }

      // Save components and set remoteId when saved
      angular.forEach(components, function (component) {

        var serialized = {
  				lastModifiedBy: Session.getSessionId(),
          componentId: component.definition.id,
          properties: component.properties
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
      });
		};

		var deleteComponent = function (component) {

			if (component.remoteId) {

				$http
	        .delete('/api/frames/' + $stateParams.id + '/components/' + component.remoteId)
	        .success(function (data) {

	        });
			}
		};


    /*
     * View methods
     */

		var toggleSidebar = function () {

			$scope.leftSidebarOpen = !$scope.leftSidebarOpen;
			localStorageService.set(STORAGE_LEFTSIDEBAR_OPEN_KEY, $scope.leftSidebarOpen);
		};

    var toggleQuickAdd = function () {

      $scope.quickAdd.query = '';
      $scope.quickAdd.open = !$scope.quickAdd.open;

      if ($scope.quickAdd.open) {

        $timeout(function () { $scope.quickAdd.focus = true; });
      }
    };

    var addComponentsToView = function (components, options) {

      if (!angular.isArray(components)) {

        components = [components];
      }

      if (!components.length) {

        return;
      }

      // Create the components in the view
      var instances = [];
      angular.forEach(components, function (component) {

          instances.push(ComponentFactory.create(component.id, component.properties, component.remoteId));
      });

      // Tell the view new components have been added
      $scope.$broadcast('component:added', {
        components: instances,
        options: options
      });

			return instances;
    };

		var updateUiWithComponent = function (component) {

			$scope.propertyModels = {};

			// Populate the property models if there is a
			// component definition set
			/*if (component && component.definition) {

				angular.forEach(component.definition.properties, function (property, name) {

					$scope.propertyModels[name] = component.properties[name];
				});
			}*/

			$scope.currentComponent = component;
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

          // Merge the changes into the view component object
          angular.extend(item.properties, component.properties);
					item.position = [component.properties.x, component.properties.y];

          // Inform the view
    			$scope.$broadcast('component:propertyChange', {
    				component: item
    			});
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

				component.properties.x = component.position.x;
				component.properties.y = component.position.y;
			});

      saveComponents(components);
    });

		$scope.$on('componentsIndexModified', function (e, components) {

			saveComponents(components);
    });

		$scope.$on('componentsDeleted', function (e, components) {

			angular.forEach(components, function (component) {

				updateUiWithComponent();
				deleteComponent(component);
			});
    });

		$scope.$on('componentsSelected', function (e, components) {

			angular.forEach(components, function (component) {

				// Update the UI to match selection
				updateUiWithComponent(component);

				socket.emit('component:select', {
					component: { _id: component.remoteId },
					user: { _id: Auth.getCurrentUser()._id }
				});
			});
    });

		$scope.$on('componentsDeselected', function (e, components) {

			angular.forEach(components, function (component) {

				// Update the UI to match selection
				updateUiWithComponent();

				socket.emit('component:deselect', {
					component: { _id: component.remoteId },
					user: { _id: Auth.getCurrentUser()._id }
				});
			});
    });

    $scope.$on('component:copied', function (e, components) {

      if (!angular.isArray(components)) {

        components = [components];
      }

      if (!components.length) {

        return;
      }

      // Reset the clipboard
      clipboard = [];

      // Copy representations of the components
      angular.forEach(components, function (component) {

        clipboard.push({
          type: 'component',
          id: component.definition.id,
          properties: angular.copy(component.properties)
        });
      });
    });

    $scope.$on('component:pasted', function (e) {

      // Copy representations of the components
      angular.forEach(clipboard, function (entry) {

        entry.properties.x += 50;
        entry.properties.y += 50;
      });

      var instances = addComponentsToView(clipboard);
      saveComponents(instances);
    });


    /*
     * Event handlers
     */

    // Action bar
    $scope.onActionbarCloseClick = function () {

 			$state.go('frames');
 		};

		$scope.onActionbarToggleSidebarClick = function () {

			toggleSidebar();
		};

    $scope.onActionbarQuickAddClick = function () {

 			toggleQuickAdd();
 		};

    // When the quick add input value is changed
    $scope.$watch('quickAdd.query', function (query) {

      $scope.quickAdd.results = $filter('filter')(components, query);
      $scope.quickAdd.index = 0;
    });

    // When a key is pressed in the quick add input
    $scope.onActionbarQuickAddKeyDown = function (event) {

      switch (event.keyCode) {

        // If the enter key is pressed, add the highlighted component
        case 13:
          var component = $scope.quickAdd.results[$scope.quickAdd.index];
          if (component) {

            $scope.onActionbarQuickAddComponentClick(component);
          }

          break;
      }
    };

    // When a component in the quick add pane is clicked
    $scope.onActionbarQuickAddComponentClick = function (definition) {

      // Center new component in view
			var options = {
        x: paper.view.bounds.x + (paper.view.bounds.width/2),
				y: paper.view.bounds.y + (paper.view.bounds.height/2),
        radius: 100
      };

      // Create the instances and save to db
      var instances = addComponentsToView({
        id: definition.id,
        properties: options
      });
			saveComponents(instances);

      // Hide the quick add
      toggleQuickAdd();
    };

		$scope.onComponentPropertyChange = function (key, value, component) {

			// Inform the view
			$scope.$broadcast('component:propertyChange', {
				component: component,
				key: key,
				value: value
			});

      // Save the component
      saveComponents(component);
		};

    if (!window.tool) {

        window.tool = new paper.Tool();
    }

    tool.onKeyDown = function (event) {

      // Special cases
      // Using the command/control modifier outputs special characters for the
      // event.key parameter which could be OS-specific. We will use the raw
      // JS event keyCode instead.
      if (event.modifiers.command || event.modifiers.control) {

        switch (event.event.keyCode) {

          case 187:   // equals (zoom in)
            var zoomIndex = ZOOM_LEVELS.indexOf($scope.wireframe.zoom);
            $scope.wireframe.zoom = ZOOM_LEVELS[zoomIndex < (ZOOM_LEVELS.length - 1) ? zoomIndex + 1 : zoomIndex];

            event.event.preventDefault();
            $scope.$broadcast('view:zoom', $scope.wireframe.zoom);
            break;

          case 189:   // dash (zoom out)
            var zoomIndex = ZOOM_LEVELS.indexOf($scope.wireframe.zoom);
            $scope.wireframe.zoom = ZOOM_LEVELS[zoomIndex > 0 ? zoomIndex - 1 : zoomIndex];

            event.event.preventDefault();
            $scope.$broadcast('view:zoom', $scope.wireframe.zoom);
            break;
        }
      }

      // Standard cases
      switch(event.key) {

        case 'backspace':
          // If in an input, allow event to continue
          if (event.event.target.tagName == 'INPUT') {}

          // Otherwise cancel and broadcast to wireframe
          else {

            event.event.preventDefault();
            event.event.stopPropagation();
            $scope.$broadcast('event:keydown', event);
          }

          break;

        case 'r':

          if (event.modifiers.command || event.modifiers.control) {

            event.event.preventDefault();
            event.event.stopPropagation();

            $scope.$apply(function() {

              toggleQuickAdd();
            });
          }

          break;

        case 's':
          if (event.modifiers.command || event.modifiers.control) {

            event.event.preventDefault();
            event.event.stopPropagation();
            save();
          }

          break;

        default:
          $scope.$broadcast('event:keydown', event);
      }
    };

    (function init() {

      registerComponents();
			registerSockets();
			registerUser();

      // Deserialize the loaded frame
      deserialize(frame);
    })();
  });
