export namespace BrandModel {

  export interface Brand {
    createdAt: string,
    updatedAt: string,
    id: number,
    avelonId: number,
    datasetHash: string,
    name: string,
    supplierName: string,
    providerId?: number
  }

}
