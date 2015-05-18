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
        
        angular.forEach(document.components, function (component) {
          
          addComponent(ComponentFactory.get(component.componentId), component.properties);
        });
      }, 200);
    };

    var serialize = function () {

      var document = {
        components: []
      };
      
      // Components
      angular.forEach($scope.wireframe.components, function (component) {
        
        document.components.push({
          componentId: component.component.id,
          properties: {
            position: { x: component.position.x, y: component.position.y }
          }
        });
      });
      
      $http
        .patch('/api/frames/' + $stateParams.id, document)
        .success(function (data) {
          
          console.log('saved', data);
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
    
    
    /*
     * Wireframe notifications
     */
     
    $scope.$on('componentAdded', function () {
    
      console.log('componentAdded');
    });
    
    $scope.$on('componentsMoved', function (e, components) {
    
      console.log('componentMoved', e, components);
      serialize();
    });


    /*
     * Event handlers
     */
     
    $scope.onComponentClick = function (component) {

      addComponent(component);
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
