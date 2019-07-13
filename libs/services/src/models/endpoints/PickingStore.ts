import {StoresLineRequestsModel} from "./StoresLineRequests";
import {WarehouseModel} from "@suite/services";

export namespace PickingStoreModel {

  export interface ListStoresIds {
    warehouseIds: number[]
  }

  export interface CheckPacking {
    packingReference: string
  }

  export interface SendProcess extends ListStoresIds {
    productReference: string,
    packingReference: string
  }

  export interface ChangeStatus {
    status: 1|2|3,
    warehouseIds: number[]
  }

  export interface InitiatedPicking {
    status: 1|2|3,
    destinationWarehouses: WarehouseModel.Warehouse[],
    linesPending: StoresLineRequestsModel.LineRequests[]
  }

  export interface ResponseInitiated {
    data: InitiatedPicking;
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseLineRequests {
    data: StoresLineRequestsModel.StoresLineRequests[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseLineRequestsPending {
    data: StoresLineRequestsModel.LineRequests[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseCheckPacking {
    data: any;
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseSendProcess {
    data: {
      inventory: any,
      linesRequestPending: StoresLineRequestsModel.LineRequests[]
    };
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseChangeStatus {
    data: any;
    message: string;
    code: number;
    errors: any;
  }

  export interface ErrorResponse {
    errors: string;
    message: string;
    code: number;
  }

}