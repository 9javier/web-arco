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
    lastStatus: number,
    user: User,
    packings: Carrier[],
    amountPackages: number,
    shipper: string,
    datePredictedPickup: string,
    datePickup: string,
    printTagPackages: boolean,
    archives?: (any)[],
    delivery_notes?: (any)[],
  }

  export interface SearchParameters {
    filters: Filters,
    order: Order,
    pagination: Pagination
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
      datesLimit: string[],
      warehouses: string[],
      statuses: number[],
      datesLastStatus: string[],
      usersLastStatus: string[],
      unitsPrepared: number[],
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
    typeIds: number[],
    providerIds: number[],
    brandIds: number[],
    datesLimit: Date[],
    warehouseIds: number[],
    statuses: number[],
    datesLastStatus: Date[],
    userIdsLastStatus: number[],
    unitsPrepared: number[]
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


}
