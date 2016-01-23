
class FrameCtrl {

	/**
	 * Constants
	 */

	private STORAGE_ACTIVITY_OPEN_KEY: string = 'frame.activity.open';
  private STORAGE_EDIT_MODE_KEY: string = 'frame.edit.mode';
  public ZOOM_LEVELS: Array<number> = [0.15, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0];


  /**
   * Member variables
   */

	Clipboard: Higherframe.Utilities.Clipboard;
	frame;
  view = {
    zoom: 1,
    center: { x: 0, y: 0 }
  };

	artboards:Array<Common.Data.IArtboard> = [];
  components:Array<any> = [];
  selection: Array<Common.Drawing.Component.IComponent> = [];

  activities: Array<Higherframe.Data.IActivity> = [];
	media: Array<Common.Data.IMedia> = [];
  collaborators: Array<Object> = [];

  // UI variables
	activityOpen: boolean = (typeof this.localStorageService.get(this.STORAGE_ACTIVITY_OPEN_KEY) !== 'undefined'
		? this.localStorageService.get(this.STORAGE_ACTIVITY_OPEN_KEY)
		: true);

	editMode: Common.Drawing.EditMode = this.localStorageService.get(this.STORAGE_EDIT_MODE_KEY) || Common.Drawing.EditMode.Draw;
  quickAdd = {
    open: false,
    focus: false,
    query: '',
    results: [],
    index: 0
  };

	toolbarConfig = {
		editMode: {
			options: [
				{
					title: 'Draw',
					description: 'Add components to your wireframe',
					value: Common.Drawing.EditMode.Draw
				},
				{
					title: 'Artboards',
					description: 'Manage your wireframe workspaces',
					value: Common.Drawing.EditMode.Artboards
				},
				{
					title: 'Annotate',
					description: 'Review and discuss your team\'s work',
					value: Common.Drawing.EditMode.Annotate
				}
			]
		}
	}


  /**
   * Constructor
   */

