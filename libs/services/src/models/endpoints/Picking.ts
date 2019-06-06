import {UserProcessesModel} from "@suite/services";

export namespace PickingModel {
  export interface Picking {
    id?: number;
    store?: string;
    storeRef?: string;
    storeId?: number;
    type?: string;
    typeId?: number;
    quantity?: number;
    threshold?: number;
    operator?: UserProcessesModel.UserProcesses;
    userId?: number;
    pickingId?: number;
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

  export interface ErrorResponse {
    errors: string;
    message: string;
    code: number;
  }
}
