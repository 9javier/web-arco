import {ProductModel} from "@suite/services";
import {HttpRequestModel} from "./HttpRequest";

export namespace ReceptionModel {
  export interface ReceptionProduct {
    force?: boolean,
    productReference: string
  }

  export interface Reception {
    force?: boolean,
    packingReference: string,
  }

  export interface ResponseReceive extends HttpRequestModel.Response {
    data: {
      pickingId: number,
      quantity: number,
      hasNewProducts: boolean
    },
    message: string,
    code: number,
    errors: any
  }

  export interface ResponseCheckPacking extends HttpRequestModel.Response {
    data: any,
    message: string,
    code: number,
    errors: any
  }

  export interface ResponseCheckProductsPacking {
    data: {
      quantity: number,
      products: ProductModel.Product[]
    },
    message: string,
    code: number,
    errors: any
  }

  export interface ResponseReceptionProduct extends HttpRequestModel.Response {
    data: {
      remainingProducts: number,
      inventoryPacking: any,
      hasNewProducts: boolean
    },
    message: string,
    code: number,
    errors: any
  }

  export interface ResponseNotReceivedProducts extends HttpRequestModel.Response {
    data: string,
    message: string,
    code: number,
    errors: any
  }

  export interface ErrorResponse {
    errors: string,
    message: string,
    code: number
  }
}
