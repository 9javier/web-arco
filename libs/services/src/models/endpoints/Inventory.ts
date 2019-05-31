import {Request} from './request';
export namespace InventoryModel {

  export interface Inventory {
    productReference?: string,
    containerReference?: string,
    warehouseId?: number
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
      }
  }

  export interface ResponseSearchInContainer extends Request.Success{
    data:{
      results:Array<SearchInContainer>;
      pagination:Request.Paginator;
    }
  }

  export interface ResponseIndex {
    data: Inventory[];
  }

  export interface ResponseStore {
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
    }
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

  export interface ErrorResponseIndex {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
