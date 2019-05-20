import {SizeModel} from "@suite/services";

export namespace SizeModel {
  export interface Size{
    id?: number;
    reference: number;
    number: number;
    name: number;
  }

  export interface ResponseIndex {
    data: Size[];
  }

  export interface ErrorResponseIndex {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
