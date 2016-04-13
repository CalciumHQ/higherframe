
class FrameCtrl implements Higherframe.Utilities.History.IHistoryItemDelegate {

	/**
	 * Constants
	 */

	private SIDEBAR_OPEN_KEY: string = 'frame.sidebar.open';
	private SIDEBAR_MODE_KEY: string = 'frame.sidebar.mode';
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
  selection: Array<Common.Drawing.Component> = [];

  activities: Array<Higherframe.Data.IActivity> = [];
	media: Array<Common.Data.IMedia> = [];
  collaborators: Array<Object> = [];

  // UI variables
	sidebarOpen: boolean = (typeof this.localStorageService.get(this.SIDEBAR_OPEN_KEY) !== 'undefined'
		? this.localStorageService.get(this.SIDEBAR_MODE_KEY)
		: false);

	sidebarMode: string = this.localStorageService.get(this.SIDEBAR_MODE_KEY) || 'properties';

  quickAdd = {
    open: false,
    focus: false,
    query: '',
    results: [],
    index: 0
  };

	undoHistory: Array<any>;
	redoHistory: Array<any>;

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
		private HistoryManager: Higherframe.Utilities.History.Manager,
    Clipboard: Higherframe.Utilities.Clipboard,
		ComponentLibrary: Higherframe.Drawing.Component.Library.IService,
    private $mixpanel
  ) {

    var that = this;

		this.frame = frame;
		this.Clipboard = Clipboard;

		this.undoHistory = this.HistoryManager.getUndoHistory(this.frame._id);
		this.redoHistory = this.HistoryManager.getRedoHistory(this.frame._id);

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

		$scope.$watch(() => { return this.sidebarMode; }, (mode) => this.setSidebarMode.call(this, mode));

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
		 * Toolbox notifications
		 */

		$scope.$on('toolbox:component:added', (e, component) => {

			this.saveComponents(component);
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
      let properties = new Common.Data.ComponentProperties({
        x: paper.view.bounds.x + (params.x / paper.view.zoom) || paper.view.bounds.x + (paper.view.bounds.width/2),
        y: paper.view.bounds.y + (params.y / paper.view.zoom) || paper.view.bounds.y + (paper.view.bounds.height/2),
        index: paper.project.activeLayer.children.length,
				opacity: 100
      });

      // Create the new model
      var component = new Common.Data.Component(params.id, properties);

      // Create the instances and save to db
      var instances = this.addComponentsToView(component, null);
      this.saveComponents(instances);
    });

		$scope.$on('toolbar:selection:alignLeft', () => {

			this.alignItemsLeft(this.selection);
		});

		$scope.$on('toolbar:selection:alignCenter', () => {

			this.alignItemsCenter(this.selection);
		});

		$scope.$on('toolbar:selection:alignRight', () => {

			this.alignItemsRight(this.selection);
		});

		$scope.$on('toolbar:selection:alignTop', () => {

			this.alignItemsTop(this.selection);
		});

		$scope.$on('toolbar:selection:alignMiddle', () => {

			this.alignItemsMiddle(this.selection);
		});

		$scope.$on('toolbar:selection:alignBottom', () => {

			this.alignItemsBottom(this.selection);
		});

		$scope.$on('toolbar:selection:distributeHorizontally', () => {

			this.distributeItemsHorizontally(this.selection);
		});

		$scope.$on('toolbar:selection:distributeVertically', () => {

			this.distributeItemsVertically(this.selection);
		});


		/**
		 * Tray notifications
		 */

    $scope.$on('properties:component:updated', (e, data) => {

			this.onComponentPropertyChange([data.component], data.name, data.value, true);
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

		$scope.$on('view:properties:open', (e, data) => {

			let point = <paper.Point>data.point;
			this.setPropertiesOpen(true, point);
		});

		$scope.$on('view:properties:close', (e, data) => {

			this.setPropertiesOpen(false);
		});

		$scope.$on('view:artboard:create', (e, artboards) => {

 			this.createArtboards(artboards);
 		});

		$scope.$on('view:artboard:updated', (e, artboards) => {

			this.saveArtboards(artboards);
		});

		$scope.$on('view:artboard:deleted', (e, artboards) => {

			this.deleteArtboards(artboards);
		});

    $scope.$on('view:component:moved', (e, components) => {

			if (!components || !components.length) {

				return;
			}

			// Store positions for history
			let oldPositions = [];
			let newPositions = [];

			// Update component positions
  		angular.forEach(components, (component) => {

  			component.updateModel();

				let remote = component.model.properties.getRemote();
				let local = component.model.properties.getLocal();
				oldPositions.push(new paper.Point(remote.x, remote.y));
				newPositions.push(new paper.Point(local.x, local.y));
  		});

      this.saveComponents(components);

			// Save the history entry
			let historyItem = new Higherframe.Utilities.History.Items.MoveComponentHistoryItem(
				components,
				oldPositions,
				newPositions
			);
			historyItem.delegate = this;
			this.HistoryManager.add(this.frame._id, historyItem);
    });

  	$scope.$on('componentsIndexModified', (e, components) => {

  		this.saveComponents(components);
    });

  	$scope.$on('componentsDeleted', (e, components) => {

  		let models = components.map((component) => component.model);
			this.deleteComponents(models, true);

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

  	$scope.$on('view:component:deselected', (e, components) => {

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

			if (!this.selection.length) {

				this.$scope.$broadcast('controller:properties:close');
			}
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

				that.removeComponentsFromView([component]);
			}
		});

		// Artboards updating
		this.socket.syncUpdates('artboard', this.artboards, (event, artboard, array) => {

			// If the event was triggered by this session
			// don't update
			if (artboard.lastModifiedBy == this.Session.getSessionId()) {

				return;
			}

			if (event == 'created') {

				// Object is raw JSON. Replace with a resource representation so we can
				// update the artboard directly.
				var index = this.artboards.indexOf(artboard);
				var resource = new this.Artboard(artboard);
				this.artboards[index] = resource;

				this.addArtboardsToView([resource], { select: false });
			}

			else if (event == 'updated') {

				this.updateArtboardInView(artboard);
			}

			else if (event == 'deleted') {

				this.removeArtboardFromView(artboard);
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

		// TODO
		// Higherframe.Wireframe.Tools.Draw.get().onKeyDown = handler;
		// Higherframe.Wireframe.Tools.Artboards.get().onKeyDown = handler;
  }


	/**
	 * IHistoryItemDelegate methods
	 */

	onUndo(item: Higherframe.Utilities.History.Item) {

		if (item instanceof Higherframe.Utilities.History.Items.MoveComponentHistoryItem) {

			let moveItem: Higherframe.Utilities.History.Items.MoveComponentHistoryItem = item;
			this.moveComponents(item.components, item.oldPositions);
		}

		else if (item instanceof Higherframe.Utilities.History.Items.ChangeComponentPropertyHistoryItem) {

			let propertyItem: Higherframe.Utilities.History.Items.ChangeComponentPropertyHistoryItem = item;

			propertyItem.components.forEach((component, i) => {

				component.model.properties[propertyItem.property] = propertyItem.oldValues[i];
				this.onComponentPropertyChange([component], propertyItem.property, propertyItem.oldValues[i], false);
			});
		}

		else if (item instanceof Higherframe.Utilities.History.Items.DeleteComponentHistoryItem) {

			let deleteItem: Higherframe.Utilities.History.Items.DeleteComponentHistoryItem = item;
			this.addComponentsToView(item.components);
			item.components.forEach((component) => {

				this.$http.patch(`/api/components/${component._id}?include_deleted`, { status: 'active' });
			});
		}
	}

	onRedo(item: Higherframe.Utilities.History.Item) {

		if (item instanceof Higherframe.Utilities.History.Items.MoveComponentHistoryItem) {

			let moveItem: Higherframe.Utilities.History.Items.MoveComponentHistoryItem = item;
			this.moveComponents(item.components, item.newPositions);
		}

		else if (item instanceof Higherframe.Utilities.History.Items.ChangeComponentPropertyHistoryItem) {

			let propertyItem: Higherframe.Utilities.History.Items.ChangeComponentPropertyHistoryItem = item;

			propertyItem.components.forEach((component, i) => {

				component.model.properties[propertyItem.property] = propertyItem.newValue;
				this.onComponentPropertyChange([component], propertyItem.property, propertyItem.newValue, false);
			});
		}

		else if (item instanceof Higherframe.Utilities.History.Items.DeleteComponentHistoryItem) {

			let deleteItem: Higherframe.Utilities.History.Items.DeleteComponentHistoryItem = item;
			this.deleteComponents(item.components, false);
			this.removeComponentsFromView(item.components)
		}
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

      document.components.forEach((data, i) => {

				// Currently component is raw JSON
				// Wrap in class
				let component = Common.Data.Component.deserialize(data);

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

	public moveComponents(components: Array<Common.Drawing.Component>, positions: Array<paper.Point>) {

		components.forEach((component, i) => {

			component.model.properties.x = positions[i].x;
			component.model.properties.y = positions[i].y;
			this.updateComponentInView(component.model);
		});

		this.saveComponents(components);
	}

	public createArtboards(datas: Array<Common.Data.IArtboard>) {

		var models = datas.map((data) => {

			data.frame = this.frame._id;
			return new this.Artboard(data)
		});

		var artboards = this.addArtboardsToView(models);
		artboards.forEach((artboard) => {

			artboard.model.lastModifiedBy = this.Session.getSessionId();
			artboard.model
				.$save()
				.then((response) => {

					// Copy _id into new artboard
					this.updateArtboardInView(response);
				});
		});
	}

	public saveArtboards(artboards: Array<Higherframe.Drawing.Artboard>) {

		artboards.forEach((artboard: Higherframe.Drawing.Artboard) => {

			artboard.commit();
			artboard.model.lastModifiedBy = this.Session.getSessionId();
			this.Artboard.update(artboard.model);
		});
	}

	private saveComponents(components: any) {

    if (!angular.isArray(components)) {

      components = [components];
    }

    // Save components and set _id when saved
    components.forEach((component: Common.Drawing.Component) => {

			component.model.lastModifiedBy = this.Session.getSessionId();

			// Update
			if (component.model._id) {

				component.model.update();
			}

			// Create
			else {

				component.model.save(this.$stateParams.id);
			}
    });
	};

	private deleteArtboards(artboards: Array<Higherframe.Drawing.Artboard>) {

		artboards.forEach((artboard) => {

			artboard.model.$delete();
		});
	};

	private deleteComponents(components: Array<Common.Data.Component>, history: boolean) {

		components.forEach((component) => {

			this.$http.delete(`/api/frames/${this.$stateParams.id}/components/${component._id}`);
		});

		// Write to history
		if (history) {

			let item = new Higherframe.Utilities.History.Items.DeleteComponentHistoryItem(components);
			item.delegate = this;
			this.HistoryManager.add(this.frame._id, item);
		}
	};


  /*
   * View methods
   */

	private setPropertiesOpen(open: boolean, point?: { x: number, y: number}) {

		this.$scope.$broadcast('controller:properties:open', { open: open, point: point });
	}

	private setSidebarMode(mode: string) {

		this.sidebarMode = mode;
		this.localStorageService.set(this.SIDEBAR_MODE_KEY, this.sidebarMode);
	}

	private addArtboardsToView(artboards, options?): Array<Higherframe.Drawing.Artboard> {

		if (!angular.isArray(artboards)) {

      artboards = [artboards];
    }

    if (!artboards.length) {

      return;
    }

		// Create the artboards in the view
    var instances: Array<Higherframe.Drawing.Artboard> = [];
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

	private removeArtboardFromView(artboard) {

		this.$scope.$broadcast('controller:artboard:removed', { artboard: artboard });
	}

	private updateArtboardInView(artboard) {

		this.$scope.$broadcast('controller:artboard:updated', { artboard: artboard });
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
    components.forEach((component) => {

			var instance = Common.Drawing.Factory.fromModel(component);

      instances.push(instance);
    });

    // Tell the view new components have been added
    this.$scope.$broadcast('component:added', {
      components: instances,
      options: options
    });

		return instances;
  };

	private updateUiWithComponents(components: Array<Common.Drawing.Component>) {

    this.$scope.$broadcast('controller:component:selected', components);
	};

	private removeComponentsFromView(components: Array<Common.Data.Component>) {

		// Inform the view
		components.forEach((component) => {

			this.$scope.$broadcast('controller:component:deleted', {
				component: component
			});
		});
	};

	private updateComponentInView(component) {

		// Find the component with this _id
		paper.project.activeLayer.children.forEach((item: Common.Drawing.Component) => {

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

	private alignItemsLeft(items: Array<Common.Drawing.Component>) {

		if (!items.length) {

			return;
		}

		// Get the left position of the first item
		let left = this.selection[0].getBoundsRectangle().left;

		// Update the other items
		this.selection.forEach((item: Common.Drawing.Component) => {

			let delta = left - item.getBoundsRectangle().left;
			item.model.properties.x += delta;

			this.saveComponents([item]);
			this.updateComponentInView(item.model);
		});
	}

	private alignItemsCenter(items: Array<Common.Drawing.Component>) {

		if (!items.length) {

			return;
		}

		// Get the center position of the first item
		let center = this.selection[0].getBoundsRectangle().center.x;

		// Update the other items
		this.selection.forEach((item: Common.Drawing.Component) => {

			let delta = center - item.getBoundsRectangle().center.x;
			item.model.properties.x += delta;

			this.saveComponents([item]);
			this.updateComponentInView(item.model);
		});
	}

	private alignItemsRight(items: Array<Common.Drawing.Component>) {

		if (!items.length) {

			return;
		}

		// Get the left position of the first item
		let right = this.selection[0].getBoundsRectangle().right;

		// Update the other items
		this.selection.forEach((item: Common.Drawing.Component) => {

			let delta = right - item.getBoundsRectangle().right;
			item.model.properties.x += delta;

			this.saveComponents([item]);
			this.updateComponentInView(item.model);
		});
	}

	private alignItemsTop(items: Array<Common.Drawing.Component>) {

		if (!items.length) {

			return;
		}

		// Get the left position of the first item
		let top = this.selection[0].getBoundsRectangle().top;

		// Update the other items
		this.selection.forEach((item: Common.Drawing.Component) => {

			let delta = top - item.getBoundsRectangle().top;
			item.model.properties.y += delta;

			this.saveComponents([item]);
			this.updateComponentInView(item.model);
		});
	}

	private alignItemsMiddle(items: Array<Common.Drawing.Component>) {

		if (!items.length) {

			return;
		}

		// Get the left position of the first item
		let middle = this.selection[0].getBoundsRectangle().center.y;

		// Update the other items
		this.selection.forEach((item: Common.Drawing.Component) => {

			let delta = middle - item.getBoundsRectangle().center.y;
			item.model.properties.y += delta;

			this.saveComponents([item]);
			this.updateComponentInView(item.model);
		});
	}

	private alignItemsBottom(items: Array<Common.Drawing.Component>) {

		if (!items.length) {

			return;
		}

		// Get the left position of the first item
		let bottom = this.selection[0].getBoundsRectangle().bottom;

		// Update the other items
		this.selection.forEach((item: Common.Drawing.Component) => {

			let delta = bottom - item.getBoundsRectangle().bottom;
			item.model.properties.y += delta;

			this.saveComponents([item]);
			this.updateComponentInView(item.model);
		});
	}

	private distributeItemsHorizontally(items: Array<Common.Drawing.Component>) {

		if (!items.length) {

			return;
		}

		// Sort items by center position
		let sorted = _.sortBy(items, (item) => item.getBoundsRectangle().center.x);

		// Get the center position of the left-most item and right-most items
		// and calculate the distribution
		let leftCenter = sorted[0].getBoundsRectangle().center.x,
			rightCenter = sorted[sorted.length-1].getBoundsRectangle().center.x,
			step = (rightCenter - leftCenter) / (sorted.length - 1);

		// Update the other items
		sorted.forEach((item: Common.Drawing.Component, i: number) => {

			item.model.properties.x = leftCenter + (i * step);

			this.saveComponents([item]);
			this.updateComponentInView(item.model);
		});
	}

	private distributeItemsVertically(items: Array<Common.Drawing.Component>) {

		if (!items.length) {

			return;
		}

		// Sort items by center position
		let sorted = _.sortBy(items, (item) => item.getBoundsRectangle().center.y);

		// Get the center position of the left-most item and right-most items
		// and calculate the distribution
		let topCenter = sorted[0].getBoundsRectangle().center.y,
			bottomCenter = sorted[sorted.length-1].getBoundsRectangle().center.y,
			step = (bottomCenter - topCenter) / (sorted.length - 1);

		// Update the other items
		sorted.forEach((item: Common.Drawing.Component, i: number) => {

			item.model.properties.y = topCenter + (i * step);

			this.saveComponents([item]);
			this.updateComponentInView(item.model);
		});
	}


	/**
	 * Application event handlers
	 */

	private onComponentPropertyChange(components: Array<Common.Drawing.Component>, name: string, value: any, history?: boolean) {

		// Write to history
		if (history) {

			// Compile list of old values
			let oldValues: Array<any> = [];
			components.forEach((component) => {

				oldValues.push(component.model.properties.getRemote()[name]);
			});

			let item = new Higherframe.Utilities.History.Items.ChangeComponentPropertyHistoryItem(
				components,
				name,
				oldValues,
				value
			);

			item.delegate = this;
			this.HistoryManager.add(this.frame._id, item);
		}

		this.saveComponents(components);
		this.$scope.$broadcast('controller:component:updated', { component: components[0] });
	}


  /**
   * UI event handlers
   */

	onToolbarZoomLevelClick(zoom: number) {

		this.setZoom(zoom);
	}

	onToolbarUndoClick() {

		this.HistoryManager.undo(this.frame._id);
	}

	onToolbarRedoClick() {

		this.HistoryManager.redo(this.frame._id);
	}

	onToolbarCopyClick() {

		this.copy(this.selection);
	}

	onToolbarCutClick() {

		this.copy(this.selection);

		// Get data models for selected items
		let models = this.selection.map((component) => component.model);
		this.deleteComponents(models, false);
	}

	onToolbarPasteClick() {

		this.paste();
	}

	// Sidebar
	onSidebarModeClick(mode: string) {

		if (this.sidebarOpen && this.sidebarMode == mode) {

			this.sidebarOpen = false;
		}

		else if (!this.sidebarOpen) {

			this.sidebarOpen = true;
		}

		this.sidebarMode = mode;

		this.localStorageService.set(this.SIDEBAR_OPEN_KEY, this.sidebarOpen);
		this.localStorageService.set(this.SIDEBAR_MODE_KEY, this.sidebarMode);
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
    let properties = new Common.Data.ComponentProperties({
      x: paper.view.bounds.x + (paper.view.bounds.width/2),
      y: paper.view.bounds.y + (paper.view.bounds.height/2),
      index: paper.project.activeLayer.children.length,
			opacity: 100
    });

    // Create the new model
    var component = new Common.Data.Component(definition.id, properties);

    // Create the instances and save to db
    var instances = this.addComponentsToView(component, null);
    this.saveComponents(instances);
  }
}

angular
  .module('siteApp')
  .controller('FrameCtrl', FrameCtrl);
