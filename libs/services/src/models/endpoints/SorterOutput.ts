import {ColorSorterModel} from "./ColorSorter";
import {ProductModel, WarehouseModel} from "@suite/services";
import {HttpRequestModel} from "./HttpRequest";
import {ExecutionSorterModel} from "./ExecutionSorter";
import {CarrierModel} from "./Carrier";
import {WaySorterModel} from "./WaySorter";
import {ProductSorterModel} from "./ProductSorter";

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
    wayId: number,
    fullPacking: boolean,
    incidenceProcess: boolean,
    stopButtonPressed: boolean
  }
  export interface ScanProductPutInPacking {
    processStopped?: boolean,
    productWithIncidence?: boolean,
    wayWithIncidences?: boolean,
    productInSorter?: boolean,
    product: any,
    warehouse: any
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

  /**
   * @author Gaetano Sabino
   *
   */
  export interface ParamsEmptyAllWays {
    waysId: number[] | string[];
    userId? : number | string;
  }
  export interface EmptyWay {

  }
  export interface ResponseEmptyWay extends HttpRequestModel.Response {
    data: EmptyWay
  }

  // Check if way is with incidences
  export interface ParamsGetIncidenceWay {
    way: number
  }
  export interface ResponseGetIncidenceWay extends HttpRequestModel.Response {
    data: boolean
  }

  // Get products by way
  export interface ProductInSorterWithIncidence extends ProductSorterModel.ProductSorter {
    with_incidence?: boolean
  }
  export interface ParamsGetProductsByWay {
    wayId: number
  }
  export interface GetProductsByWay {
    with_incidences?: boolean,
    way: WaySorterModel.WaySorter,
    warehouse: WarehouseModel.Warehouse,
    products: ProductInSorterWithIncidence[],
    packages: any
  }
  export interface ResponseGetProductsByWay extends HttpRequestModel.Response {
    data: GetProductsByWay
  }

  // Change way to manual
  export interface ParamsChangeWayManual {
    ways: {wayId: number, manual: boolean}[]
  }
  export interface ChangeWayManual {

  }
  export interface ResponseChangeWayManual extends HttpRequestModel.Response {
    data: ChangeWayManual
  }
}
