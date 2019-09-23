import { Request } from './request';
export namespace TemplateColorsModel{
    export interface TemplateColors{
        id:number;
        name: string;
        templateZone: any;
    }

    export interface ResponseTemplateColors{
        data:Array<TemplateColors>;
    }
}