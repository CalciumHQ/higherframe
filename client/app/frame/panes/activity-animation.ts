
module Higherframe.Controllers.Frame {

  export class ActivityEntryAnimation {

    constructor($timeout) {

      return {

        // When a new activity is inserted
        enter: (element, done) => {

          element.addClass('inserting');

          // Measure the activity element
          element.addClass('measuring');
          var bounds = element[0].getBoundingClientRect();
          element.removeClass('measuring');

          // Reveal the element
          element.addClass('revealing');

          $timeout(() => {

            element.css('height', bounds.height);
            element.addClass('revealing-active');
          });

          $timeout(() => {

            element.addClass('fade-in');
          }, 200);

          $timeout(() => {

            element
              .removeClass('fade-in')
              .removeClass('revealing')
              .removeClass('inserting')
              .css('height', 'auto');
          }, 500);
        }
      };
    }
  }
}

angular
  .module('siteApp')
  .animation('.activity-block', Higherframe.Controllers.Frame.ActivityEntryAnimation);
