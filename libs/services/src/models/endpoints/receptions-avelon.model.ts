import { HttpRequestModel } from './HttpRequest';

export namespace ReceptionAvelonModel {
  export interface Data {
    id: number;
    name: string;
    selected: boolean;
  }

  export interface Reception {
    marca: Array<Data>;
    modelo: Array<Data>;
    colores: Array<Data>;
    talla: Array<Data>;
  }
}
