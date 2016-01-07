
module Higherframe.Data {

  export interface IArtboard extends ng.resource.IResource<IArtboard> {
    id: string,
    name: string,
    width: number,
    height: number,
    left: number,
    top: number
  }

  export interface IArtboardResource extends ng.resource.IResourceClass<IArtboard> {
    update(IArtboard): IArtboard;
  }

  export function ArtboardResource($resource: ng.resource.IResourceService): IArtboardResource {

    var updateAction: ng.resource.IActionDescriptor = {
      method: 'PUT',
      isArray: false
    };

    return <IArtboardResource>$resource('/api/artboards/:id', { id: '@id' }, { update: updateAction });
  }
}

angular
  .module('siteApp')
  .factory('Artboard', Higherframe.Data.ArtboardResource);
