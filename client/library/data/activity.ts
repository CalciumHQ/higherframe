
module Higherframe.Data {

  export interface IActivity extends ng.resource.IResource<IActivity> {
    id: string,
    type: string
  }

  export interface IActivityResource extends ng.resource.IResourceClass<IActivity> {
    update(IActivity): IActivity;
  }

  export function ActivityResource($resource: ng.resource.IResourceService): IActivityResource {

    var updateAction: ng.resource.IActionDescriptor = {
      method: 'PUT',
      isArray: false
    };

    return <IActivityResource>$resource('/api/activity/:id', { id: '@id' }, { update: updateAction });
  }
}

angular
  .module('siteApp')
  .factory('Activity', Higherframe.Data.ActivityResource);
