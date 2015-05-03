'use strict';

angular
  .module('siteApp')
  .controller('FrameCtrl', function ($scope, $filter, ComponentFactory) {

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
    };


    /* 
     * Serialization
     */
    var deserialize = function () {

    };

    var serialize = function () {

    };


    /*
     * View methods
     */
    var addComponent = function (component) {

      var options = {
        center: new paper.Point(400, 400),
        radius: 100
      };
      
      var instance = ComponentFactory.create(component.id, options);
      $scope.wireframe.components.push(instance);
    };


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
    })();
  });
