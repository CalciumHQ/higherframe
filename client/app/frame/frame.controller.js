'use strict';

angular
  .module('siteApp')
  .controller('FrameCtrl', function (frame, $scope, $http, $filter, $stateParams, ComponentFactory) {

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

      $scope.components.push(ComponentFactory.components.rectangle);
      $scope.components.push(ComponentFactory.components.circle);
      $scope.components.push(ComponentFactory.components.triangle);
      $scope.components.push(ComponentFactory.components.iphone);
      $scope.components.push(ComponentFactory.components.iphoneTitlebar);
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
          
          addComponent(ComponentFactory.get(component.componentId), component.properties);
        });
      }, 200);
    };

    var serialize = function () {

      var document = {
				view: {},
        components: []
      };
      
      // Components
      angular.forEach($scope.wireframe.components, function (component) {
        
        document.components.push({
          componentId: component.component.id,
          properties: {
            position: { x: component.position.x, y: component.position.y },
						index: component.index
          }
        });
      });
      
      $http
        .patch('/api/frames/' + $stateParams.id, document)
        .success(function (data) {
          
        });
    };


    /*
     * View methods
     */
     
    var addComponent = function (component, options) {

      var defaults = {
        position: new paper.Point(400, 400),
        radius: 100
      };
      
      options = angular.extend(defaults, options);
      
      var instance = ComponentFactory.create(component.id, options);
      $scope.wireframe.components.push(instance);
    };
		
		var removeComponent = function (component, options) {
			
			var index;
			_.find($scope.wireframe.components, function (c, i) {
				
				if (c.id == component.id) {
					
					index = i;
					return c;
				}
			});
			
			$scope.wireframe.components.splice(index, 1);
		};
    
    
    /*
     * Wireframe notifications
     */
     
    $scope.$on('componentAdded', function () {
    
			
    });
    
    $scope.$on('componentsMoved', function (e, components) {
    
      serialize();
    });
		
		$scope.$on('componentsIndexModified', function (e, components) {
    
      serialize();
    });
		
		$scope.$on('componentsDeleted', function (e, components) {
    
			angular.forEach(components, function (component) {
			
				removeComponent(component);	
			});
			
      serialize();
    });


    /*
     * Event handlers
     */
     
    $scope.onComponentClick = function (component) {

      addComponent(component);
			serialize();
    };

    $scope.onQuickAddKeyDown = function (event) {

      if (!$scope.quickAdd) {

        return;
      }

      if (event.keyCode == 13 || event.keyCode == 9) {

        var component = $filter('filter')($scope.components, $scope.quickAdd)[0];

        if (component) {

          addComponent(component);
          $scope.quickAdd = '';
        }

        event.preventDefault();
      }
    };

    (function init() {
    
      registerComponents();
      
      // Deserialize the loaded frame
      deserialize(frame);
    })();
  });
