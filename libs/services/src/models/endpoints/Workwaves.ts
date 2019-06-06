import {FormControl} from "@angular/forms";

export namespace WorkwaveModel {
  export interface Workwave {
    id?: number;
    thresholdConsolidated?: number;
    thresholdShippingStore?: number;
    typeSelectionCriteria?: number;
    typeShippingOrder?: number;
    executionDate?: string;
    executed?: boolean;
    executedDate?: string;
    warehouse?: any;
    warehouseId?: number;
    typeGeneration?: number;
    typePacking?: number;
    time?: string;
    date?: string;
    everyday?: boolean;
    active?: boolean;
    typeExecution?: number;
    name?: string;
    description?: string;
    releaseDate?: string;
    type?: number;
    dateForm?: FormControl;
    createdAt: string;
    updatedAt: string;
  }

  export interface ResponseListTemplates {
    data: any[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseListScheduled {
    data: any[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseListExecuted {
    data: any[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseStore {
    data: any;
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseUpdate {
    data: any;
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseDestroyTask {
    data: any;
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseDestroyTemplate {
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
