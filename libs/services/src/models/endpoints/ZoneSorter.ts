import {ColorSorterModel} from "./ColorSorter";

export namespace ZoneSorterModel {

  export interface ZoneSorter {
    createdAt?: string,
    updatedAt?: string,
    id: number,
    name: string,
    zoneNumber: number,
    active: boolean,
    color: ColorSorterModel.ColorSorter
  }
}
