
module Higherframe.UI {

	export interface ISliderScope extends ng.IScope {
		Ctrl: SliderController,
		sliderConfig: Object
	}

	export class SliderController {

		private defaults = {
			floor: 0,
			ceil: 100,
			step: 1,
			onStart: angular.noop,
			onChange: angular.noop,
			onEnd: angular.noop
		}

		private options: {
			floor: number,
			ceil: number,
			step: number,
			onStart: Function,
			onChange: Function,
			onEnd: Function
		};

		private element: ng.IAugmentedJQuery;
		private handleElement: ng.IAugmentedJQuery;
		private ngModel: ng.INgModelController;

		constructor(private $scope: ISliderScope, private $document: ng.IDocumentService) {

			this.$scope.sliderConfig = this.$scope.sliderConfig || {};
			this.options = angular.extend(this.defaults, this.$scope.sliderConfig);
		}

		init(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) {

			this.initElement(element);
			this.initModel(ngModel);
			this.initEvents();
		}

		initElement(element: ng.IAugmentedJQuery) {

			this.element = element;
			this.handleElement = element.find('.ui-slider-handle');
		}

		initModel(ngModel: ng.INgModelController) {

			this.ngModel = ngModel;
			this.ngModel.$render = this.render.bind(this);
			this.ngModel.$render();
		}

		initEvents() {

			this.handleElement.on('mousedown', this.onHandleMouseDown.bind(this));
		}

		startDrag(e) {

			let body = this.$document.find('body');
			body.on('mousemove', this.onHandleMouseMove.bind(this));
			body.on('mouseup', this.onHandleMouseUp.bind(this));

			e.preventDefault();

			this.element.trigger('dragstart', this.ngModel.$viewValue);
		}

		updateDrag(e) {

			let offset = this.element.offset();
			let position = (e.clientX - offset.left) / this.element.width();
			let value = this.options.floor + position * (this.options.ceil - this.options.floor);
			let processed = this.processValue(value);
			this.ngModel.$setViewValue(processed);
			this.ngModel.$render();

			this.element.trigger('dragchange', this.ngModel.$viewValue);
		}

		endDrag(e) {

			let body = this.$document.find('body');
			body.off('mousemove');
			body.off('mouseup');

			this.element.trigger('dragend', this.ngModel.$viewValue);
		}

		processValue(value) {

			return Math.round(Math.max(this.options.floor, Math.min(this.options.ceil, value)) / this.options.step) * this.options.step;
		}

		render() {

			let position = (this.processValue(this.ngModel.$viewValue) - this.options.floor) / (this.options.ceil - this.options.floor) * 100;
			this.handleElement.css('left', `${position}%`);
		}

		onHandleMouseDown(e) {

			this.startDrag(e);
		}

		onHandleMouseMove(e) {

			this.updateDrag(e);
		}

		onHandleMouseUp(e) {

			this.endDrag(e);
		}
	}

	export class Slider implements ng.IDirective {

		// Directive configuration
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
		restrict = 'E';
		scope = {
			sliderConfig: '='
		};
		require = 'ngModel';
		controller = SliderController;
		controllerAs = 'Ctrl';
		templateUrl = '/components/ui/slider/slider.html';
		replace = true;

		constructor() {

			Slider.prototype.link = (scope: ISliderScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

				scope.Ctrl.init(element, attrs, ngModel);
			}
		}

		static factory(): ng.IDirectiveFactory {

      const directive = () => new Slider();
      directive.$inject = [];
      return directive;
    }
	}
}

angular
	.module('siteApp')
	.directive('uiSlider', Higherframe.UI.Slider.factory());
