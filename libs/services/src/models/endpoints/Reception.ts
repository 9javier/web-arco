import {ProductModel} from "@suite/services";

export namespace ReceptionModel {
  export interface ReceptionProduct {
    force?: boolean,
    productReference: string
  }

  export interface Reception {
    force?: boolean,
    packingReference: string,
  }

  export interface ResponseReceive {
    data: {
      pickingId: number,
      quantity: number
    },
    message: string,
    code: number,
    errors: any
  }

  export interface ResponseCheckPacking {
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

  export interface ResponseReceptionProduct {
    data: {
      remainingProducts: number,
      inventoryPacking: any
    },
    message: string,
    code: number,
    errors: any
  }

  export interface ResponseNotReceivedProducts {
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
