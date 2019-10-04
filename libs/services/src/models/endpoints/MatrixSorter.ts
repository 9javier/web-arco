import {WaySorterModel} from "./WaySorter";

export namespace MatrixSorterModel {

  export interface Column {
    column: number,
    way: WaySorterModel.WaySorter,
    ways_number: number
  }

  export interface ResponseMatrixTemplateSorter {
    data: MatrixTemplateSorter[]
  }

  export interface MatrixTemplateSorter {
    height: number,
    columns: Column[]
  }
}
