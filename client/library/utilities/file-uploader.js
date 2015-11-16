'use strict';

/**
 * Service to upload files asynchronously
 * Requires XmlHttpRequest2
 */

angular
  .module('siteApp')
  .factory('FileUploader', [
    '$rootScope',
    '$q',
    function($rootScope, $q) {

      // Create the service
      var fileUploader = {};

      // The POST upload function
      // files: the files to be uploaded
      // data: optional JSON data to be attached
      fileUploader.post = function(files, data, progressCb) {

        // Return an object with one function, .to(url)
        // POSTs everything to the specified url.
        return {
          to: function(uploadUrl) {

            var deferred = $q.defer();

            // Ensure files are provided
            if (!files || !files.length) {

              deferred.reject('No files to upload');
              return;
            }

            // Create the XHR
            var xhr = new XMLHttpRequest();

            // When the progress on the upload changes
            xhr.upload.onprogress = function(e) {

              $rootScope.$apply (function() {

                var percentCompleted;
                if (e.lengthComputable) {

                  percentCompleted = Math.round(e.loaded / e.total * 100);

                  if (progressCb) {

                    progressCb(percentCompleted);
                  } else if (deferred.notify) {

                    deferred.notify(percentCompleted);
                  }
                }
              });
            };

            // When the file is finished uploading
            xhr.onload = function(e) {

              $rootScope.$apply (function() {

                // Trap application-level errors
                if (xhr.status >= 500) {

                  var msg = 'A server error occurred while uploading';
                  deferred.reject(msg);
                }

                else if (xhr.status >= 400) {

                  var msg = 'The server couldn\'t understand the request';
                  deferred.reject(msg);
                }

                // Successful request
                else {

                  var ret = {
                    files: files,
                    data: angular.fromJson(xhr.responseText)
                  };

                  deferred.resolve(ret);
                }
              });
            };

            // When an error occurs while uploading
            xhr.upload.onerror = function(e) {

              var ret = {
                files: files,
                error: xhr.responseText ? xhr.responseText : 'An unknown error occurred posting the file'
              };

              $rootScope.$apply (function() {

                deferred.reject(ret);
              });
            }

            // Uses the FormData API
            var formData = new FormData();

            if (data) {

              Object.keys(data).forEach(function(key) {

                formData.append(key, data[key]);
              });
            }

            // Add each file to the FormData
            for (var idx = 0; idx < files.length; idx++) {

              formData.append(files[idx].name, files[idx]);
            }

            // Start the request
            xhr.open("POST", uploadUrl);
            xhr.send(formData);

            return deferred.promise;
          }
        };
      };

      return fileUploader;
  }]);
