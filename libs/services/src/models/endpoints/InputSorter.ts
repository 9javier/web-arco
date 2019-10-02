import {ProductModel, WarehouseModel} from "@suite/services";
import {ZoneSorterModel} from "./ZoneSorter";
import {ColorSorterModel} from "./ColorSorter";
import {ExecutionSorterModel} from "./ExecutionSorter";
import {WaySorterModel} from "./WaySorter";

export namespace InputSorterModel {

  export interface ParamsProductScan {
    productReference: string,
    packingReference: string
  }

  export interface ProductScan {
    warehouse: WarehouseModel.Warehouse,
    zone: ZoneSorterModel.ZoneSorter,
    sorterExecution: ExecutionSorterModel.Execution,
    color: ColorSorterModel.ColorSorter,
    way: WaySorterModel.WaySorter,
    product: ProductModel.Product
  }

  export interface ResponseProductScan {
    data: ProductScan
  }
}
