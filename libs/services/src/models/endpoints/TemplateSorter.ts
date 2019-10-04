import {ZoneSorterModel} from "./ZoneSorter";

export namespace TemplateSorterModel {

    export interface Template {
        createdAt?: string,
        updatedAt?: string,
        id: number,
        name: string,
        active: boolean,
        zones?: any,
        zoneWays?: any,
        zoneWarehouses?: any
    }

    export interface ResponseTemplate {
        data:Array<Template>;
    }

    export interface ResponseTemplateCreate {
        data:Template;
    }

    export interface ResponseActiveTemplate {
      data: Template
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
