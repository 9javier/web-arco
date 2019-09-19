import { Request } from './request';
export namespace TemplateSorterModel{

    export interface Template{
        id: number;
        name: string;
        active: boolean;
        zones?: any,
        zoneWays?: any,
        zoneWarehouses?: any;
    }

    export interface ResponseTemplate{
        data:Array<Template>;
    }

    export interface ResponseTemplateCreate{
        data:Template;
    }
}