  constructor(
    frame,
    private $scope: ng.IScope,
    private $window: ng.IWindowService,
		private $document: ng.IDocumentService,
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
		private Artboard: Common.Data.IArtboardResource,
    private Activity: Higherframe.Data.IActivityResource,
    Clipboard: Higherframe.Utilities.Clipboard,
		ComponentLibrary: Higherframe.Drawing.Component.Library.IService,
    private $mixpanel
  ) {

    var that = this;

		this.frame = frame;
		this.Clipboard = Clipboard;

    // Fetch the activities for this frame
    this.activities = Activity.query({ frameId: frame._id });

    // Initialise UI
		this.media = frame.media;
    this.collaborators = frame.collaborators;

    $scope.$watchCollection(() => { return this.selection; }, (selection) => {

      // Update the UI to match selection
      this.updateUiWithComponents(selection);
    });

    $scope.$watch(() => { return this.view.zoom; }, (zoom) => {

      $scope.$broadcast('controller:view:zoom', zoom);
    });

		$scope.$watch(() => { return this.activityOpen; }, (open) => this.setActivityOpen.call(this, open));

    $scope.$watchCollection(() => { return this.collaborators }, (c) => {

  		// Don't include the current user
  		var user = _.findWhere(that.collaborators, { _id: that.Auth.getCurrentUser()._id });
  		if (user) {

  			that.collaborators.splice(that.collaborators.indexOf(user), 1);
  		}

  		// Assign a colour to each user
  		angular.forEach(that.collaborators, function (user: Common.Data.IUser) {

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

    // Set the zoom and pan
    $timeout(() => {

      this.setCenter(this.localStorageService.get(`frame.${ this.frame._id }.view.center`));
      this.setZoom(this.localStorageService.get(`frame.${ this.frame._id }.view.zoom`));
			this.setEditMode(this.editMode);
    });


    /*
  	 * Server notifications
  	 */

  	socket.on('component:select', function (data) {

  		// Find the collaborator who selected
  		var user = _.find(that.collaborators, function (user: Common.Data.IUser) {

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
  		var user = _.find(that.collaborators, function (user: Common.Data.IUser) {

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


    /**
     * Toolbar notifications
     */

		$scope.$on('toolbar:view:gofullscreen', (e, params) => {

			this.goFullscreen();
		});

		$scope.$on('toolbar:view:cancelfullscreen', (e, params) => {

			this.cancelFullscreen();
		});

    $scope.$on('toolbar:component:added', (e, params) => {

      // Center new component in view
      var properties = {
        x: paper.view.bounds.x + (params.x / paper.view.zoom) || paper.view.bounds.x + (paper.view.bounds.width/2),
        y: paper.view.bounds.y + (params.y / paper.view.zoom) || paper.view.bounds.y + (paper.view.bounds.height/2),
        index: paper.project.activeLayer.children.length
      };

      // Create the new model
      var component = new Common.Data.Component(params.id, properties);

      // Create the instances and save to db
      var instances = this.addComponentsToView(component, null);
      this.saveComponents(instances);
    });


		/**
		 * Tray notifications
		 */

    $scope.$on('properties:component:updated', (e, params) => {

      this.saveComponents([params.component]);
      this.$scope.$broadcast('controller:component:updated', { component: params.component });
    });

		$scope.$on('properties:media:added', (e, params) => {

			this.socket.emit('frame:media:save', {
				media: params.media,
				frame: this.frame
			});
    });


    /*
     * Wireframe notifications
     */

		$scope.$on('view:artboard:updated', (e, artboards) => {

			this.saveArtboards(artboards);
		});

		$scope.$on('view:artboard:deleted', (e, artboards) => {

			this.deleteArtboards(artboards);
		});

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

    $scope.$on('component:copied', (e, components) => {

      if (!angular.isArray(components)) {

        components = [components];
      }

      if (!components.length) {

        return;
      }

      this.copy(components);
    });

    $scope.$on('component:pasted', (e) => {

      this.paste();
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

		// Register to receive updates to this frame and its related models
		this.socket.emit('frame:subscribe', this.frame._id);

		// Document updating
		this.socket.syncUpdates('frame:media', this.media);
		this.socket.syncUpdates('frame:collaborator', this.collaborators);

		// Components updating
		this.socket.syncUpdates('component', this.components, function (event, component, array) {

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

		// Artboards updating
		this.socket.syncUpdates('artboard', this.artboards, function (event, artboard, array) {

			// If the event was triggered by this session
			// don't update
			if (artboard.lastModifiedBy == that.Session.getSessionId()) {

				return;
			}

			if (event == 'created') {

				that.addArtboardsToView([artboard], { select: false });
			}

			else if (event == 'updated') {

				that.updateArtboardInView(artboard);
			}

			else if (event == 'deleted') {

				// that.removeArtboardFromView(artboard);
			}
		});

    // Activity updating
    this.socket.syncUpdates('activity', this.activities);

		this.$scope.$on('$destroy', () => {

			// Deregister from receiving updates to this frame and its related models
			this.socket.emit('frame:unsubscribe', this.frame._id);

      this.socket.unsyncUpdates('frame:collaborator');
			this.socket.unsyncUpdates('component');
      this.socket.unsyncUpdates('activity');
		});
	};

	private registerUser() {

    var that = this;

		// Broadcast the connected user
		this.socket.emit('frame:collaborator:save', {
			frame: { _id: this.$stateParams.id },
			user: this.Auth.getCurrentUser()
		});

    // When the user navigates away from the frame
		this.$scope.$on('$destroy', function () {

			that.socket.emit('frame:collaborator:remove', {
				frame: { _id: that.$stateParams.id },
				user: that.Auth.getCurrentUser()
			});
		});

    // When the user closes the window/navigates
    this.$window.addEventListener('beforeunload', function (e) {

      that.socket.emit('frame:collaborator:remove', {
				frame: { _id: that.$stateParams.id },
				user: that.Auth.getCurrentUser()
			});
    });
	};

  private initializeTool() {

    var handler = (event) => {

      // Special cases
      // Using the command/control modifier outputs special characters for the
      // event.key parameter which could be OS-specific. We will use the raw
      // JS event keyCode instead.
      if (event.modifiers.command || event.modifiers.control) {

        switch (event.event.keyCode) {

          case 187:   // equals (zoom in)

            this.$scope.$apply(() => {

              var zoomIndex = this.ZOOM_LEVELS.indexOf(this.view.zoom);
              var zoom = this.ZOOM_LEVELS[zoomIndex < (this.ZOOM_LEVELS.length - 1) ? zoomIndex + 1 : zoomIndex];

              event.event.preventDefault();
              this.setZoom(zoom);
            });

            break;

          case 189:   // dash (zoom out)

            this.$scope.$apply(() => {

              var zoomIndex = this.ZOOM_LEVELS.indexOf(this.view.zoom);
              var zoom = this.ZOOM_LEVELS[zoomIndex > 0 ? zoomIndex - 1 : zoomIndex];

              event.event.preventDefault();
              this.setZoom(zoom);
            });

            break;
        }
      }

			if (!event.modifiers.command && !event.modifiers.control) {

				switch(event.key) {

					case '1':
					case '2':
					case '3':

						// If in an input, allow event to continue
						if (event.event.target.tagName == 'INPUT' || event.event.target.tagName == 'TEXTAREA') {}

						// Otherwise cancel and broadcast to wireframe
						else {

							event.event.preventDefault();

							this.$scope.$apply(() => {

								switch(event.key) {
									case '1':	this.setEditMode(Common.Drawing.EditMode.Draw); break;
									case '2':	this.setEditMode(Common.Drawing.EditMode.Artboards); break;
									case '3':	this.setEditMode(Common.Drawing.EditMode.Annotate); break;
								}
							});
						}

						break;
				}
			}

      // Standard cases
      switch(event.key) {

        case 'left':
        case 'right':
        case 'up':
        case 'down':
          // If in an input, allow event to continue
          if (event.event.target.tagName == 'INPUT' || event.event.target.tagName == 'TEXTAREA') {}

          // Otherwise cancel and broadcast to wireframe
          else {

            event.event.preventDefault();
            event.event.stopPropagation();
            this.$scope.$broadcast('event:keydown', event);
          }

          break;

        case 'backspace':
          // If in an input, allow event to continue
          if (event.event.target.tagName == 'INPUT' || event.event.target.tagName == 'TEXTAREA') {}

          // Otherwise cancel and broadcast to wireframe
          else {

            event.event.preventDefault();
            event.event.stopPropagation();
            this.$scope.$broadcast('event:keydown', event);
          }

          break;

        case 's':
          if (event.modifiers.command || event.modifiers.control) {

            event.event.preventDefault();
            event.event.stopPropagation();
            this.save();
          }

          break;

        default:
          this.$scope.$broadcast('event:keydown', event);
      }
    };

		Higherframe.Wireframe.Tools.Draw.get().onKeyDown = handler;
		Higherframe.Wireframe.Tools.Artboards.get().onKeyDown = handler;
  }


  /*
   * Serialization
   */

  private deserialize(document: Higherframe.Data.Document) {

    setTimeout(() => {

			// Add components in order of z index
			document.components = _.sortBy(
				document.components,
				(component) => {

          return component.properties.index;
        }
      );

      document.components.forEach((component) => {

				// Store reference
				this.components.push(component);

				// Add to view
        this.addComponentsToView(component, { select: false });
      });

			document.artboards.forEach((artboard) => {

				// Wrap data in a resource to allow direct updating of artboard
				var resource = new this.Artboard(artboard);

				// Store reference
				this.artboards.push(resource);

				// Add to view
        this.addArtboardsToView(resource, { select: false });
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

	public saveArtboards(artboards: Array<Higherframe.Drawing.Artboard>) {

		artboards.forEach((artboard: Higherframe.Drawing.Artboard) => {

			artboard.commit();
			this.Artboard.update(artboard.model);
		});
	}

	private saveComponents(components: any) {

    var that = this;

    if (!angular.isArray(components)) {

      components = [components];
    }

    // Save components and set _id when saved
    angular.forEach(components, function (component: Common.Drawing.Component.IComponent) {

      // We will first serialize the data in the component's model.
      // If an _id key is found on the model, we know this component has already
      // been saved to the database, so we will update.
      // If no _id is found, we know it is a new component and do a post. When
      // the post is completed, we will assign the returned _id to the original
      // component model, since the serialized version is a throwaway copy.
      var serialized = <Common.Data.Component>component.serialize();

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

	private deleteArtboards(artboards: Array<Higherframe.Drawing.Artboard>) {

		artboards.forEach((artboard) => {

			artboard.model.$delete();
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

	private setActivityOpen(open: boolean) {

		this.activityOpen = open;
		this.localStorageService.set(this.STORAGE_ACTIVITY_OPEN_KEY, this.activityOpen);
	}

	private setEditMode(mode: Common.Drawing.EditMode) {

		this.editMode = mode;
		this.localStorageService.set(this.STORAGE_EDIT_MODE_KEY, this.editMode);

		this.$scope.$broadcast('editMode:set', this.editMode);
	}

	private addArtboardsToView(artboards, options?) {

		if (!angular.isArray(artboards)) {

      artboards = [artboards];
    }

    if (!artboards.length) {

      return;
    }

		// Create the artboards in the view
    var instances = [];
    artboards.forEach((artboard: Common.Data.IArtboard) => {

      var instance = new Higherframe.Drawing.Artboard(artboard);
      instances.push(instance);
    });

    // Tell the view new components have been added
    this.$scope.$broadcast('controller:artboard:added', {
      artboards: instances,
      options: options
    });

		return instances;
	}


  private addComponentsToView(components, options?) {

    if (!angular.isArray(components)) {

      components = [components];
    }

    if (!components.length) {

      return;
    }

    // Create the components in the view
    var instances = [];
    components.forEach((component) => {

			var instance = Common.Drawing.Component.Factory.fromModel(component);

      instances.push(instance);
    });

    // Tell the view new components have been added
    this.$scope.$broadcast('component:added', {
      components: instances,
      options: options
    });

		return instances;
  };

	private updateUiWithComponents(components: Array<Common.Drawing.Component.IComponent>) {

    this.$scope.$broadcast('controller:component:selected', components);
	};

	private removeComponentFromView(component) {

		// Find the component with this _id
		angular.forEach(paper.project.activeLayer.children, function (item: Common.Drawing.Component.IComponent) {

			if (item.model._id == component._id) {

				item.remove();
			}
		});
	};

	private updateArtboardInView(artboard) {

		this.$scope.$broadcast('controller:artboard:updated', { artboard: artboard });
	};

	private updateComponentInView(component) {

		// Find the component with this _id
		angular.forEach(paper.project.activeLayer.children, function (item: Common.Drawing.Component.IComponent) {

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

		if (!zoom) {

			zoom = 1;
		}

    this.view.zoom = zoom;
    this.$scope.$broadcast('view:zoom', this.view.zoom);
  }

  private setCenter(center: Common.Drawing.IPoint) {

		if (!center) {

			center = { x: 0, y: 0 };
		}

    this.view.center = center;
    this.$scope.$broadcast('view:pan', this.view.center);
  }

	private goFullscreen() {

		var document:any = window.document;

		if (
			document.fullscreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled
		) {

			var el = document.body;

			// go full-screen
			if (el.requestFullscreen) {
				el.requestFullscreen();
			} else if (el.webkitRequestFullscreen) {
				el.webkitRequestFullscreen();
			} else if (el.mozRequestFullScreen) {
				el.mozRequestFullScreen();
			} else if (el.msRequestFullscreen) {
				el.msRequestFullscreen();
			}
		}
	}

	private cancelFullscreen() {

		var document:any = window.document;

		if (
			document.fullscreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled
		) {

			// cancel full-screen
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}
	}

	private copy(components: Array<any>) {

		// Reset the clipboard
		this.Clipboard.clear();

		// Copy representations of the components
		angular.forEach(components, (component) => {

			this.Clipboard.add(new Higherframe.Utilities.ClipboardItem(
				Higherframe.Utilities.ClipboardItemType.Component,
				component.id,
				angular.copy(component.model)
			));
		});
	}

	private paste() {

		// Since only components can be copied at the moment, trust all the
		// clipboard items are components
		let components = this.Clipboard.getItems().map((item) => item.data);

		if (!components.length) {

			return;
		}

		// Calculate the offset required to put the first item in the center
		// of the canvas
		let offsetX = paper.view.center.x - components[0].properties.x;
		let offsetY = paper.view.center.y - components[0].properties.y;

		// Copy representations of the component
		components.forEach((component: Common.Data.Component) => {

			delete component._id;

			component.properties.x += offsetX;
			component.properties.y += offsetY;
		});

		let instances = this.addComponentsToView(components);
		this.saveComponents(instances);
	}


  /*
   * Event handlers
   */

	// Toolbar
	onEditModeClick(mode: Common.Drawing.EditMode) {

		this.setEditMode(mode);
	}

	onToolbarZoomLevelClick(zoom: number) {

		this.setZoom(zoom);
	}

	onToolbarCopyClick() {

		this.copy(this.selection);
	}

	onToolbarCutClick() {

		this.copy(this.selection);

		this.selection.forEach((component) => {

			this.deleteComponent(component);
		});
	}

	onToolbarPasteClick() {

		this.paste();
	}

	onToolbarShareClick() {

    var modal = new Higherframe.Modals.Frame.Share(this.frame, this.Auth, this.$mixpanel);
    this.ModalManager.present(modal);
  }

  // Action bar
  onActionbarCloseClick() {

    this.$state.go('frames');
  }

  onActionbarSettingsClick() {

    this.$state.go('frameSettings', { id: this.frame._id });
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
    var component = new Common.Data.Component(definition.id, properties);

    // Create the instances and save to db
    var instances = this.addComponentsToView(component, null);
    this.saveComponents(instances);
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
