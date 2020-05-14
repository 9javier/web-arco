export namespace PackageSorterModel {

  export interface ModelSorter {
    reference: string,
    name?: string
  }

  export interface DestinyWarehouseSorter {
    reference: string,
    name: string,
    id: number
  }

  export interface SizeSorter {
    name: string
  }

  export interface ProductIdSorter {
    id: number
  }

  export interface ProductSorter {
    uniqueCode: string,
    model?: ModelSorter,
    destinyWarehouse?: DestinyWarehouseSorter,
    size?: SizeSorter,
    product: ProductIdSorter,
  }
}
