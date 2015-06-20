'use strict';

angular
	.module('siteApp')
	.filter('moment', function () {
		
		return function (input) {
			
			return moment(input);
		}
	});