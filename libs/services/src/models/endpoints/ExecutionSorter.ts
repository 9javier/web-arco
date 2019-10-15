import {ColorSorterModel} from "./ColorSorter";
import {ZoneSorterModel} from "./ZoneSorter";
import {TemplateSorterModel} from "./TemplateSorter";
import {HttpRequestModel} from "./HttpRequest";

export namespace ExecutionSorterModel {

  export interface Execution {
    createdAt: string,
    updatedAt: string,
    id: number,
    status: number,
    template?: TemplateSorterModel.Template,
    templateOld?: TemplateSorterModel.Template
  }

  export interface ParamsExecuteColor {
    color: number,
    type: 1|2,
    idZone?: number
  }

  export interface ExecuteColor {
    color: number,
    createdAt: string,
    execution: number,
    executionColorOld: number,
    id: number,
    process: number,
    template: number,
    type: number,
    updatedAt: string,
    user: number,
    zone: number
  }

  export interface ExecutionWay {
    createdAt: string,
    updatedAt: string,
    id: number,
    status: number,
    zoneWay?: TemplateSorterModel.TemplateZone
  }

  export interface ResponseExecuteColor {
    data: ExecuteColor
  }

  export interface StopExecuteColor {
    createdAt: string,
    updatedAt: string,
    id: number,
    type: number,
    process: number,
    color: ColorSorterModel.ColorSorter,
    execution: Execution,
    template: TemplateSorterModel.Template,
    zone: ZoneSorterModel.ZoneSorter
  }

  export interface ResponseStopExecuteColor {
    data: StopExecuteColor
  }

  export interface ParamsWrongWay {
    way: number,
    productReference: string
  }

  export interface WrongWay {

  }

  export interface ResponseWrongWay {
    data: WrongWay
  }

  export interface ParamsFullWay {
    way: number,
    productReference: string
  }

  export interface FullWay {
    success: boolean,
    idNewWay: number
  }

  export interface ResponseFullWay {
    data: FullWay
  }

  export interface ChangeExecutionTemplate {

  }

  export interface ResponseChangeExecutionTemplate {
    data: ChangeExecutionTemplate
  }

  export interface ColorActive {
    createdAt: string,
    updatedAt: string,
    id: number,
    type: number,
    process: number,
    color: ColorSorterModel.ColorSorter,
    execution: Execution,
    template: TemplateSorterModel.Template,
    zone: ZoneSorterModel.ZoneSorter
  }

  export interface ResponseColorActive extends HttpRequestModel.Response {
    data: ColorActive
  }
}
