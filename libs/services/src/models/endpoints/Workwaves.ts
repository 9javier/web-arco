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
  }

  export interface ResponseListTemplates {
    data: any[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseStore {
    data: Workwave[];
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
