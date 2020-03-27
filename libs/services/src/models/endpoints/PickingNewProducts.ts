import {ModelModel, ProductModel, SizeModel, WarehouseModel} from "@suite/services";
import {FilterPriceModel} from "./FilterPrice";
import {HttpRequestModel} from "./HttpRequest";

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
    },
    numProducts: string
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

  //region check info of received items
  export interface CheckReceivedInfo {
    hasNewProducts: boolean,
    receiveRequestedProducts: boolean
  }
  export interface ResponseCheckReceivedInfo extends HttpRequestModel.Response {
    data: CheckReceivedInfo
  }
  //endregion

  //region get received items requested
  export interface ReceivedProductsRequested {
    attended: boolean,
    product: {
      id: number,
      reference: string,
      model: {
        reference: string,
        brand: string,
        family: string,
        lifestyle: string,
        photos: {urn: string}[]
      },
      size: string
    }
  }
  export interface ResponseListReceivedProductsRequested extends HttpRequestModel.Response {
    data: ReceivedProductsRequested[]
  }
  //endregion
}
