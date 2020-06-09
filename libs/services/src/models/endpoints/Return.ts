import {UserModel} from "./User";
import {WarehouseModel} from "./Warehouse";
import {CarrierModel} from "./Carrier";
import {BrandModel} from "./Brand";
import {ReturnTypeModel} from "./ReturnType";
import {ProviderModel} from "./Provider";
import User = UserModel.User;
import Warehouse = WarehouseModel.Warehouse;
import Carrier = CarrierModel.Carrier;
import Brand = BrandModel.Brand;
import ReturnType = ReturnTypeModel.ReturnType;
import Provider = ProviderModel.Provider;
import { ModelModel, ProductModel, SizeModel} from "@suite/services";
import Product = ProductModel.Product;
import Model = ModelModel.Model;
import Size = SizeModel.Size;
import {ShoesPickingModel} from "./ShoesPicking";
import Inventory = ShoesPickingModel.Inventory;
import {HttpRequestModel} from "./HttpRequest";
import {DefectiveRegistryModel} from "./DefectiveRegistry";
import DefectiveRegistry = DefectiveRegistryModel.DefectiveRegistry;

export namespace ReturnModel{

  export interface Return {
    id: number,
    type: ReturnType,
    provider: Provider,
    brands: Brand[],
    dateLimit: string,
    warehouse: Warehouse,
    status: number,
    dateLastStatus: string,
    userLastStatus: User,
    unitsSelected: number,
    unitsPrepared: number,
    history: boolean,
    dateReturnBefore: string,
    email: string,
    observations: string,
    operatorObservations: string,
    lastStatus: number,
    user: User,
    packings: ReturnPacking[],
    amountPackages: number,
    shipper: string,
    datePredictedPickup: string,
    datePickup: string,
    printTagPackages: boolean,
    products?: ReturnProduct[],
    archives?: Files[],
    delivery_notes?: (any)[],
  }

  export interface Files {
    id: number,
    originalName: string,
    mimetype: string,
    fileName: string,
    pathOriginal: string,
    pathMedium: string,
    pathIcon: string,
    locationOriginal: string,
    locationMedium: string,
    locationIcon: string,
    size: number,
    hash: string,
    extension: string
  }

  export interface ReturnPacking {
    id: number,
    return: Return,
    packing: Carrier,
  }

  export interface ReturnProduct {
    id: number,
    returnManufacturer: Return,
    product: Product,
    model: Model,
    size: Size,
    status: number,
    inventory: Inventory,
    defect: DefectiveRegistry
  }

  export interface SearchParameters {
    filters: Filters,
    order: Order,
    pagination: Pagination,
    isAl?: boolean
  }

  export interface SearchResponse {
    message?: string,
    code?: number,
    data?: {
      result: Return[],
      count: number
    },
    error?: any,
    errors?: any
  }

  export interface FilterOptionsResponse {
    message?: string,
    code?: number,
    data?: {
      ids: number[],
      types: string[],
      providers: string[],
      brands: string[],
      datesReturnBefore: string[],
      warehouses: string[],
      statuses: number[],
      datesLastStatus: string[],
      usersLastStatus: string[],
      unitsPrepared: number[],
      unitsSelected: number[]
    },
    error?: any,
    errors?: any
  }

  export interface SaveResponse {
    message?: string,
    code?: number,
    data?: any,
    error?: any,
    errors?: any
  }

  export interface LoadResponse {
    message?: string,
    code?: number,
    data?: Return,
    error?: any,
    errors?: any
  }

  export interface OptionsResponse {
    message?: string,
    code?: number,
    data?: {
      types: any[],
      warehouses: Warehouse[],
      providers: any[]
    },
    error?: any,
    errors?: any
  }

  export interface Filters {
    ids: number[],
    typeIds?: number[],
    providerIds: number[],
    brandIds?: number[],
    datesLimit: Date[],
    warehouseIds: number[],
    statuses: number[],
    datesLastStatus?: Date[],
    userIdsLastStatus?: number[],
    unitsPrepared: number[],
    unitsSelected?: number[]
  }

  export interface Order {
    field: string,
    direction: 'ASC'|'DESC'
  }

  export interface Pagination {
    limit: number,
    page: number
  }

  export interface FilterOption {
    id: any,
    value: any,
    checked: boolean,
    hide: boolean
  }

  export interface FilterOptions {
    ids: FilterOption[],
    typeIds: FilterOption[],
    providerIds: FilterOption[],
    brandIds: FilterOption[],
    datesLimit: FilterOption[],
    warehouseIds: FilterOption[],
    statuses: FilterOption[],
    datesLastStatus: FilterOption[],
    userIdsLastStatus: FilterOption[],
    unitsPrepared: FilterOption[]
  }

