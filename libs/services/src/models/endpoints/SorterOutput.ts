import {ColorSorterModel} from "./ColorSorter";
import {WarehouseModel} from "@suite/services";
import {HttpRequestModel} from "./HttpRequest";
import {ExecutionSorterModel} from "./ExecutionSorter";
import {CarrierModel} from "./Carrier";

export namespace SorterOutputModel {

  // Get the way where user will work
  export interface NewProcessWay {
    way: ExecutionSorterModel.ExecutionWay,
    color: ColorSorterModel.ColorSorter,
    warehouse: WarehouseModel.Warehouse,
    packing?: CarrierModel.Carrier
  }
  export interface ResponseNewProcessWay extends HttpRequestModel.Response {
    data: NewProcessWay
  }

  // Assign packing scanned to process
  export interface ParamsAssignPackingToWay {
    wayId: string,
    packingReference: string
  }
  export interface AssignPackingToWay {
    packing: CarrierModel.Carrier,
    way: ExecutionSorterModel.ExecutionWay
  }
  export interface ResponseAssignPackingToWay extends HttpRequestModel.Response {
    data: AssignPackingToWay
  }

  // Set product scanned in packing
  export interface ParamsScanProductPutInPacking {
    productReference: string,
    packingReference: string,
    wayId: number
  }
  export interface ScanProductPutInPacking {

  }
  export interface ResponseScanProductPutInPacking extends HttpRequestModel.Response {
    data: ScanProductPutInPacking
  }

  // Set the packing as full
  export interface ParamsPackingFull {
    wayId: string,
    packingReference: string
  }
  export interface PackingFull {

  }
  export interface ResponsePackingFull extends HttpRequestModel.Response {
    data: PackingFull
  }

  // Block the current way
  export interface ParamsBlockSorterWay {
    wayId: string,
    block: boolean
  }
  export interface BlockSorterWay {

  }
  export interface ResponseBlockSorterWay extends HttpRequestModel.Response {
    data: BlockSorterWay
  }

  // Set the current way as empty
  export interface ParamsEmptyWay {
    wayId: string
  }
  export interface EmptyWay {

  }
  export interface ResponseEmptyWay extends HttpRequestModel.Response {
    data: EmptyWay
  }
}
