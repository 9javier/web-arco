export namespace ReceptionModel {
  export interface Reception {
    force?: boolean,
    packingReference: string,
    quantityProducts: number
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

  export interface ErrorResponse {
    errors: string,
    message: string,
    code: number
  }
}
