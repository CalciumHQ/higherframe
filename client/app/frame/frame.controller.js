'use strict';

angular
  .module('siteApp')
  .controller('FrameCtrl', function ($scope) {

    $scope.components = [
      {
        name: 'iPhone',
        tags: [
          'container',
          'apple',
          'screen'
        ]
      },
      {
        name: 'iMac',
        tags: [
          'container',
          'apple',
          'screen'
        ]
      },
      {
        name: 'Generic monitor',
        tags: [
          'container',
          'screen'
        ]
      }
    ];
  });
