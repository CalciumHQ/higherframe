
module Higherframe.UI {

  export interface ImageScope extends ng.IScope {
    Ctrl: ImageController
  };

  export class ImageController {

    // Directive
    element: ng.IAugmentedJQuery;
    ngModel: ng.INgModelController;
    attrs: ng.IAttributes;

    // View variables
    src: string;

    constructor(
      private $scope: ImageScope,
      private $http: ng.IHttpService,
      private $parse: ng.IParseService,
      private Media: Common.Data.IMediaResource
    ) {}

    init(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) {

      this.initElement(element);
      this.initModel(ngModel);
      this.initAttributes(attrs);
    }

    private initModel(ngModel: ng.INgModelController) {

      // Initialise the preview with an existing value
      this.ngModel = ngModel;

      this.$scope.$watch(() => this.ngModel.$modelValue, () => {

        if (!this.ngModel.$modelValue) {

          return;
        }

        this.src = this.ngModel.$modelValue.thumbnail;
      });
    }

    private initElement(element: ng.IAugmentedJQuery) {

      this.element = element;
    }

    private initAttributes(attrs: ng.IAttributes) {

      this.attrs = attrs;
    }


    /**
     * Event handlers
     */

    onRemoveClick() {

      this.ngModel.$setViewValue(null);
    }

    onChangeClick() {

      let file = this.element.children().eq(0);

      file.trigger('click');
    }

    onFileChange(files) {

      var file = files[0];
      var reader = new FileReader();

      reader.onload = (e: ProgressEvent) => {

        this.$scope.$apply(() => {

          this.src = (<FileReader>e.target).result;

          // Upload the file
          this.Media.create(file)
          .then((media) => this.onFileChangeSuccess.call(this, media))
          .catch((error) => this.onFileChangeError.call(this, error));
        });
      };

      reader.readAsDataURL(file);
    }

    onFileChangeSuccess(media: Common.Data.IMedia) {

      this.ngModel.$setViewValue(media);

      // Call the provided change handler
      var attrHandler = this.$parse(this.attrs['uiImageChange']);
      attrHandler(this.$scope, { media: media });
    }

    onFileChangeError(error) {

      console.log(error);
    }
  }

  export class Image implements ng.IDirective {

    // Directive configuration
    link: (scope: ImageScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
    restrict = 'E';
    replace = true;
    require = 'ngModel';
    templateUrl = '/components/ui/forms/image.html';
    controller = ImageController;
    controllerAs = 'Ctrl';

    constructor(private $http: ng.IHttpService) {

      Image.prototype.link = (scope: ImageScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

        scope.Ctrl.init(element, attrs, ngModel);
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
