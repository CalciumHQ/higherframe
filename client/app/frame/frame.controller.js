'use strict';

angular
  .module('siteApp')
  .controller('FrameCtrl', function ($scope, $filter) {

    /*
     * Component definitions
     */
     
    // Rectangle component
    function Rectangle() {

      var rectangle = new paper.Rectangle(new Point(100, 200), new Point(200, 300));
      var path = new paper.Path.Rectangle(rectangle);
      path.strokeColor = '#888';
      path.fillColor = 'white';

      this.path = path;
    };

    Rectangle.prototype.name = 'Rectangle';
    Rectangle.prototype.tags = [
      'shape',
      'basic'
    ];
    Rectangle.prototype.path = null;

    // Circle component
    function Circle(options) {

      var path = new paper.Path.Circle(options.center, options.radius);
      path.strokeColor = '#888';
      path.fillColor = 'white';

      this.path = path;
    };

    Circle.prototype.name = 'Circle';
    Circle.prototype.tags = [
      'shape',
      'basic'
    ];
    Circle.prototype.path = null;


    // Triangle component
    function Triangle() {

      var center = new paper.Point(100, 200);
      var path = new paper.Path.RegularPolygon(center, 3, 50);
      path.strokeColor = '#888';
      path.fillColor = 'white';

      this.path = path;
    };

    Triangle.prototype.name = 'Triangle';
    Triangle.prototype.tags = [
      'shape',
      'basic'
    ];
    Triangle.prototype.path = null;


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

      $scope.components.push({
        name: Rectangle.prototype.name,
        tags: Rectangle.prototype.tags,
        constructor: Rectangle
      });
      
      $scope.components.push({
        name: Circle.prototype.name,
        tags: Circle.prototype.tags,
        constructor: Circle
      });

      $scope.components.push({
        name: Triangle.prototype.name,
        tags: Triangle.prototype.tags,
        constructor: Triangle
      });
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
      
      var instance = new component.constructor(options);
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
