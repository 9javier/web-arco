import {ModelModel, ProductModel, SizeModel, WarehouseModel} from "@suite/services";

export namespace PickingNewProductsModel {

  export interface ProductReceived {
    createdAt: string,
    updatedAt: string,
    id: number,
    tariffId: number,
    pickingId: number,
    numRange: number,
    warehouse: WarehouseModel.Warehouse,
    size: SizeModel.Size,
    model: ModelModel.Model,
    productShoesUnit: ProductModel.ProductShoesUnit
  }

  export interface ParamsGetByWarehouseIdPickingId {
    pickingId?: number,
    warehouseId?: number
  }

  export interface ResponseGetByWarehouseIdPickingId {
    data: ProductReceived[];
    message: string;
    code: number;
    errors: any;
  }

}
