
module Higherframe.UI {

  export interface ImageScope extends ng.IScope {
    ngModel: ng.INgModelController,
    element: ng.IAugmentedJQuery
  };

  export class ImageController {

    //
    src: string;

    constructor(
      private $scope: ImageScope,
      private $http: ng.IHttpService,
      private Media: Higherframe.Data.IMediaResource
    ) {

      this.registerWatches();
    }

    registerWatches() {

      this.$scope.$watchCollection(() => this.$scope.ngModel, (ngModel) => {

        this.initModel(ngModel);
      });
    }

    initModel(ngModel) {

      // Initialise the preview with an existing value
      this.src = ngModel.$modelValue;
    }


    /**
     * Event handlers
     */

    onRemoveClick() {

      this.$scope.ngModel.$setViewValue(null);
    }

    onChangeClick() {

      var file = this.$scope.element.children().eq(0);

      file.trigger('click');
    }

    onFileChange(files) {

      var file = files[0];
      var reader = new FileReader();

      reader.onload = (e: ProgressEvent) => {

        this.$scope.$apply(() => {

          // this.$scope.ngModel.$setViewValue((<FileReader>e.target).result);
          this.src = (<FileReader>e.target).result;

          // Upload the file
          this.Media.create(file)
          .then((media) => this.onFileChangeSuccess.call(this, media))
          .catch((error) => this.onFileChangeError.call(this, error));
        });
      };

      reader.readAsDataURL(file);
    }

    onFileChangeSuccess(media: Higherframe.Data.IMedia) {

      this.$scope.ngModel.$setViewValue(media.original);
    }

    onFileChangeError(error) {

      console.log(error);
    }
  }

  export class Image implements ng.IDirective {

    // Directive configuration
    link: (scope: AutocompleteScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
    restrict = 'E';
    replace = true;
    require = 'ngModel';
    templateUrl = '/components/ui/forms/image.html';
    controller = ImageController;
    controllerAs = 'Ctrl';

    constructor(private $http: ng.IHttpService) {

      Image.prototype.link = (scope: ImageScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

        scope.ngModel = ngModel;
        scope.element = element;
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = ($http: ng.IHttpService) => new Image($http);
      directive.$inject = ['$http'];
      return directive;
    }
  }
}

angular
  .module('siteApp')
  .directive('uiImage', Higherframe.UI.Image.factory());
