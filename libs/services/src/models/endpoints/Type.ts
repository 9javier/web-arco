import { Request } from './request';
export namespace TypeModel {
  export interface Type {
    id: number;
    name: string;
    priority?: number;
  }

  export interface TypeProcess{
    id:number;
    name:string;
  }

  export interface ResponseTypeProcess extends Request.Success{
    data:Array<TypeProcess>;
  }


  export interface TypeLoad {
    picking?: boolean;
    product?: boolean;
    process?: boolean;
    store?: boolean;
    incidences?: boolean;
    actions?: boolean;
    preparation_lines?: boolean;
    selection_criteria?: boolean;
    generation?: boolean;
    status_product?: boolean;
    execution?: boolean;
    shipping_order?: boolean;
    packing?: boolean;
    activities?: boolean;
    all?: boolean;
  }

  export interface ResponseIndex {
    data: Type[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ErrorResponse {
    errors: string;
    message: string;
    code: number;
  }
}
