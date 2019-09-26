import {ModelModel, SizeModel, WarehouseModel} from "@suite/services";

export namespace StockModel {

  export interface Stock {
    id: number,
    model: ModelModel.Model,
    warehouse: WarehouseModel.Warehouse,
    size: SizeModel.Size,
    cantidad: number,
    numRange: number
  }

}
