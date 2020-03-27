import {ModelModel, SizeModel, WarehouseModel} from "@suite/services";
import Warehouse = WarehouseModel.Warehouse;
import Model = ModelModel.Model;
import Size = SizeModel.Size;
import {OrderModel} from "./Order";
import Order = OrderModel.Order;

export namespace LineRequestModel {

  export interface LineRequest {
    createdAt: string,
    updatedAt: string,
    id: number,
    reference: string,
    request : Order,
    source: number,
    status: number,
    requestDateTime: string,
    typeShippingOrderLineRequest: number,
    originShop: Warehouse,
    destinyShop: Warehouse,
    model: Model,
    size: Size,
    customerOrderId: number,
    customerOrderEntryId: number,
    hash: string,
    lineToClean: boolean,
    selected: boolean
  }

}
