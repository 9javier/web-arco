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
    templateZone: TemplateSorterModel.TemplateZone
  }
}
