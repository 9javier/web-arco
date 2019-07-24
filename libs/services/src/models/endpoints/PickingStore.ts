import {StoresLineRequestsModel} from "./StoresLineRequests";
import {WarehouseModel} from "@suite/services";

export namespace PickingStoreModel {

  export interface ListStoresIds {
    warehouseIds: number[]
  }

  export interface PostPacking {
    packingReferences: string[]
  }

  export interface SendProcess {
    productReference: string
  }

  export interface ChangeStatus {
    status: 1|2|3,
    warehouseIds: number[]
  }

  export interface InitiatedPicking {
    status: 1|2|3,
    destinationWarehouses: WarehouseModel.Warehouse[],
    linesPending: ResponseDataLineRequestsPending
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

  export interface Pagination {
    page: number;
    limit: number;
    totalResults: number;
  }

  export interface ResponseDataLineRequestsPending {
    results: StoresLineRequestsModel.LineRequests[];
    pagination: Pagination
  }

  export interface ResponseLineRequestsPending {
    data: ResponseDataLineRequestsPending;
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponsePostPacking {
    data: any;
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseSendProcess {
    data: {
      inventory: any,
      linesRequestPending: ResponseDataLineRequestsPending
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
