declare module Common.Data {
    interface IArtboard extends ng.resource.IResource<IArtboard> {
        id: string;
        name: string;
        width: number;
        height: number;
        left: number;
        top: number;
    }
    interface IArtboardResource extends ng.resource.IResourceClass<IArtboard> {
        update(IArtboard: any): IArtboard;
    }
    function ArtboardResource($resource: ng.resource.IResourceService): IArtboardResource;
}
