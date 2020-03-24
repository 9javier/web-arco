import {ModelModel, SizeModel, WarehouseModel} from "@suite/services";
import Warehouse = WarehouseModel.Warehouse;
import Model = ModelModel.Model;
import Size = SizeModel.Size;

export namespace DeliveryRequestModel {

  export interface DeliveryRequest {
    id: number,
    reference: number,
    deliveryRequestId: number,
    deliveryRequestExternalId: string,
    status: number,
    shippingMode: number,
    customerOrderEntryId: number,
    assignedShop: Warehouse,
    destinyShop: Warehouse,
    modelId: number,
    sizeId: number,
    warehouseId: number,
    productId: number,
    workWaveId: number,
    selected?: boolean,
    model?: Model,
    size?: Size
  }

}
