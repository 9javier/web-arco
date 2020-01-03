export namespace PermissionsModel {
  export interface Permission {
    id?: number;
    name: string;
  }

  export interface ResponseIndex {
    data: Permission[];
    message: string;
    code: number;
  }

  export interface ResponseGestionPermision {
    statusCode: number,
    statusMessage: string,
    statusDescription: string,
    result: any,
    data: boolean,
    message: string,
    code: number
  }

  export interface ResponseShow {
    data: Permission;
  }

  export interface ErrorResponseShow {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
