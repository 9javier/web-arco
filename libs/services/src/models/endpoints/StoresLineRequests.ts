import {ProductModel, WarehouseModel} from "@suite/services";

export namespace StoresLineRequestsModel {

  export interface StoresLineRequests extends WarehouseModel.Warehouse{
    line_requests: LineRequests[],
    selected?: boolean
  }

  export interface StoresLineRequestsSelected {
    selected: boolean,
    store: StoresLineRequests
  }

  export interface LineRequests {
    product: ProductModel.ProductPicking,
    reference: string
  }

}
