import { Request } from './request';
import { HttpRequestModel } from "./HttpRequest";
export namespace DefectiveZonesChildModel {
  export interface DefectiveZonesChild {
    id?: number;
    name?: string;
    defectZoneParent?: number;
    includeInIncidenceTicket?: boolean;
    includeInDeliveryNote?: boolean;
  }

  export interface ResponseSingle extends Request.Success{
    data:DefectiveZonesChild;
  }

  export interface ResponseIndex {
    data: DefectiveZonesChild[];
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: DefectiveZonesChild;
  }

  export interface ResponseUpdate {
    data?: any;
    message: string;
    code: number;
  }

  export interface ResponseDelete {
    data?: any;
    message: string;
    code: number;
  }

  export interface ErrorResponseShow {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }

  export interface ResponseListAllDefectiveZonesChild extends HttpRequestModel.Response {
    data: DefectiveZonesChild[]
  }

  export interface RequestDefectiveZonesChild {
    name: string;
  }

  export interface ResponseSingleDefectiveZonesChild extends Request.Success{
    data: DefectiveZonesChild;
  }
}
