import { HttpRequestModel } from './HttpRequest';

export namespace ReceptionAvelonModel {
  export interface Data {
    id: number;
    name: string;
    selected: boolean;
    newSelected?: boolean
    belongsModels?: Array<number>
    state?:number;
    available_ids?: number[],
    photos_models?: any,
    color?: string
  }

  export interface Reception {
    brands: Array<Data>,
    models: Array<Data>,
    colors: Array<Data>,
    lines: {
      id: number,
      state: number,
      brandId: number,
      modelId: number,
      colorId: number
    }[],
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
    providerId: number,
    typeVisualization: number
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
    to_print: Print[],
    delivery_note?: string
  }

  //region CheckExpeditionsByNumberAndProvider
  export interface ParamsCheckExpeditionsByNumberAndProvider {
    providerId: number,
    expeditionNumber: string
  }
  export interface CheckExpedition {
    expedition_available: boolean,
    has_expeditions: boolean,
    another_expeditions: Expedition[],
    expedition: Expedition,
    expedition_reference_queried: string
  }
  export interface CheckExpeditionsByProvider {
    has_expeditions: boolean,
    expeditions: Expedition[],
    provider_queried: string
  }
  export interface ResponseCheckExpeditionsByNumberAndProvider extends HttpRequestModel.Response {
    data: CheckExpedition
  }
  export interface ResponseCheckExpeditionByReference extends HttpRequestModel.Response {
    data: CheckExpedition
  }
  export interface ResponseCheckExpeditionsByProvider extends HttpRequestModel.Response {
    data: CheckExpeditionsByProvider
  }
  //endregion

  //region LoadSizesList
  export interface ParamsLoadSizesList {
    modelId: number,
    colorId: number
  }
  export interface LoadSizesList {
    id: number,
    number: string,
    name: string,
    reference: string,
    available: boolean,
    quantity: number,
    color?: string
  }
  export interface ResponseLoadSizesList extends HttpRequestModel.Response {
    data: LoadSizesList[]
  }
  //endregion

  //region
  export interface ParamsReloadModelsList {
    typeVisualization: number,
    providerId: number
  }
  export interface ReloadModelsList {
    id: number;
    name: string;
    selected: boolean;
    color: string;
    photos_models: any;
    available_ids: number[];
  }
  export interface ResponseReloadModelsList extends HttpRequestModel.Response {
    data: ReloadModelsList[]
  }
  //endregion

  export interface Expedition {
    reference: string,
    providerName: string,
    providerId: number,
    packingAmount: number,
    deliveryDate: string,
    shipper: string,
    states: number[],
    receptionPallets: number,
    receptionPackings: number,
    receptionStates: number[],
    receptionBlocked: boolean,
    noPendingReceptions: boolean,
    noPendingConfirms: boolean,
    receptionDisabled: boolean,
    disabledReason: string
  }
}
