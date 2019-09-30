import {ZoneSorterModel} from "./ZoneSorter";

export namespace TemplateSorterModel {

  export interface Template {
    createdAt?: string,
    updatedAt?: string,
    id: number,
    name: string,
    active: boolean
  }

  export interface TemplateZone {
    createdAt?: string,
    updatedAt?: string,
    id: number,
    priority: number,
    active: boolean,
    template: Template,
    zones: ZoneSorterModel.ZoneSorter
  }
}
