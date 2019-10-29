import { Request } from './request';

export namespace AppVersionModel {
    export interface AppVersion {
      id: number;
      createdAt: string,
      updatedAt: string,
      majorRelease: number;
      minorRelease: number;
      patchRelease: number;
    }

  export interface ResponseIndex {
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
