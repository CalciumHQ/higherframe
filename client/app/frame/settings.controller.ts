'use strict';

module Higherframe.Controllers {

  export class FrameSettings {

    errors = {};
    frame: Array<any>;
    organisations: Array<any>;

    constructor(frame, private $scope: ng.IScope, private $http: ng.IHttpService) {

      this.frame = frame;

      $http
        .get(`/api/organisations`)
        .success((response: Array<any>) => {

          this.organisations = response;
        });
    }

    submit(form) {

      if (form.$valid) {


      }
    };
  }
}

angular
  .module('siteApp')
  .controller('FrameSettingsCtrl', Higherframe.Controllers.FrameSettings);
