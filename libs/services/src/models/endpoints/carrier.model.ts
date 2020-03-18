import { Request } from './request';
import { WarehouseModel } from './Warehouse';
import {HttpRequestModel} from "./HttpRequest";
import {FiltersModel} from "@suite/services";

export namespace CarrierModel{

    export interface SearchInContainer{
      createdAt: string;
      updatedAt: string;
      id: number;
      status: number;
      reference: number;
      type: number,
      warehouse: any,
      products: number
    }

    export interface ResponseFilters extends Request.Success{
      data:{
        filters: {
          references: FiltersModel.Reference[],
          types: FiltersModel.Type[],
          origins: FiltersModel.Origin[],
          destinies: FiltersModel.Destiny[],
          products: FiltersModel.Product[],
        }
      }
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

    export interface CarrierWarehouseDestiny{
        id:number;
        createAt:string;
        updateAt:string;
        warehouse:WarehouseModel.Warehouse;
        carrier: CarrierModel.Carrier
    }

    export interface CarrierHistory{
      id:number;
      createAt:string;
      updateAt:string;
      warehouse:WarehouseModel.Warehouse;
      carrier: CarrierModel.Carrier
  }
    export interface Carrier{
        createdAt: string;
        updatedAt: string;
        id: number;
        reference: string;
        status: number;
        packingType: number[];
        warehouse: WarehouseModel.Warehouse;
        carrierWarehousesDestiny:CarrierWarehouseDestiny[];
        packingInventorys: any[]
    }

    export interface CarrierResponse extends Request.Success{
        data:Array<Carrier>;
    }

    export interface SingleCarrierResponse extends Request.Success{
        data:Carrier
    }

    export interface CarrierWarehouseDestinyResponse extends Request.Success{
        data:CarrierWarehouseDestiny
    }

    // Check packing-products destiny
    export interface ParamsCheckProductsDestiny {
      packingId: number,
      warehouseDestinyId: number
    }
    export interface CheckProductsDestiny {
      someProductWithDifferentDestiny: boolean
    }
    export interface ResponseCheckProductsDestiny extends HttpRequestModel.Response {
      data: CheckProductsDestiny
    }

    // Check packing-products destiny
    export interface ParamsCheckPackingAvailability {
      packingReference: string,
      destinyReference?: string,
      forIncidences?: boolean
    }
    export interface CheckPackingAvailability {
      someProductWithDifferentDestiny: boolean
    }
    export interface ResponseCheckPackingAvailability extends HttpRequestModel.Response {
      data: CheckPackingAvailability
    }
    export interface HistoryModal extends HttpRequestModel.Response {
      createdAt: Date,
      updatedAt: Date,
      id: number,
      typeAction: number,
            carrier: {
              createdAt : Date,
              updatedAt : Date,
              id: number,
              reference: String,
              status: number,
              packingType : number,
              assigned_to_incidences: false
            },
            warehouse: {
                id: Number,
                name: String,
                description: String,
                reference: String,
                is_store: true,
                is_main: true,
                has_racks: true,
                is_outlet: false,
                prefix_container: String,
                packingType: Number
            }
    }
}
