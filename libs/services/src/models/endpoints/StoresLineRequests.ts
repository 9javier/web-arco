import {ModelModel, SizeModel, WarehouseModel} from "@suite/services";
import {EmployeeModel} from "./Employee";
import {DeliveryRequestModel} from "./DeliveryRequest";
import DeliveryRequest = DeliveryRequestModel.DeliveryRequest;
import Warehouse = WarehouseModel.Warehouse;
import Model = ModelModel.Model;
import Size = SizeModel.Size;
import Employee = EmployeeModel.Employee;

export namespace StoresLineRequestsModel {

  export interface StoresLineRequests {
    warehouse: Warehouse,
    lines: LineRequests[],
    selected?: boolean
  }

  export interface StoresLineRequestsSelected {
    selected: boolean,
    store: StoresLineRequests
  }

  export interface StoresOrderRequests {
    warehouse: Warehouse,
    lines: OrderRequests[],
    selected?: boolean
  }

  export interface StoreRequests {
    lines: OrderRequests[],
    selected: boolean
  }

  export interface RequestGroup {
    name: string,
    lines: Array<DeliveryRequest | OrderRequests>,
    selected: boolean
  }

  export interface StoreOnlineRequests {
    store: StoreRequests,
    onlineHomeRequests: DeliveryRequest[],
    onlineStoreRequests: DeliveryRequest[]
  }

  export interface RequestGroupSelected {
    selected: boolean,
    requestGroup: RequestGroup
  }

  export interface StoresOrderRequestsSelected {
    selected: boolean,
    store: StoresOrderRequests
  }

  export interface LineRequests {
    createdAt: string,
    updatedAt: string,
    id: number,
    reference: string,
    source: number,
    status: number,
    requestDateTime: string,
    typeShippingOrderLineRequest: number,
    model: Model,
    size: Size,
    selected: boolean
  }

  export interface OrderRequests {
    employee: Employee,
    request: Request,
    qtyLineRequests: number,
    selected: boolean,
    warehouseId: number
  }

  export interface Request {
    date: string,
    reference: number,
    id: number
  }

}
