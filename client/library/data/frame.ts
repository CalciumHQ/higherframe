
module Higherframe.Data {

  export interface IFrame extends ng.resource.IResource<IFrame> {
    _id: string,
    name: string,
    created_at: string,
    updated_at: string,
    project: Higherframe.Data.IProject,
    users: Array<any>,
    collaborators: Array<any>,
    components: Array<any>
  }

  export interface IFrameResource extends ng.resource.IResourceClass<IFrame> {

  }

  export function FrameResource($resource: ng.resource.IResourceService): IFrameResource {

    return <IFrameResource>$resource('/api/frame/:id', { id: '@id' }, { });
  }
}

angular
  .module('siteApp')
  .factory('Frame', Higherframe.Data.FrameResource);
