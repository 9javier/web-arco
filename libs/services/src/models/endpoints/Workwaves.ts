import {FormControl} from "@angular/forms";
import {GroupWarehousePickingModel, ProductModel, UserModel, WarehouseModel} from "@suite/services";
import {HttpRequestModel} from "./HttpRequest";
import {ShoesPickingModel} from "./ShoesPicking";

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

  export interface ParamsMatchLineRequest {
    groupsWarehousePicking: Array<GroupWarehousePickingModel.GroupWarehousesSelected>,
    typesShippingOrders: Array<number>
  }

  export interface MatchLineRequest {
    workwave: Workwave,
    typePicking: number,
    typeGeneration: number,
    status: number,
    originWarehouse: WarehouseModel.Warehouse,
    destinyWarehouse: WarehouseModel.Warehouse,
    destinyShop?: number,
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
    request: {
      id: number,
      requestId: number,
      date: string
    },
    preparationLinesTypes: {
      id: number,
      name: string,
      priority: number
    }
  }

  export interface ResponseMatchLineRequest {
    data: Array<MatchLineRequest>
  }

  export interface ParamsAssignUserToMatchLineRequest {
    requestIds: Array<number>,
    userIds: Array<number>,
    groupsWarehousePicking: Array<GroupWarehousePickingModel.GroupWarehousesSelected>,
    typesShippingOrders: Array<number>
  }

  interface PickingType {
    id: number,
    name: string
  }

  interface ShoesAssignation {
    pickingId: number,
    pickingTypeId?: PickingType,
    quantityShoes: string,
    temporary: boolean
  }

  export interface TeamAssignations {
    user: UserModel.User,
    pickingShoes: Array<ShoesAssignation>
  }

  export interface AssignationsByRequests {
    pickingId: number,
    pickingTypeId: string,
    quantityShoes: string,
    requestId?: number,
    deliveryRequestId?: number,
    requestReference: number,
    destinyShopId: number
  }

  export interface UsersAndAssignationsQuantities {
    assignations: Array<TeamAssignations>,
    quantities: Array<AssignationsByRequests>
  }

  export interface ResponseAssignUserToMatchLineRequest {
    data: UsersAndAssignationsQuantities
  }

  export interface ParamsConfirmMatchLineRequest {
    type: number,
    groupsWarehousePicking: Array<GroupWarehousePickingModel.GroupWarehousesSelected>,
    requestIds: Array<number>,
    userIds: Array<number>
  }

  interface PickingMatchLineRequest {
    createdAt: string,
    updatedAt: string,
    id: number,
    typePicking: number,
    typeGeneration: number,
    status: number,
    packingId: number,
    packingType: number,
    resultNotifyAvelon: boolean,
    avelonNotificationAttemptFinished: boolean,
    requestNotifyAvelon?: null,
    resultTextNotifyAvelon?: string,
    workwave: any,
    user: number,
    originWarehouse: WarehouseModel.Warehouse,
    quantityMatchWarehouse: number
  }

  export interface DataConfirmMatchLineRequest {
    id: number,
    type: number,
    typeExecution: number,
    releaseDate: string,
    name: string,
    description: string,
    executed: boolean,
    executedDate: string,
    everyday: boolean,
    weeklyPlan?: any,
    active?: any,
    date: string,
    time: string,
    warehouses: Array<WarehouseModel.Warehouse>,
    pickings: Array<PickingMatchLineRequest>
  }

  export interface ResponseConfirmMatchLineRequest {
    data: DataConfirmMatchLineRequest
  }

  export interface ParamsDeletePickings {
    pickingsIds: Array<number>
  }

  export interface DeletedPickings {
    type: number,
    ids: Array<number>
  }

  export interface ResponseDeletePickings {
    data: DeletedPickings
  }

  export interface ErrorResponse {
    errors: string;
    message: string;
    code: number;
  }

  // Get lineRequests Matched for online and store requests
  export interface ParamsMatchLineRequestOnlineStore {
    preparationLinesTypes: number[]
  }
  export interface MatchLineRequestOnlineStore {
    workwave: Workwave,
    typePicking: number,
    typeGeneration: number,
    status: number,
    originWarehouse: WarehouseModel.Warehouse,
    packingType: number,
    orderHall: number,
    packingId: number,
    requestNotifyAvelon: any,
    resultTextNotifyAvelon: any,
    createdAt: string,
    updatedAt: string,
    id: number,
    resultNotifyAvelon: boolean,
    avelonNotificationAttemptFinished: boolean,
    destinyWarehouse: WarehouseModel.Warehouse,
    quantityMatchWarehouse: number,
    quantityOrder: string,
    request?: {
      id: number,
      requestId: number,
      date: string
    },
    deliveryRequest?: {
      id: number,
      externalId: string
    },
    preparationLinesTypes: {
      id: number,
      name: string,
      priority: number
    }
  }
  export interface ResponseMatchLineRequestOnlineStore extends HttpRequestModel.Response {
    data: MatchLineRequestOnlineStore[]
  }

  // Get users-assignations for online and store requests
  export interface ParamsAssignUserToMatchLineRequestOnlineStore {
    requestIds: number[],
    deliveryRequestIds: number[],
    userIds: number[]
  }
  export interface AssignUserToMatchLineRequestOnlineStore {
    assignations: TeamAssignations[],
    quantities: AssignationsByRequests[]
  }
  export interface ResponseAssignUserToMatchLineRequestOnlineStore extends HttpRequestModel.Response {
    data: AssignUserToMatchLineRequestOnlineStore
  }

  // Create work-wave for online and store requests
  export interface ParamsConfirmMatchLineRequestOnlineStore {
    type: number,
    requestIds: number[],
    deliveryRequestIds: number[],
    userIds: number[]
  }
  export interface ConfirmMatchLineRequestOnlineStore {

  }
  export interface ResponseConfirmMatchLineRequestOnlineStore extends HttpRequestModel.Response {
    data: ConfirmMatchLineRequestOnlineStore
  }

  // Change status for product in online-store verification
  export interface ParamsChangeStatusProductOnlineStore {
    productReference: string,
    defective: boolean
  }
  export interface ChangeStatusProductOnlineStore {
    product: ProductModel.Product,
    defective: boolean,
    newProduct: ProductModel.Product,
    containerReference: string,
    workwaveOrder: ShoesPickingModel.WorkwaveOrder,
    status: string
  }
  export interface ResponseChangeStatusProductOnlineStore extends HttpRequestModel.Response {
    data: ChangeStatusProductOnlineStore
  }
}
