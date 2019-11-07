import {Request} from './request';
import {ShoesPickingModel} from "./ShoesPicking";
import {FiltersModel} from "@suite/services";
import {HttpRequestModel} from "./HttpRequest";
export namespace InventoryModel {

  export interface Picking {
    pikingId: number;
    productReference: string;
    packingReference: string;
    packingType: number;
  }

  export interface Inventory {
    productReference?: string,
    containerReference?: string,
    warehouseId?: number,
    avoidAvelonMovement?: boolean
  }

  export interface InventoryProcess {
    "createdAt": string,
    "updatedAt": string,
    "id": number,
    "typeAction": number,
    "status": number,
    "productShoeUnit": any,
    "logUser": any,
    "originWarehouse": any,
    "originRack": any,
    "originContainer": any,
    "destinationWarehouse": any,
    "destinationRack": any,
    "destinationContainer": any,
    "warehouse": any,
    "rack": any,
    "container": any
  }

  export interface SearchInContainer{
      createdAt: string;
      updatedAt: string;
      id: number;
      status: number;
      productShoeUnit: {
          id: number,
          reference: string
      },
      container: {
          id: number,
          row: number,
          column: number,
          enabled: boolean,
          reference: string,
          lock: boolean,
          on_right_side: boolean,
          items: number
      },
      warehouse: any
  }

  export interface ResponseSearchInContainer extends Request.Success{
    data:{
      results:Array<SearchInContainer>;
      pagination:Request.Paginator;
      filters: {
        colors: FiltersModel.Color[],
        containers: FiltersModel.Container[],
        models: FiltersModel.Model[],
        sizes: FiltersModel.Size[],
        warehouses: FiltersModel.Warehouse[],
        ordertypes: FiltersModel.Group[],
      }
    }
  }

  export interface ResponseFilters extends Request.Success{
    data:{
      filters: {
        colors: FiltersModel.Color[],
        containers: FiltersModel.Container[],
        models: FiltersModel.Model[],
        sizes: FiltersModel.Size[],
        warehouses: FiltersModel.Warehouse[],
        ordertypes: FiltersModel.Group[],
      }
    }
  }

  export interface ResponseIndex {
    data: Inventory[];
  }

  export interface ResponseStore extends HttpRequestModel.Response {
    data: {
      "rollback": boolean,
      "validateBody": boolean,
      "productReference": string,
      "containerReference": string,
      "warehouseId": number,
      "user": any,
      "destinationWarehouse": any,
      "destinationRack": any,
      "destinationContainer": any,
      "productShoeUnit": any,
      "logUser": any,
      "typeAction": number,
      "status": number,
      "createdAt": string,
      "updatedAt": string,
      "id": number
    };
    message: string;
    code: number;
    errors?: {
      productReference?: {
        field?: string,
        message?: string,
        type?: string
      }
    } | string
  }

  export interface ResponseProductsContainer {
    data: InventoryProcess[]
  }

  export interface ResponseShow {
    data: any[];
    message: string;
    code: number;
  }

  export interface ResponseUpdate {
    data: any;
    errors?: string;
    message: string;
    code: number;
  }

  export interface ResponseDestroy {
    data: number;
    message: string;
    code: number;
  }

  export interface ResponsePicking extends HttpRequestModel.Response {
    data?: {
      inventory?: ShoesPickingModel.ShoesPicking,
      shoePickingPending?: ShoesPickingModel.ShoesPicking[]
    };
    message: string;
    code: number;
  }

  export interface ParamsCheckContainer {
    containerReference: string,
    inventoryId: number
  }

  export interface ResponseCheckContainer extends HttpRequestModel.Response {
    data?: {
      containerReference: string,
      inventory: Inventory
    };
    errors?: string;
    message: string;
    code: number;
  }

  export interface ErrorResponseIndex {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }

  export interface ErrorResponse {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }

  // To global process that move products between containers/warehouses
  export interface Origin {
    warehouseId: number,
    rackId?: number,
    row?: number,
    column?: number,
    containerId?: number,
    containerReference?: string
  }
  export interface Destination {
    warehouseId: number,
    rackId?: number,
    row?: number,
    column?: number,
    containerId?: number,
    containerReference?: string
  }
  export interface InventoryProcessGlobal {
    origin: Origin,
    destination: Destination
  }
  export interface ResponseGlobal {
    data?: any;
    errors?: string;
    message: string;
    code: number;
  }
}
