import {TypeModel, UserModel} from "@suite/services";

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
    size?: any;
    color?: any;
  }

  export interface SearchParameters {
    attended?: number,
    order: 'ASC'|'DESC',
    page: number,
    size: number,
    text?: string,
    type?: number
  }

  export interface IncidenceFilters {
    attended: AttendedOption,
    text?: string,
    type?: TypeModel.Type
  }

  export interface AttendedOption {
    id: 0|1|2,
    value: string
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

  export interface ResponseSearch {
    data: {
      count: number,
      count_search: number,
      incidences: Incidence[],
      pagination?: any
    };
    message: string;
    code: number;
  }

  export interface ErrorResponse {
    errors: string;
    message: string;
    code: number;
  }
}
