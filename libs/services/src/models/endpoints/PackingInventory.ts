import {CarrierModel} from "./Carrier";

export namespace PackingInventoryModel {

  export interface ResponseGetCarrierOfProduct {
    data: CarrierModel.Carrier,
    message?: string,
    errors?: any,
    code: number
  }

}
