import {ProductModel, WarehouseModel} from "@suite/services";
import {ZoneSorterModel} from "./ZoneSorter";
import {ColorSorterModel} from "./ColorSorter";
import {ExecutionSorterModel} from "./ExecutionSorter";
import {WaySorterModel} from "./WaySorter";
import {HttpRequestModel} from "./HttpRequest";

export namespace InputSorterModel {

  export interface ParamsProductScan {
    productReference: string,
    packingReference: string
  }

  export interface ParamsRackScan {
    productReference: string,
    rackReference: string
  }

  export interface ProductScan {
    warehouse: WarehouseModel.Warehouse,
    zone: ZoneSorterModel.ZoneSorter,
    sorterExecution: ExecutionSorterModel.Execution,
    color: ColorSorterModel.ColorSorter,
    way: WaySorterModel.WaySorter | ExecutionSorterModel.ExecutionWay,
    product: ProductModel.Product,
    wayBusyByAnotherUser: boolean
  }

  export interface ProductScanException {
    error: {
      type: string,
      message: string
    },
    info?: {
      destinyWarehouse: WarehouseModel.Warehouse,
      colorSelected: ColorSorterModel.ColorSorter,
      product: ProductModel.Product
    }
  }

  export interface RackScan {
    logUser: number,
    destinationWarehouse: WarehouseModel.Warehouse,
    productShoeUnit: ProductModel.Product,
    typeAction: number,
    locationType: number,
    id: number
  }

  export interface ResponseProductScan extends HttpRequestModel.Response {
    data: ProductScan|ProductScanException
  }

  export interface ResponseRackScan {
    data: RackScan
  }

  export interface ParamsCheckProductInWay {
    wayId: number,
    productReference: string
  }

  export interface CheckProductInWay {
    is_in_way: boolean
  }

  export interface ResponseCheckProductInWay {
    data: CheckProductInWay
  }

  // Check if way is already free or get a new way
  export interface ParamsCheckWayIsFree {
    wayId: number,
    productReference: string
  }
  export interface CheckWayIsFree {
    status: number,
    message: string,
    wayFree: boolean,
    sorterFull: boolean,
    idNewWay: number
  }
  export interface ResponseCheckWayIsFree extends HttpRequestModel.Response {
    data: CheckWayIsFree
  }
}
