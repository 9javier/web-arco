import { GroupModel } from './Group';
import {WarehouseModel} from "@suite/services";
export namespace WarehouseModel {
  export interface Warehouse {
    id?: number;
    name?: string;
    description?: string;
    reference?: string;
    is_store?: boolean;
    is_main?: boolean;
    group?: Array<GroupModel.Group>;
  }

  export interface ResponseIndex {
    data: Warehouse[];
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: Warehouse;
  }

  export interface ResponseUpdate {
    data?: any;
    message: string;
    code: number;
  }

  export interface ResponseDelete {
    data?: any;
    message: string;
    code: number;
  }

  export interface ErrorResponseShow {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
