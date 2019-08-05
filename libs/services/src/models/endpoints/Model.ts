import {BrandModel} from "./Brand";

export namespace ModelModel {
  export interface Model{
    id?: number,
    reference: string,
    color?: any,
    name?: string,
    createdAt?: string,
    updatedAt?: string,
    hash?: string,
    avelonInternalBrandId?: number,
    brand?: BrandModel.Brand
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
