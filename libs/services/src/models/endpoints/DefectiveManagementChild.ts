import { Request } from './request';
import { HttpRequestModel } from "./HttpRequest";
export namespace DefectiveManagementChildModel {
  export interface DefectiveManagementChild {
    id?: number;
    name?: string;
  }

  export interface ResponseSingle extends Request.Success{
    data:DefectiveManagementChild;
  }

  export interface ResponseIndex {
    data: DefectiveManagementChild[];
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: DefectiveManagementChild;
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

  export interface ResponseListAllDefectiveManagementChild extends HttpRequestModel.Response {
    data: DefectiveManagementChild[]
  }
}
