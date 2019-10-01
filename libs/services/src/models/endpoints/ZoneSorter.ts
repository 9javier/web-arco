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

  export interface ZoneColor {
    id: number,
    name: string,
    active: boolean,
    color: string
  }
}
