'use strict';

describe('Controller: FrameCtrl', function () {

  // load the controller's module
  beforeEach(module('siteApp'));

  var FrameCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FrameCtrl = $controller('FrameCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
