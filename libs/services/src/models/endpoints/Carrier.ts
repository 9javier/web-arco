export namespace CarrierModel {

  export interface Carrier {
    carrierWarehousesDestiny?: any[],
    createdAt: string,
    id: number,
    packingType: number,
    reference: string,
    status: number,
    updatedAt: string,
    warehouse?: any
  }

  export interface ParamsListByWarehouse {
    warehouseId: number
  }

  export interface ParamsGenerate {
    packingType: number
  }

  export interface ParamsSeal {
    reference: string
  }

  export interface ResponseListByWarehouse {
    data: Carrier[],
    message?: string,
    errors?: any,
    code: number
  }

  export interface ResponseGenerate {
    data: Carrier,
    message?: string,
    errors?: any,
    code: number
  }

  export interface ResponseSeal {
    data: Carrier,
    message?: string,
    errors?: any,
    code: number
  }

  export interface ParamsTransferAmongPackings {
    destiny: string,
    origin: string
  }

  export interface ResponseTransferAmongPackings {
    message: string,
    code: number
  }

}
