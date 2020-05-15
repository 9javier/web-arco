import {UserModel} from "./User";
import {WarehouseModel} from "./Warehouse";
import {CarrierModel} from "./Carrier";
import {BrandModel} from "./Brand";
import User = UserModel.User;
import Warehouse = WarehouseModel.Warehouse;
import Carrier = CarrierModel.Carrier;
import Brand = BrandModel.Brand;

export namespace ReturnModel{

  export interface Return {
    id: number,
    type: any,
    provider: any,
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
    printTagPackages: boolean
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

}
