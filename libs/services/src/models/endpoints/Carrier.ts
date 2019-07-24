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

  export interface ResponseListByWarehouse {
    data: Carrier[],
    message?: string,
    errors?: any,
    code: number
  }

}
