import { Request } from './request';
import {HttpRequestModel} from "./HttpRequest";

export namespace AppVersionModel {
    export interface AppVersion {
      id: number;
      createdAt: string,
      updatedAt: string,
      majorRelease: number;
      minorRelease: number;
      patchRelease: number;
    }

  export interface ResponseIndex extends HttpRequestModel.Response{
    data: AppVersion[];
  }

  export interface SingleAppVersionResponse extends Request.Success{
    data:AppVersion
  }

  export interface ResponseDestroy {
    data: number;
    message: string;
    code: number;
  }
}
