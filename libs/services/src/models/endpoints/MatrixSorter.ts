import {WaySorterModel} from "./WaySorter";
import {WarehouseModel} from "@suite/services";

export namespace MatrixSorterModel {

  export interface Column {
    column: number,
    way: WaySorterModel.WaySorter,
    ways_number: number,
    destiny_way?: WarehouseModel.Warehouse
  }

  export interface ResponseMatrixTemplateSorter {
    data: MatrixTemplateSorter[]
  }

  export interface MatrixTemplateSorter {
    height: number,
    columns: Column[]
  }
}
