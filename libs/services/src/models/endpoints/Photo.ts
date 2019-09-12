export namespace PhotoModel {

  export interface Photo {
    createdAt: string,
    fileType: string,
    id: number,
    localPath: string,
    name: string,
    photosDirectory: string,
    photosFolder: string,
    updatedAt: string,
    urn: string,
  }

}