  export interface GetProductsParams {
    warehouse: number,
    provider: number,
    brands: number[],
    filters: any
  }
  export interface GetDefectiveProductsResults {
    assigned: boolean,
    remove: boolean,
    product: {
      id: number,
      reference: string,
      brand: {
        id: number,
        name: string
      },
      provider: {
        id: number,
        name: string
      },
      commercial: {
        id: number,
        name: string
      },
      model: {
        id: number,
        name: string,
        reference: string
      },
      size: {
        id: number,
        number: string,
        reference: string
      }
    },
    defective: {
      reason: string
    }
  }
  export interface GetDefectiveProducts {
    products: {
      results: GetDefectiveProductsResults[]
    },
    count: number,
    productsByBrand: {
      id: number,
      name: string,
      quantity: number
    }[],
    productsByProvider: {
      id: number,
      name: string,
      quantity: number
    }[]
  }
  export interface GetProducts {
    selected: boolean
    unities: number,
    maxUnities: number,
    unitiesAssigned: number,
    remove: boolean,
    brand: {
      id: number,
      name: string
    },
    provider: {
      id: number,
      name: string
    },
    commercial: {
      id: number,
      name: string
    },
    model: {
      id: number,
      name: string,
      reference: string
    },
    size: {
      id: number,
      number: string,
      reference: string
    }
  }
  export interface GetDefectiveProductsResponse extends HttpRequestModel.Response {
    data: GetDefectiveProducts
  }
  export interface GetProductsResponse extends HttpRequestModel.Response {
    data: {
      results: GetProducts[],
      count: number
    }
  }

  export interface GetProductsFiltersParams {
    warehouse: number,
    provider: number,
    brands: number[]
  }
  export interface GetDefectiveProductsFilters {
    products: {id: number, value: string, name: string}[],
    brands: {id: number, value: string, name: string}[],
    modelReferences: {id: number, value: string, name: string}[],
    modelNames: {id: number, value: string, name: string}[],
    commercials: {id: number, value: string, name: string}[],
    sizes: {id: number, value: string, name: string}[]
  }
  export interface GetProductsFilters {
    brands: {id: number, value: string, name: string}[],
    modelReferences: {id: number, value: string, name: string}[],
    modelNames: {id: number, value: string, name: string}[],
    commercials: {id: number, value: string, name: string}[],
    sizes: {id: number, value: string, name: string}[]
  }
  export interface GetDefectiveProductsFiltersResponse extends HttpRequestModel.Response {
    data: GetDefectiveProductsFilters
  }
  export interface GetProductsFiltersResponse extends HttpRequestModel.Response {
    data: GetProductsFilters
  }

  export interface AssignDefectiveProductsParams {
    returnId: number,
    itemsToReturn: {
      product: number
    }[]
  }
  export interface AssignProductsParams {
    returnId: number,
    itemsToReturn: {
      model: number,
      size: number,
      unities: number,
      remove: boolean
    }[]
  }
  export interface AssignDefectiveProductsResponse extends HttpRequestModel.Response {

  }
  export interface AssignProductsResponse extends HttpRequestModel.Response {

  }

  export interface CheckProductsToAssignReturnParams {
    returnId: number,
    warehouse: number,
    provider: number,
    brands: number[],
    defective: boolean
  }
  export interface CheckProductsToAssignReturnResponse extends HttpRequestModel.Response {
    data: { available_products: boolean }
  }

  export interface AssignedProductsGrouped {
    model: string,
    size: number,
    quantity: number
  }
  export interface AssignedProductsGroupedResponse extends HttpRequestModel.Response {
    data: { items: AssignedProductsGrouped[] }
  }

  export interface AvailableProductsGroupedParams {
    warehouse: number,
    defective: boolean
  }
  export interface AvailableProductsGrouped {
    name: string,
    brands: {name: string, unities: number}[]
  }
  export interface AvailableProductsGroupedResponse extends HttpRequestModel.Response {
    data: { available_products: AvailableProductsGrouped[] }
  }

  export enum Status {
    RETURN_ORDER = 1,
    IN_PROCESS = 3,
    PREPARED = 4,
    PENDING_PICKUP = 5,
    PICKED_UP = 6,
    BILLED = 7,
    UNKNOWN = 8,
  }
  export const StatusNames = [
    {id: Status.RETURN_ORDER, name: 'Orden devolución'},
    {id: Status.IN_PROCESS, name: 'En proceso'},
    {id: Status.PREPARED, name: 'Preparado'},
    {id: Status.PENDING_PICKUP, name: 'Pendiente recogida'},
    {id: Status.PICKED_UP, name: 'Recogido'},
    {id: Status.BILLED, name: 'Facturado'},
    {id: Status.UNKNOWN, name: 'Desconocido'}
  ]
}
