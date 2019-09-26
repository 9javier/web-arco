import {ModelModel, ProductModel, SizeModel, WarehouseModel} from "@suite/services";
import {FilterPriceModel} from "./FilterPrice";

export namespace PickingNewProductsModel {

  export interface ProductReceivedBase {
    createdAt: string,
    updatedAt: string,
    id: number,
    tariffId: number,
    pickingId: number,
    numRange: number,
    model: ModelModel.Model,
    productShoesUnit: ProductModel.ProductShoesUnit
  }

  export interface ProductReceived extends ProductReceivedBase {
    warehouse: WarehouseModel.Warehouse,
    size: SizeModel.Size,
  }

  export interface ParamsGetByWarehouseIdPickingId {
    pickingId?: number,
    warehouseId?: number
  }

  export interface ResponseGetByWarehouseIdPickingId {
    data: ProductReceived[];
    message: string;
    code: number;
    errors: any;
  }

  //region Search of products received with filters
  export interface ProductReceivedSearched extends ProductReceivedBase {
    filterPriceId: number,
    packingId: number,
    filterPrice: FilterPriceModel.FilterPrice,
    rangesNumbers: {
      sizeRangeNumberMin: string,
      sizeRangeNumberMax: string
    }
  }

  export interface ParamsSearch {
    storeReceptionIds: Array<number>,
    sizes: Array<number|string>,
    models: Array<number|string>,
    dates: Array<string>,
    colors: Array<number|string>,
    pagination: {
      page: number,
      limit: number
    },
    orderby: {
      type: number,
      order: string
    },
    hideImpress: boolean
  }

  export interface Search {
    pagination: {
      page: number,
      limit: number,
      totalResults: number
    },
    results: Array<ProductReceivedSearched>
  }

  export interface ResponseSearch {
    data: Search
  }
  //endregion

}
