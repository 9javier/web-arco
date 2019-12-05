import { HttpRequestModel } from './HttpRequest';

export namespace ReceptionAvelonModel {
  export interface Data {
    id: number;
    name: string;
    selected: boolean;
    newSelectd?: boolean
  }

  export interface Reception {
    brands: Array<Data>;
    models: Array<Data>;
    colors: Array<Data>;
    sizes: Array<Data>;
    ean: string,
  }

  export interface Providers {
    id?:string;
    name:string;
  }

  export interface CheckProvider {
    providerId: number;
    expedition: string;
  }

  export interface GetProvider {
    providerId: number;
  }

  export interface Print {
    ean: string,
    expedition: string,
    modelId: number,
    sizeId: number,
    colorId: number,
    providerId: number,
    brandId: number
  }
}
