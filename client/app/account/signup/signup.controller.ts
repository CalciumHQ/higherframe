

module Higherframe.Controllers {

  export class Signup {

    public submitted: boolean = false;
    public user: any = {};
    public errors: any = {};

    public nameFocus = true;
    public emailAddressFocus = false;
    public passwordFocus = false;

    constructor(
      private $scope: ng.IScope,
      private Auth,
      private $location,
      private $state,
      private $window,
      private $mixpanel
    ) {}

    private register(form) {

      this.submitted = true;

      if(form.$valid) {

        this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          password: this.user.password
        })
        .then((user) => {

          // Register event
          this.$mixpanel.track('User signup', {
            'User Id': user._id
          });

          // Account created, redirect to home
          this.$location.path('/');
        })
        .catch((err) => {

          err = err.data;
          this.errors = {};

          // Update validity of form fields that match the mongoose errors
          err.errors.forEach((error, field) => {

            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
      }
    }

    public loginOauth(provider) {

      this.$window.location.href = '/auth/' + provider;
    }
  }
}

angular
  .module('siteApp')
  .controller('SignupCtrl', Higherframe.Controllers.Signup);
