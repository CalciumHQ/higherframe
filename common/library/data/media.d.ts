declare module Common.Data {
    interface IMedia extends ng.resource.IResource<IMedia> {
        _id: string;
        created_at: string;
        updated_at: string;
        user: any;
        original: string;
    }
    interface IMediaResource extends ng.resource.IResourceClass<IMedia> {
        create(file: File): ng.IPromise<IMedia>;
    }
    function MediaResource($resource: ng.resource.IResourceService, $q: ng.IQService, $http: ng.IHttpService, FileUploader: any): IMediaResource;
}
