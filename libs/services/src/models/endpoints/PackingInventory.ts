import {CarrierModel} from "./Carrier";
import {HttpRequestModel} from "./HttpRequest";

export namespace PackingInventoryModel {

  export interface ResponseGetCarrierOfProduct extends HttpRequestModel.Response {
    data: CarrierModel.Carrier,
    message?: string,
    errors?: any,
    code: number
  }

  export interface PackingInventory {
    packingType: number,
    packingId: number,
    productId: number,
    userId: number
  }

}
