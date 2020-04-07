import {TypeModel, UserModel} from "@suite/services";
import {HttpRequestModel} from "./HttpRequest";

export namespace IncidenceReceptionModel {

  export enum TypeFilters {
    TYPE = 1,
    PROCESS = 2,
    DATE_REPORT = 3,
    TIME_REPORT = 4,
    USER_REPORT = 5,
    PRODUCT = 6,
    MODEL_REFERENCE = 7,
    SIZE = 8,
    BRAND = 9,
    MODEL_NAME = 10,
    COLOR = 11,
    LIFESTYLE = 12,
    SEASON = 13,
    LOCATION_WAREHOUSE = 14,
    LOCATION = 15,
    DESTINY_WAREHOUSE = 16,
    LOCATION_SORTER_WAY = 17,
    STATUS = 18,
    USER_MANAGE = 19,
    DATE_MANAGE = 20,
    TIME_MANAGE = 21
  }

  export interface IncidenceReception {
    info: {
      id: number,
      type: {
        id: number,
        name: string
      },
      process: {
        id: number,
        name: string
      }
    },
    product: {
      date: string,
      time: string,
      user: string,
      product: {
        reference: string,
        model: {
          reference: string,
          name: string,
          brand: string,
          color: string,
          lifestyle: string,
          season: string
        },
        size: string,
        location: {
          warehouse: string,
          location: string,
          sorterWay: string
        },
        destiny: string
      }
    },
    status: {
      status: {
        id: number,
        name: string
      },
      user: string,
      date: string,
      time: string,
      available_status: {id: number, name: string}[]
    }
  }

  export interface SearchParameters {
    attended?: number,
    order: {
      field: string,
      direction: string,
    },
    filters?: {
      [TypeFilters.TYPE]?: any[],
      [TypeFilters.PROCESS]?: any[],
      [TypeFilters.DATE_REPORT]?: any[],
      [TypeFilters.TIME_REPORT]?: any[],
      [TypeFilters.USER_REPORT]?: any[],
      [TypeFilters.PRODUCT]?: any[],
      [TypeFilters.MODEL_REFERENCE]?: any[],
      [TypeFilters.SIZE]?: any[],
      [TypeFilters.BRAND]?: any[],
      [TypeFilters.MODEL_NAME]?: any[],
      [TypeFilters.COLOR]?: any[],
      [TypeFilters.LIFESTYLE]?: any[],
      [TypeFilters.SEASON]?: any[],
      [TypeFilters.LOCATION_WAREHOUSE]?: any[],
      [TypeFilters.LOCATION]?: any[],
      [TypeFilters.DESTINY_WAREHOUSE]?: any[],
      [TypeFilters.LOCATION_SORTER_WAY]?: any[],
      [TypeFilters.STATUS]?: any[],
      [TypeFilters.USER_MANAGE]?: any[],
      [TypeFilters.DATE_MANAGE]?: any[],
      [TypeFilters.TIME_MANAGE]?: any[]
    }
    page: number,
    size: number,
    text?: string,
    type?: number
  }

  export interface IncidenceReceptionFilters {
    attended: AttendedOption,
    text?: string,
    type?: TypeModel.Type
  }

  export interface AttendedOption {
    id: 0|1|2,
    value: string
  }

  export interface ResponseIndex {
    data: IncidenceReception[];
    message: string;
    code: number;
  }

  export interface ResponseIndexByType {
    data: IncidenceReception[];
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: IncidenceReception;
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

  export interface ResponseSearch extends HttpRequestModel.Response {
    data: {
      count: number,
      count_search: number,
      incidences: IncidenceReception[],
      pagination?: any,
      listAvailableStatus: any[]
    };
    message: string;
    code: number;
  }

  export interface ErrorResponse {
    errors: string;
    message: string;
    code: number;
  }

  export interface ParamsGetFilters {
    type: number,
    currentFilter: any[]
  }
  export interface ResponseGetFilters extends HttpRequestModel.Response {
    data: any[]
  }

  export interface ParamsChangeStatus {
    newStatus: number
  }
  export interface ResponseChangeStatus extends HttpRequestModel.Response {
    data: IncidenceReception
  }
}
