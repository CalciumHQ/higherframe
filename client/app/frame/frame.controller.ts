/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/paper/paper.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>

class ClipboardItem {
  type: String;
  id: String;
  properties;

  constructor(type: String, id: String, properties: Object) {

    this.type = type;
    this.id = id;
    this.properties = properties;
  }
}


class FrameCtrl {

	/**
	 * Constants
	 */

	private STORAGE_LEFTSIDEBAR_OPEN_KEY: string = 'frame.leftSidebar.open';
  private ZOOM_LEVELS: Array<number> = [0.1, 0.15, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0];


  /**
   * Member variables
   */

  wireframe = {
    components: [],
    zoom: 1
  };

  components:Array<any> = [];
  currentComponent: Higherframe.Drawing.Component.IComponent;

  collaborators: Array<Object> = [];

  // UI variables
  leftSidebarOpen: boolean = false;
  quickAdd = {
    open: false,
    focus: false,
    query: '',
    results: [],
    index: 0
  };

  // UI models
  propertyModels = {};

  // Temporarily stores components
  clipboard:Array<ClipboardItem> = [];


  /**
   * Constructor
   */

  constructor(
    private frame,
    private $scope: ng.IScope,
    private $window: ng.IWindowService,
    private $http: ng.IHttpService,
    private $filter: ng.IFilterService,
    private $stateParams,
    private $state,
    private $timeout: ng.ITimeoutService,
    private socket,
    private localStorageService,
    private Session,
    private Auth
  ) {

    var that = this;

    // Initialise UI
    this.leftSidebarOpen = localStorageService.get(this.STORAGE_LEFTSIDEBAR_OPEN_KEY);
    this.collaborators = frame.collaborators;

    $scope.$watchCollection(function () {

      return that.collaborators
    }, function (c) {

  		// Don't include the current user
  		var user = _.findWhere(that.collaborators, { _id: that.Auth.getCurrentUser()._id });
  		if (user) {

  			that.collaborators.splice(that.collaborators.indexOf(user), 1);
  		}

  		// Assign a colour to each user
  		angular.forEach(that.collaborators, function (user: Higherframe.Data.IUser) {

  			if (user && !user.color) {

  				user.color = "#" + Math.random().toString(16).slice(2, 8);
  			}
  		});
  	});

    // When the quick add input value is changed
    $scope.$watch(function () {

      return that.quickAdd.query;
    }, function (query) {

      that.quickAdd.results = $filter('filter')(that.components, query);
      that.quickAdd.index = 0;
    });

    // Set up the tool if not already initialised
    if (!paper.tool) {

      paper.tool = new paper.Tool();
    }


    /*
  	 * Server notifications
  	 */

  	socket.on('component:select', function (data) {

  		// Find the collaborator who selected
  		var user = _.find(that.collaborators, function (user: Higherframe.Data.IUser) {

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
  		var user = _.find(that.collaborators, function (user: Higherframe.Data.IUser) {

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

  			component.model.properties.x = component.position.x;
  			component.model.properties.y = component.position.y;
  		});

      that.saveComponents(components);
    });

  	$scope.$on('componentsIndexModified', function (e, components) {

  		that.saveComponents(components);
    });

  	$scope.$on('componentsDeleted', function (e, components) {

  		angular.forEach(components, function (component) {

  			that.updateUiWithComponent();
  			that.deleteComponent(component);
  		});
    });

  	$scope.$on('componentsSelected', function (e, components) {

  		angular.forEach(components, function (component) {

  			// Update the UI to match selection
  			that.updateUiWithComponent(component);

  			socket.emit('component:select', {
  				component: { _id: component.model._id },
  				user: { _id: Auth.getCurrentUser()._id }
  			});
  		});
    });

  	$scope.$on('componentsDeselected', function (e, components) {

  		angular.forEach(components, function (component) {

  			// Update the UI to match selection
  			that.updateUiWithComponent();

  			socket.emit('component:deselect', {
  				component: { _id: component.model._id },
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
      that.clipboard = [];

      // Copy representations of the components
      angular.forEach(components, function (component) {

        that.clipboard.push(new ClipboardItem(
          'component',
          component.id,
          angular.copy(component.properties)
        ));
      });
    });

    $scope.$on('component:pasted', function (e) {

      // Copy representations of the components
      angular.forEach(that.clipboard, function (entry: ClipboardItem) {

        entry.properties.x += 50;
        entry.properties.y += 50;
      });

      // var instances = that.addComponentsToView(that.clipboard);
      // that.saveComponents(instances);
    });

    this.registerComponents();
		this.registerSockets();
		this.registerUser();
    this.initializeTool();

    // Deserialize the loaded frame
    this.deserialize(frame);
  }


  /*
   * Initialization
   */

  private registerComponents() {

    // this.components.push(this.ComponentFactory.definitions.rectangle);
    // this.components.push(this.ComponentFactory.definitions.circle);
    // this.components.push(this.ComponentFactory.definitions.triangle);
		// this.components.push(this.ComponentFactory.definitions.label);
    this.components.push({
      id: Higherframe.Drawing.Component.Type[Higherframe.Drawing.Component.Type.IPhone],
      title: Higherframe.Drawing.Component.Library.IPhone.title
    });
    this.components.push({
      id: Higherframe.Drawing.Component.Type[Higherframe.Drawing.Component.Type.IPhoneTitlebar],
      title: Higherframe.Drawing.Component.Library.IPhoneTitlebar.title
    });
  };

	private registerSockets() {

    var that = this;

		// Document updating
		this.socket.syncUpdates('collaborator', this.collaborators);

		// Components updating
		this.socket.syncUpdates('component', this.wireframe.components, function (event, component, array) {

			// If the event was triggered by this session
			// don't update
			if (component.lastModifiedBy == that.Session.getSessionId()) {

				return;
			}

			if (event == 'created') {

				that.addComponentsToView(component, { select: false });
			}

			else if (event == 'updated') {

				that.updateComponentInView(component);
			}

			else if (event == 'deleted') {

				that.removeComponentFromView(component);
			}
		});

		this.$scope.$on('$destroy', function () {

			that.socket.unsyncUpdates('component');
		});
	};

	private registerUser() {

    var that = this;

		// Broadcast the connected user
		this.socket.emit('collaborator:save', {
			frame: { _id: this.$stateParams.id },
			user: this.Auth.getCurrentUser()
		});

    // When the user navigates away from the frame
		this.$scope.$on('$destroy', function () {

			that.socket.emit('collaborator:remove', {
				frame: { _id: that.$stateParams.id },
				user: that.Auth.getCurrentUser()
			});
		});

    // When the user closes the window/navigates
    this.$window.addEventListener('beforeunload', function (e) {

      that.socket.emit('collaborator:remove', {
				frame: { _id: that.$stateParams.id },
				user: that.Auth.getCurrentUser()
			});
    });
	};

  private initializeTool() {

    var that = this;

    paper.tool.onKeyDown = function (event) {

      // Special cases
      // Using the command/control modifier outputs special characters for the
      // event.key parameter which could be OS-specific. We will use the raw
      // JS event keyCode instead.
      if (event.modifiers.command || event.modifiers.control) {

        switch (event.event.keyCode) {

          case 187:   // equals (zoom in)
            var zoomIndex = that.ZOOM_LEVELS.indexOf(that.wireframe.zoom);
            that.wireframe.zoom = that.ZOOM_LEVELS[zoomIndex < (that.ZOOM_LEVELS.length - 1) ? zoomIndex + 1 : zoomIndex];

            event.event.preventDefault();
            that.$scope.$broadcast('view:zoom', that.wireframe.zoom);
            break;

          case 189:   // dash (zoom out)
            var zoomIndex = that.ZOOM_LEVELS.indexOf(that.wireframe.zoom);
            that.wireframe.zoom = that.ZOOM_LEVELS[zoomIndex > 0 ? zoomIndex - 1 : zoomIndex];

            event.event.preventDefault();
            that.$scope.$broadcast('view:zoom', that.wireframe.zoom);
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
            that.$scope.$broadcast('event:keydown', event);
          }

          break;

        case 'r':

          if (event.modifiers.command || event.modifiers.control) {

            event.event.preventDefault();
            event.event.stopPropagation();

            that.$scope.$apply(function() {

              that.toggleQuickAdd();
            });
          }

          break;

        case 's':
          if (event.modifiers.command || event.modifiers.control) {

            event.event.preventDefault();
            event.event.stopPropagation();
            that.save();
          }

          break;

        default:
          that.$scope.$broadcast('event:keydown', event);
      }
    };
  }


  /*
   * Serialization
   */

  private deserialize(document: Higherframe.Data.Document) {

    var that = this;

    setTimeout(function () {

			// Add components in order of z index
			document.components = _.sortBy(
				document.components,
				function (component) {

          return component.properties.index;
        }
      );

      angular.forEach(document.components, function (component) {

				that.wireframe.components.push(component);
        that.addComponentsToView(component, { select: false });
      });

    }, 200);
  };

  private serialize() {

    var document = {
			view: {},
      components: []
    };
  };

  private save() {

    this.$http.get('/api/frames/' + this.frame._id + '/export?type=png');
  };


	/*
	 * Data methods
	 */

	private saveComponents(components: any) {

    var that = this;

    if (!angular.isArray(components)) {

      components = [components];
    }

    if (!components.length) {

      return;
    }

    // Save components and set remoteId when saved
    angular.forEach(components, function (component: Higherframe.Drawing.Component.IComponent) {

      var model = <Higherframe.Data.Component>component.model;
      model.lastModifiedBy = that.Session.getSessionId();

			// Update
			if (model._id) {

				that.$http
	        .patch('/api/components/' + model._id, model)
	        .success(function (data) {

	        });
			}

			// Create
			else {

				that.$http
	        .post('/api/frames/' + that.$stateParams.id + '/components', model)
	        .success(function (data: any) {

						model._id = data._id;
	        });
			}
    });
	};

	private deleteComponent(component) {

		if (component.remoteId) {

			this.$http
        .delete('/api/frames/' + this.$stateParams.id + '/components/' + component.remoteId)
        .success(function (data) {

        });
		}
	};


  /*
   * View methods
   */

	private toggleSidebar() {

		this.leftSidebarOpen = !this.leftSidebarOpen;
		this.localStorageService.set(this.STORAGE_LEFTSIDEBAR_OPEN_KEY, this.leftSidebarOpen);
	};

  private toggleQuickAdd() {

    this.quickAdd.query = '';
    this.quickAdd.open = !this.quickAdd.open;

    if (this.quickAdd.open) {

      var that = this;
      this.$timeout(function () { that.quickAdd.focus = true; });
    }
  };

  private addComponentsToView(components, options?) {

    if (!angular.isArray(components)) {

      components = [components];
    }

    if (!components.length) {

      return;
    }

    // Create the components in the view
    var instances = [];
    angular.forEach(components, function (component) {

      var instance = Higherframe.Drawing.Component.Factory.fromModel(component);

      instances.push(instance);
    });

    // Tell the view new components have been added
    this.$scope.$broadcast('component:added', {
      components: instances,
      options: options
    });

		return instances;
  };

	private updateUiWithComponent(component?: Higherframe.Drawing.Component.IComponent) {

		this.propertyModels = {};

		// Populate the property models if there is a
		// component definition set
		/*if (component && component.definition) {

			angular.forEach(component.definition.properties, function (property, name) {

				$scope.propertyModels[name] = component.properties[name];
			});
		}*/

		this.currentComponent = component;
	};

	private removeComponentFromView(component) {

		// Find the component with this remoteId
		angular.forEach(paper.project.activeLayer.children, function (item: Higherframe.Drawing.Component.IComponent) {

			if (item.model._id == component._id) {

				item.remove();
			}
		});
	};

	private updateComponentInView(component) {

		// Find the component with this remoteId
		angular.forEach(paper.project.activeLayer.children, function (item: Higherframe.Drawing.Component.IComponent) {

			if (item.model._id == component._id) {

        // Merge the changes into the view component object
        angular.extend(item.model.properties, component.properties);
        item.position = new paper.Point(item.model.properties.x, item.model.properties.y);

        // Inform the view
  			this.$scope.$broadcast('component:propertyChange', {
  				component: item
  			});
			}
		});
	};


  /*
   * Event handlers
   */

  // Action bar
  onActionbarCloseClick() {

    this.$state.go('frames');
  }

  onActionbarToggleSidebarClick() {

    this.toggleSidebar();
  }

  onActionbarQuickAddClick() {

    this.toggleQuickAdd();
  }

  // When a key is pressed in the quick add input
  onActionbarQuickAddKeyDown(event) {

    switch (event.keyCode) {

      // If the enter key is pressed, add the highlighted component
      case 13:
        var component = this.quickAdd.results[this.quickAdd.index];
        if (component) {

          this.onActionbarQuickAddComponentClick(component);
        }

        break;
    }
  };

  // When a component in the quick add pane is clicked
  onActionbarQuickAddComponentClick(definition) {

    // Center new component in view
    var properties = {
      x: paper.view.bounds.x + (paper.view.bounds.width/2),
      y: paper.view.bounds.y + (paper.view.bounds.height/2),
      index: paper.project.activeLayer.children.length
    };

    // Create the new model
    var component = new Higherframe.Data.Component(definition.id, properties);

    // Create the instances and save to db
    var instances = this.addComponentsToView(component, null);
    this.saveComponents(instances);

    // Hide the quick add
    this.toggleQuickAdd();
  };

  onComponentPropertyChange(key, value, component) {

    // Inform the view
    this.$scope.$broadcast('component:propertyChange', {
      component: component,
      key: key,
      value: value
    });

    // Save the component
    this.saveComponents(component);
  };
}

angular
  .module('siteApp')
  .controller('FrameCtrl', FrameCtrl);
