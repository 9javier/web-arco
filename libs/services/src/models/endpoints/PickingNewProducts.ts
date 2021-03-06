import {FiltersModel, ModelModel, ProductModel, SizeModel, WarehouseModel} from "@suite/services";
import {FilterPriceModel} from "./FilterPrice";
import {HttpRequestModel} from "./HttpRequest";
import {Request} from "./request";

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

  export interface ProductReceivedSearch extends Request.Success {
      id: number,
      attended: boolean,
      date: string,
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

  export interface NoOnlineSearchParameters {
    warehouseId?: number,
    pagination: {
      page: number,
      limit: number
    },
    modelIds: number[],
    brandIds: number[],
    colorIds: number[],
    sizeIds: number[],
    orderBy: {
      type: number,
      order: string
    }
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
      results: Array<ProductReceivedSearch>
      pagination:Request.Paginator;
      filters: {
        brands: FiltersModel.Brand[],
        colors: FiltersModel.Color[],
        references: FiltersModel.Reference[],
        dates: FiltersModel.Date[],
        families: FiltersModel.Family[],
        models: FiltersModel.Model[],
        sizes: FiltersModel.Size[],
        lifestyles: FiltersModel.Lifestyle[],
        ordertypes: FiltersModel.Group[],
      }
  }
  export interface ResponseListReceivedProductsRequested extends HttpRequestModel.Response {
    data: ReceivedProductsRequested[]
  }
  //endregion
}
