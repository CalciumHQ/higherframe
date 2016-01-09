var Common;
(function (Common) {
    var Data;
    (function (Data) {
        function MediaResource($resource, $q, $http, FileUploader) {
            var MediaResource = $resource('/api/media/:id', { id: '@id' }, {});
            MediaResource.create = function (file) {
                return new $q(function (resolve, reject) {
                    FileUploader.post([file])
                        .to('/api/media')
                        .then(function (response) {
                        var resource = new MediaResource(response.data);
                        resolve(resource);
                    }, function (error) {
                        reject(error);
                    });
                });
            };
            return MediaResource;
        }
        Data.MediaResource = MediaResource;
    })(Data = Common.Data || (Common.Data = {}));
})(Common || (Common = {}));
angular
    .module('siteApp')
    .factory('Media', Common.Data.MediaResource);
//# sourceMappingURL=media.js.map