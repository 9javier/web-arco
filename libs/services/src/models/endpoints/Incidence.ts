import {UserModel} from "@suite/services";

export namespace IncidenceModel {
  export interface Incidence {
    id?: number;
    typeIncidence?: number;
    title?: string;
    description?: string;
    attended?: number;
    logUser?: UserModel.User;
    product?: any;
    model?: any;
    container?: any;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface ResponseIndex {
    data: Incidence[];
    message: string;
    code: number;
  }

  export interface ResponseIndexByType {
    data: Incidence[];
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: Incidence;
    message: string;
    code: number;
  }

  export interface ResponseUpdate {
    data: any;
    message: string;
    code: number;
  }

  export interface ResponseDestroy {
    data: any;
    message: string;
    code: number;
  }

  export interface ErrorResponse {
    errors: string;
    message: string;
    code: number;
  }
}
