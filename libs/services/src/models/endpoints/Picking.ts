import {TypeModel, UserProcessesModel} from "@suite/services";

export namespace PickingModel {
  export interface Picking {
    id?: number;
    store?: string;
    storeId?: number;
    type?: number;
    typeId?: number;
    quantity?: number;
    threshold?: number;
    user?: UserProcessesModel.UserProcesses;
    users?: UserProcessesModel.UserProcesses[];
    userId?: number;
    pickingId?: number;
    piking?: TypeModel.Type[]
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
