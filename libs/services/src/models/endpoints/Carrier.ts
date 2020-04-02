import {HttpRequestModel} from "./HttpRequest";
import { CarrierModel as carrierModel } from './carrier.model';
import {Request} from "./request";
import {FiltersModel} from "@suite/services";

export namespace CarrierModel {

  export interface SearchInContainer{
    createdAt: string;
    updatedAt: string;
    id: number;
    reference: number;
    type: number,
    warehouse: any,
    products: number
  }

  export interface ResponseSearchInContainer extends Request.Success{
    data:{
      results:Array<SearchInContainer>;
      pagination:Request.Paginator;
      filters: {
        references: FiltersModel.Reference[],
        types: FiltersModel.Type[],
        origins: FiltersModel.Origin[],
        destinies: FiltersModel.Destiny[],
        products: FiltersModel.Product[],
      }
    }
  }

  export interface Carrier {
    carrierWarehousesDestiny?: any[],
    createdAt: string,
    id: number,
    packingType: number,
    reference: string,
    status: number,
    updatedAt: string,
    warehouse?: any
  }

  export interface ParamsListByWarehouse {
    warehouseId: number
  }

  export interface ParamsGenerate {
    packingType: number
  }

  export interface ParamsSeal {
    reference: string
  }

  export interface ResponseListByWarehouse {
    data: Carrier[],
    message?: string,
    errors?: any,
    code: number
  }

  export interface ResponseGenerate {
    data: Carrier,
    message?: string,
    errors?: any,
    code: number
  }

  export interface ResponseSeal extends HttpRequestModel.Response {
    data: Carrier,
    message?: string,
    errors?: any,
    code: number
  }

  export interface ParamsTransferAmongPackings {
    destiny: string,
    origin: string
  }

  export interface ResponseTransferAmongPackings extends HttpRequestModel.Response {
    message: string,
    code: number
  }

  export interface ResponseUpdateStatusInPicking {
    data: any
  }

  export interface ResponseGetPackingDestiny extends HttpRequestModel.Response {
    data: carrierModel.CarrierWarehouseDestiny
  }

  export interface ResponseGetByReference extends HttpRequestModel.Response {
    data: carrierModel.Carrier
  }
}
