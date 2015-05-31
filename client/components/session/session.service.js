'use strict';

angular
	.module('siteApp')
  .factory('Session', function () {
    
		var _sessionId;
		
		return {
			getSessionId: function () {
				
				if (!_sessionId) {
					
					_sessionId = Math.random().toString(36).slice(2); 
				}
				
				return _sessionId;
			}
		};
  });
