import {SorterModel} from "./Sorter";

export namespace ColorSorterModel {

  export interface ColorSorter {
    createdAt?: string,
    updatedAt?: string,
    id: number,
    name: string,
    hex: string
  }

  export interface ColorAssignedSorter {
    createdAt: string,
    updatedAt: string,
    id: number,
    sorter: SorterModel.Sorter,
    sorterZonesColor: ColorSorter
  }
}
