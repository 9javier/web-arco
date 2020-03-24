import {ModelModel, SizeModel, WarehouseModel} from "@suite/services";
import Warehouse = WarehouseModel.Warehouse;
import Model = ModelModel.Model;
import Size = SizeModel.Size;

export namespace DeliveryRequestModel {

  export interface DeliveryRequest {
    createdAt: string,
    updatedAt: string,
    id: number,
    reference: number,
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
    model?: Model,
    size?: Size,
    selected?: boolean
  }

}
