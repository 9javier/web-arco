import {FormControl} from "@angular/forms";
import {UserModel, WarehouseModel} from "@suite/services";

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
    weeklyPlan?: string;
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

  export interface ResponseKeepAlive {
    data: any;
    message: string;
    code: number;
    errors: any;
  }

  interface GroupsWarehousesTreshold {
    groupsWarehousePickingId: number,
    thresholdConsolidated: number
  }

  export interface ParamsMatchLineRequest {
    groupsWarehousePicking: Array<GroupsWarehousesTreshold>,
    typesShippingOrders: Array<number>
  }

  export interface MatchLineRequest {
    workwave: Workwave,
    typePicking: number,
    typeGeneration: number,
    status: number,
    originWarehouse: WarehouseModel.Warehouse,
    destinyShop: number,
    packingType: number,
    packingId: number,
    requestNotifyAvelon: string,
    resultTextNotifyAvelon: string,
    createdAt: string,
    updatedAt: string,
    id: number,
    resultNotifyAvelon: boolean,
    avelonNotificationAttemptFinished: boolean,
    quantityMatchWarehouse: number,
    quantityOrder: string,
    requestId: number
  }

  export interface ResponseMatchLineRequest {
    data: Array<MatchLineRequest>
  }

  export interface ParamsAssignUserToMatchLineRequest {
    requestIds: Array<number>,
    userIds: Array<number>
  }

  interface ShoesAssignation {
    pickingId: number,
    quantityShoes: string,
    Temporal: boolean
  }

  export interface TeamAssignations {
    user: UserModel.User,
    pickingShoes: Array<ShoesAssignation>
  }

  export interface ResponseAssignUserToMatchLineRequest {
    data: Array<TeamAssignations>
  }

  export interface ErrorResponse {
    errors: string;
    message: string;
    code: number;
  }
}
