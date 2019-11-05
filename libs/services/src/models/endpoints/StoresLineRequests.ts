import {ModelModel, SizeModel, WarehouseModel} from "@suite/services";
import {EmployeeModel} from "./Employee";

export namespace StoresLineRequestsModel {

  export interface StoresLineRequests {
    warehouse: WarehouseModel.Warehouse,
    lines: LineRequests[],
    selected?: boolean
  }

  export interface StoresLineRequestsSelected {
    selected: boolean,
    store: StoresLineRequests
  }

  export interface StoresOrderRequests {
    warehouse: WarehouseModel.Warehouse,
    lines: OrderRequests[],
    selected?: boolean
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
    model: ModelModel.Model,
    size: SizeModel.Size,
    selected: boolean
  }

  export interface OrderRequests {
    employee: EmployeeModel.Employee,
    request: Request,
    qtyLineRequests: number,
    selected: boolean
  }

  export interface Request {
    date: string,
    reference: number,
    id: number
  }
}
