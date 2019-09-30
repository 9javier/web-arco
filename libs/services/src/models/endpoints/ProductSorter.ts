export namespace ProductSorterModel {

  export interface ModelSorter {
    reference: string
  }

  export interface DestinyWarehouseSorter {
    reference: string,
    name: string
  }

  export interface SizeSorter {
    name: string
  }

  export interface ProductSorter {
    reference: string,
    model?: ModelSorter,
    destinyWarehouse?: DestinyWarehouseSorter,
    size?: SizeSorter
  }
}
