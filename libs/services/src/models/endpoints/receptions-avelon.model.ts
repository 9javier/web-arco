import { HttpRequestModel } from './HttpRequest';

export namespace ReceptionAvelonModel {
  export interface Data {
    id: number;
    name: string;
    selected: boolean;
    newSelectd?: boolean
    belongsModels?: Array<number>
    state?:number;
    available_ids?: number[],
    photos_models?: any,
    color?: string
  }

  export interface Reception {
    brands: Array<Data>;
    models: Array<Data>;
    colors: Array<Data>;
    sizes: Array<Data>;
    ean: string,
    image?: string
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
    reference: string;
    ean: string;
    expedition: string;
    modelId: number;
    sizeId: number;
    colorId: number;
    providerId: number;
    brandId: number;
  }

  export interface ParamsToPrint {
    to_print: Print[]
  }

  //region CheckExpeditionsByNumberAndProvider
  export interface ParamsCheckExpeditionsByNumberAndProvider {
    providerId: number,
    expeditionNumber: string
  }
  export interface CheckExpeditionsByNumberAndProvider {
    expedition_available: boolean,
    has_expeditions: boolean,
    another_expeditions: Expedition[],
    expedition: Expedition
  }
  export interface ResponseCheckExpeditionsByNumberAndProvider extends HttpRequestModel.Response {
    data: CheckExpeditionsByNumberAndProvider
  }
  //endregion

  //region LoadSizesList
  export interface ParamsLoadSizesList {
    modelId: number,
    colorId: number,
    providerId: number,
    brandId: number
  }
  export interface LoadSizesList {
    id: number,
    number: string,
    name: string,
    reference: string,
    available: boolean,
    quantity: number
  }
  export interface ResponseLoadSizesList extends HttpRequestModel.Response {
    data: LoadSizesList[]
  }
  //endregion

  export interface Expedition {
    reference: string,
    provider_name: string,
    provider_id: number,
    total_packing: number,
    delivery_date: string,
    shipper: string,
    states_list: number[],
    reception_enabled: boolean
  }
}
