
module Higherframe.Data {

  export interface IReset extends ng.resource.IResource<IReset> {
    id: string,
    user: any
  }

  export interface IResetResource extends ng.resource.IResourceClass<IReset> {
    update(IReset): IReset;
  }

  export function ResetResource($resource: ng.resource.IResourceService): IResetResource {

    return <IResetResource>$resource('/api/reset/:id', { id: '@id' });
  }
}

angular
  .module('siteApp')
  .factory('Reset', Higherframe.Data.ResetResource);
