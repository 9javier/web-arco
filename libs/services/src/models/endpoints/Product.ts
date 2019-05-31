import {ProductModel} from "@suite/services";
import { WarehouseModel } from './Warehouse';
import { ModelModel } from './Model';
import { SizeModel } from './Size';

export namespace ProductModel {
  export interface Product {
    id?: number;
    reference: number;
    initialWarehouse: Array<WarehouseModel.Warehouse>;
    model: Array<ModelModel.Model>;
    size: Array<SizeModel.Size>;
  }

  export interface ResponseIndex {
    data: Product[];
  }

  export interface ProductHistory{
  }

  export interface ErrorResponseIndex {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
