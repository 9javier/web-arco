import { HttpRequestModel } from './HttpRequest';

export namespace ReceptionAvelonModel {
  export interface Data {
    id: number;
    name: string;
    selected: boolean;
  }

  export interface Reception {
    brands: Array<Data>;
    models: Array<Data>;
    colors: Array<Data>;
    sizes: Array<Data>;
    ean: string
  }
}
