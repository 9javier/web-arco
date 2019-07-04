import {ModelModel, SizeModel, WarehouseModel} from "@suite/services";

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
    size: SizeModel.Size
  }

}
