import {ProductSorterModel} from "./ProductSorter";

export namespace OutputSorterModel {

  export interface OutputSorter {
    destinyWarehouse: ProductSorterModel.DestinyWarehouseSorter,
    packingReference?: string,
    wayId: number
  }
}
