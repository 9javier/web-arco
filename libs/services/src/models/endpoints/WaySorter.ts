import {TemplateSorterModel} from "./TemplateSorter";

export namespace WaySorterModel {

  export interface WaySorter {
    createdAt?: string,
    updatedAt?: string,
    id: number,
    name: string,
    number: number,
    active: boolean,
    column: number,
    height: number,
    templateZone?: TemplateSorterModel.TemplateZone,
    manual?: number
    new_emptying?: number,
    qty_products?: number
  }
}
