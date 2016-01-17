
module Higherframe.Data {

  export interface IProject extends ng.resource.IResource<IProject> {
    _id: string,
    owner: Common.Data.IUser,
    name: any,
    frames: Array<Higherframe.Data.IFrame>
  }

  export interface IProjectResource extends ng.resource.IResourceClass<IProject> {
    update(IProject): IProject;
  }

  export function ProjectResource($resource: ng.resource.IResourceService): IProjectResource {

    return <IProjectResource>$resource('/api/projects/:id', { id: '@id' });
  }
}

angular
  .module('siteApp')
  .factory('Project', Higherframe.Data.ProjectResource);
