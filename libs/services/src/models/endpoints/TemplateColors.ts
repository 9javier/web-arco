import {ColorSorterModel} from "./ColorSorter";
export namespace TemplateColorsModel{
    export interface TemplateColors{
        id:number;
        name: string;
        templateZone: any;
    }

    export interface ResponseTemplateColors{
        data:Array<TemplateColors>;
    }

    export interface ParamsAvailableColorsByProcess {
      processType: 1|2
    }

    export interface AvailableColorsByProcess extends ColorSorterModel.ColorSorter {
      available: string,
      userId: number
    }

    export interface ResponseAvailableColorsByProcess {
      data: AvailableColorsByProcess[]
    }
}
