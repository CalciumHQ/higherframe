
module Common.Data {

  export interface IMedia extends ng.resource.IResource<IMedia> {
    _id: string,
    created_at: string,
    updated_at: string,
    user: any,
    original: string
  }

  export interface IMediaResource extends ng.resource.IResourceClass<IMedia> {
    create(file: File): ng.IPromise<IMedia>;
  }

  export function MediaResource($resource: ng.resource.IResourceService, $q: ng.IQService, $http: ng.IHttpService, FileUploader): IMediaResource {

    var MediaResource = <IMediaResource>$resource('/api/media/:id', { id: '@id' }, { });

    MediaResource.create = (file: File): ng.IPromise<IMedia> => {

      return new $q((resolve, reject) => {

        FileUploader.post([file])
          .to('/api/media')
          .then((response) => {

            var resource = new MediaResource(response.data);
            resolve(resource);
          }, (error) => {

            reject(error);
          });
      });
    };

    return MediaResource;
  }
}

angular
  .module('siteApp')
  .factory('Media', Common.Data.MediaResource);
