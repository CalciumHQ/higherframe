'use strict';

angular
  .module('siteApp')
  .controller('FrameCtrl', function ($scope) {

    $scope.components = [
      {
        name: 'Rectangle',
        tags: [
          'shape',
          'basic'
        ],
        draw: function (paper) {

          var rectangle = new Rectangle(new Point(100, 200), new Point(200, 300));
          var path = new Path.Rectangle(rectangle);
          path.strokeColor = '#888';
          path.fillColor = 'white';
        }
      },
      {
        name: 'Circle',
        tags: [
          'shape',
          'basic'
        ],
        draw: function (paper) {

          var center = new Point(100, 200);
          var path = new Path.Circle(center, 50);
          path.strokeColor = '#888';
          path.fillColor = 'white';
        }
      },
      {
        name: 'Triangle',
        tags: [
          'shape',
          'basic'
        ],
        draw: function (paper) {

          var center = new Point(100, 200);
          var path = new Path.RegularPolygon(center, 3, 50);
          path.strokeColor = '#888';
          path.fillColor = 'white';
        }
      },
      {
        name: 'iPhone',
        tags: [
          'container',
          'apple',
          'screen'
        ],
        draw: function (paper) {

        }
      },
      {
        name: 'iMac',
        tags: [
          'container',
          'apple',
          'screen'
        ],
        draw: function (paper) {

        }
      },
      {
        name: 'Generic monitor',
        tags: [
          'container',
          'screen'
        ],
        draw: function (paper) {

        }
      }
    ];

    $scope.wireframe = {

    };

    $scope.onComponentClick = function (component) {

      component.draw(paper);
    };
    
  });
