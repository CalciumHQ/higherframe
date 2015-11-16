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
    zoom: 1,
    center: { x: 0, y: 0 }
  };

  components:Array<any> = [];
  selection: Array<Higherframe.Drawing.Component.IComponent> = [];

  activities: Array<Higherframe.Data.IActivity> = [];
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
    private Auth,
    private TrayManager: Higherframe.UI.Tray.Manager,
    private ModalManager: Higherframe.UI.Modal.Manager,
    private Activity: Higherframe.Data.IActivityResource,
    private $mixpanel
  ) {

    var that = this;

    // Fetch the activities for this frame
    this.activities = Activity.query({ frameId: frame._id });

    // Initialise UI
    this.leftSidebarOpen = localStorageService.get(this.STORAGE_LEFTSIDEBAR_OPEN_KEY);
    this.collaborators = frame.collaborators;

    // Create and register trays
    var toolboxTray = new Higherframe.Controllers.Frame.ToolboxTray();
    var propertiesTray = new Higherframe.Controllers.Frame.PropertiesTray();
    var viewTray = new Higherframe.Controllers.Frame.ViewTray();
    TrayManager.registerTray('toolbox', toolboxTray);
    TrayManager.registerTray('properties', propertiesTray);
    TrayManager.registerTray('view', viewTray);
    TrayManager.moveTray(toolboxTray, 'left');
    TrayManager.moveTray(propertiesTray, 'right');
    TrayManager.moveTray(viewTray, 'right');

    $scope.$watchCollection(() => { return this.selection; }, (selection) => {

      // Update the UI to match selection
      this.updateUiWithComponents(selection);
    });

    $scope.$watch(() => { return this.wireframe.zoom; }, (zoom) => {

      $scope.$broadcast('controller:view:zoom', zoom);
    });

    $scope.$watchCollection(() => { return this.collaborators }, (c) => {

  		// Don't include the current user
  		var user = _.findWhere(that.collaborators, { _id: that.Auth.getCurrentUser()._id });
  		if (user) {

  			that.collaborators.splice(that.collaborators.indexOf(user), 1);
  		}

  		// Assign a colour to each user
  		angular.forEach(that.collaborators, function (user: Higherframe.Data.IUser) {

  			if (user && !user.color) {

  				user.color = Higherframe.UI.Colors.Random();
  			}
  		});
  	});

    // When the quick add input value is changed
    $scope.$watch(() => { return this.quickAdd.query; }, (query) => {

      that.quickAdd.results = $filter('filter')(that.components, query);
      that.quickAdd.index = 0;
    });

    // Set up the tool if not already initialised
    if (!paper.tool) {

      paper.tool = new paper.Tool();
    }

    // Set the zoom and pan
    $timeout(() => {

      this.setCenter(this.localStorageService.get(`frame.${ this.frame._id }.view.center`));
      this.setZoom(this.localStorageService.get(`frame.${ this.frame._id }.view.zoom`));
    });


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
     * Tray notifications
     */

    $scope.$on('tray:component:added', (e, componentId) => {

      // Center new component in view
      var properties = {
        x: paper.view.bounds.x + (paper.view.bounds.width/2),
        y: paper.view.bounds.y + (paper.view.bounds.height/2),
        index: paper.project.activeLayer.children.length
      };

      // Create the new model
      var component = new Higherframe.Data.Component(componentId, properties);

      // Create the instances and save to db
      var instances = this.addComponentsToView(component, null);
      this.saveComponents(instances);
    });


    /*
     * Wireframe notifications
     */

    $scope.$on('componentsMoved', function (e, components) {

  		angular.forEach(components, function (component) {

  			component.updateModel();
  		});

      that.saveComponents(components);
    });

  	$scope.$on('componentsIndexModified', function (e, components) {

  		that.saveComponents(components);
    });

  	$scope.$on('componentsDeleted', (e, components) => {

  		components.forEach((component) => {

  			this.deleteComponent(component);
  		});

      // Update selection
      this.selection = this.selection.filter((c) => {

        return components.indexOf(c) < 0;
      });
    });

  	$scope.$on('componentsSelected', (e, components) => {

  		angular.forEach(components, (component) => {

  			socket.emit('component:select', {
  				component: { _id: component.model._id },
  				user: { _id: Auth.getCurrentUser()._id }
  			});
  		});

      // Update selection
      this.selection = this.selection.concat(components);
    });

  	$scope.$on('componentsDeselected', (e, components) => {

  		angular.forEach(components, (component) => {

  			socket.emit('component:deselect', {
  				component: { _id: component.model._id },
  				user: { _id: Auth.getCurrentUser()._id }
  			});
  		});

      // Update selection
      this.selection = this.selection.filter((c) => {

        return components.indexOf(c) < 0;
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

    $scope.$on('view:panned', (event, center) => {

      this.localStorageService.set(`frame.${ this.frame._id }.view.center`, { x: center.x, y: center.y });
    });

    $scope.$on('view:zoomed', (event, zoom) => {

      this.localStorageService.set(`frame.${ this.frame._id }.view.zoom`, zoom);
    });

		this.registerSockets();
		this.registerUser();
    this.initializeTool();

    // Deserialize the loaded frame
    this.deserialize(frame);
  }


  /*
   * Initialization
   */

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

    // Activity updating
    this.socket.syncUpdates('activity', this.activities);

		this.$scope.$on('$destroy', function () {

      that.socket.unsyncUpdates('collaborator');
			that.socket.unsyncUpdates('component');
      that.socket.unsyncUpdates('activity');
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

            that.$scope.$apply(function () {

              var zoomIndex = that.ZOOM_LEVELS.indexOf(that.wireframe.zoom);
              var zoom = that.ZOOM_LEVELS[zoomIndex < (that.ZOOM_LEVELS.length - 1) ? zoomIndex + 1 : zoomIndex];

              event.event.preventDefault();
              that.setZoom(zoom);
            });

            break;

          case 189:   // dash (zoom out)

            that.$scope.$apply(function () {

              var zoomIndex = that.ZOOM_LEVELS.indexOf(that.wireframe.zoom);
              var zoom = that.ZOOM_LEVELS[zoomIndex > 0 ? zoomIndex - 1 : zoomIndex];

              event.event.preventDefault();
              that.setZoom(zoom);
            });

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

  private save(type?: string) {

    if (!type) {

      type = 'png';
    }

    this.$http.get(`/api/frames/${this.frame._id}/export?type=${type}`);
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

    // Save components and set _id when saved
    angular.forEach(components, function (component: Higherframe.Drawing.Component.IComponent) {

      // We will first serialize the data in the component's model.
      // If an _id key is found on the model, we know this component has already
      // been saved to the database, so we will update.
      // If no _id is found, we know it is a new component and do a post. When
      // the post is completed, we will assign the returned _id to the original
      // component model, since the serialized version is a throwaway copy.
      var serialized = <Higherframe.Data.Component>component.serialize();

      serialized.lastModifiedBy = that.Session.getSessionId();

			// Update
			if (serialized._id) {

				that.$http
	        .patch('/api/components/' + serialized._id, serialized)
	        .success(function (data) {

	        });
			}

			// Create
			else {

				that.$http
	        .post('/api/frames/' + that.$stateParams.id + '/components', serialized)
	        .success(function (data: any) {

						component.model._id = data._id;
	        });
			}
    });
	};

	private deleteComponent(component) {

		if (component.model._id) {

			this.$http
        .delete('/api/frames/' + this.$stateParams.id + '/components/' + component.model._id)
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

	private updateUiWithComponents(components: Array<Higherframe.Drawing.Component.IComponent>) {

    this.$scope.$broadcast('controller:component:selected', components);
	};

	private removeComponentFromView(component) {

		// Find the component with this _id
		angular.forEach(paper.project.activeLayer.children, function (item: Higherframe.Drawing.Component.IComponent) {

			if (item.model._id == component._id) {

				item.remove();
			}
		});
	};

	private updateComponentInView(component) {

		// Find the component with this _id
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

  private setZoom(zoom: number) {

    this.wireframe.zoom = zoom;
    this.$scope.$broadcast('view:zoom', this.wireframe.zoom);
  }

  private setCenter(center: Higherframe.Drawing.IPoint) {

    this.wireframe.center = center;
    this.$scope.$broadcast('view:pan', this.wireframe.center);
  }


  /*
   * Event handlers
   */

  // Action bar
  onActionbarCloseClick() {

    this.$state.go('frames');
  }

  onActionbarSettingsClick() {

    this.$state.go('frameSettings', { id: this.frame._id });
  }

  onActionbarToggleSidebarClick() {

    this.toggleSidebar();
  }

  onActionbarQuickAddClick() {

    this.toggleQuickAdd();
  }

  onActionbarSaveAsPngClick() {

    this.save('png');
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
  }

  onActionbarShareClick() {

    var modal = new Higherframe.Modals.Frame.Share(this.frame, this.Auth, this.$mixpanel);
    this.ModalManager.present(modal);
  }

  onComponentPropertyChange(key, value, component, property) {

    // Parse into the correct data type
    switch (property.type) {

      case Number:
        value = Number(value);
        break;
    }

    component.model.properties[property.model] = value;

    // Validation


    // Set default


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
