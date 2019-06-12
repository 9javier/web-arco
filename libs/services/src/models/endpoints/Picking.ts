import {TypeModel, UserProcessesModel, WarehouseModel} from "@suite/services";
import {WorkwaveModel} from "./Workwaves";

export namespace PickingModel {
  export interface WorkwaveOrderWarehouse {
    createdAt: string;
    updatedAt: string;
    id: number;
    warehouse: WarehouseModel.Warehouse;
  }

  export interface Picking {
    id?: number;
    store?: string;
    storeId?: number;
    type?: number;
    typeId?: number;
    threshold?: number;
    user?: UserProcessesModel.UserProcesses;
    users?: UserProcessesModel.UserProcesses[];
    userId?: number;
    pickingId?: number;
    createdAt?: string;
    updatedAt?: string;
    typeGeneration?: number;
    status?: number;
    packingId?: number;
    packingRef?: string;
    packingType?: number;
    workwave?: WorkwaveModel.Workwave;
    workWavesOrderWarehouses?: WorkwaveOrderWarehouse[];
    typePicking?: TypeModel.Type;
    quantity?: number;
    typeString?: string;
    storeRef?: string;
  }

  export interface PickingUpdate {
    userId: number;
    pikingId: number;
  }

  export interface ResponseIndex {
    data: Picking[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseShow {
    data: Picking[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseUpdate {
    data: Picking[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseVerifyPacking {
    data: any[];
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
