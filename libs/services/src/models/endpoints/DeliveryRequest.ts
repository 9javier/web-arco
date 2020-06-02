import {ModelModel, ProductModel, SizeModel, WarehouseModel} from "@suite/services";
import Warehouse = WarehouseModel.Warehouse;
import Model = ModelModel.Model;
import Size = SizeModel.Size;
import Product = ProductModel.Product;

export namespace DeliveryRequestModel {

  export interface DeliveryRequest {
    createdAt: string,
    updatedAt: string,
    id: number,
    reference: string,
    deliveryRequestId: number,
    deliveryRequestExternalId: string,
    status: number,
    shippingMode: number,
    customerOrderEntryId: number,
    modelId: number,
    sizeId: number,
    warehouseId: number,
    productId: number,
    workWaveId: number,
    assignedShop: Warehouse,
    destinyShop: Warehouse,
    product: Product,
    model: Model,
    size: Size,
    selected: boolean,
    hidden: boolean,
    confirmed: boolean
  }

  export interface ExpiredReservesResponse {
    message?: string,
    code?: number,
    data?: [DeliveryRequest[], number],
    error?: any,
    errors?: any
  }

  export interface FreeReserveResponse {
    message?: string,
    code?: number,
    data?: DeliveryRequest,
    error?: any,
    errors?: any
  }

}
