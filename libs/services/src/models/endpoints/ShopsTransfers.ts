import {HttpRequestModel} from "./HttpRequest";
import {CarrierModel} from "./Carrier";
import {WarehouseModel} from "@suite/services";

export namespace ShopsTransfersModel{

  interface DestiniesWithProducts extends WarehouseModel.Warehouse {
    total_products: number
  }

  export interface InfoByPacking {
    list_packing: CarrierModel.Carrier[],
    total_packing: number,
    list_destinies: DestiniesWithProducts[],
    total_destinies: number,
    total_products: number
  }

  export interface ResponseInfoByPacking extends HttpRequestModel.Response {
    data: InfoByPacking
  }
}
