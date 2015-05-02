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
    
    // iPhone component
    function Iphone(options) {

      var WIDTH = 232;
      var HEIGHT = 464;
      
      var topLeft = new paper.Point(options.center.x - WIDTH/2, options.center.y - HEIGHT/2);
      var bottomRight = new paper.Point(options.center.x + WIDTH/2, options.center.y + HEIGHT/2);
      var bounds = new paper.Rectangle(topLeft, bottomRight);
      
      // Draw the outer frame
      var outer = new paper.Path.Rectangle(bounds, 20);
      outer.strokeColor = '#888';
      outer.fillColor = 'white';
      
      // Draw the screen
      var screenRectangle = new paper.Rectangle(
        new paper.Point(bounds.left + 6, bounds.top + 48),
        new paper.Point(bounds.right - 6, bounds.bottom - 70)
      );
      var screen = new paper.Path.Rectangle(screenRectangle, 2);
      screen.strokeColor = '#888';
      
      // Draw the button
      var buttonCenter = new paper.Point(options.center.x, bounds.bottom - 35);
      var button = new paper.Path.Circle(buttonCenter, 24);
      button.strokeColor = '#888';
      
      // Draw the speaker
      var speakerRectangle = new paper.Rectangle(
        new paper.Point(options.center.x - 23, bounds.top + 27),
        new paper.Point(options.center.x + 23, bounds.top + 33)
      );
      var speaker = new paper.Path.Rectangle(speakerRectangle, 3);
      speaker.strokeColor = '#888';
      
      // Draw the camera
      var cameraCenter = new paper.Point(options.center.x, bounds.top + 18);
      var camera = new paper.Path.Circle(cameraCenter, 4);
      camera.strokeColor = '#888';
      
      
      // Group the parts and flatten into a symbol
      var group = new paper.Group([
        outer,
        screen,
        button,
        camera,
        speaker
      ]);
      
      var symbol = new paper.Symbol(group);
      
      // Create an instance of the symbol
      var phone = symbol.place(options.center);
      this.path = phone;
    };

    Iphone.prototype.name = 'iPhone';
    Iphone.prototype.tags = [
      'container',
      'apple',
      'phone'
    ];
    Iphone.prototype.path = null;


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
      
      $scope.components.push({
        name: Iphone.prototype.name,
        tags: Iphone.prototype.tags,
        constructor: Iphone
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
