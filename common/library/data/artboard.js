var Common;
(function (Common) {
    var Data;
    (function (Data) {
        function ArtboardResource($resource) {
            var updateAction = {
                method: 'PUT',
                isArray: false
            };
            return $resource('/api/artboards/:id', { id: '@id' }, { update: updateAction });
        }
        Data.ArtboardResource = ArtboardResource;
    })(Data = Common.Data || (Common.Data = {}));
})(Common || (Common = {}));
angular
    .module('siteApp')
    .factory('Artboard', Common.Data.ArtboardResource);
//# sourceMappingURL=artboard.js.map