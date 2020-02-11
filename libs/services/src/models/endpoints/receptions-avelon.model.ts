import { HttpRequestModel } from './HttpRequest';

export namespace ReceptionAvelonModel {
  export interface Data {
    id: number;
    name: string;
    selected: boolean;
    newSelectd?: boolean
    belongsModels?: Array<number>
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
    reference: string;
    ean: string;
    expedition: string;
    modelId: number;
    sizeId: number;
    colorId: number;
    providerId: number;
    brandId: number;
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
