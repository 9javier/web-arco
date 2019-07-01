import {ModelModel} from "@suite/services";

export namespace ModelModel {
  export interface Model{
    id?: number;
    reference: number|string;
    color: number;
    name?: string;
  }

  export interface ResponseIndex {
    data: Model[];
  }

  export interface ErrorResponseIndex {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
