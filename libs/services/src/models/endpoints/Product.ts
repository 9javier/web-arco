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

  export interface ProductPicking {
    id: number;
    reference: string;
    initialWarehouseReference: string;
    model: {
      createdAt: string;
      updatedAt: string;
      id: number;
      reference: string;
      datasetHash: string;
      hash: string;
      color: {
        createdAt: string;
        updatedAt: string;
        id: number;
        avelonId: string;
        datasetHash: string;
        name: string;
        colorHex: string;
        description: string;
      };
    };
    size: {
      createdAt: string;
      updatedAt: string;
      id: number;
      reference: string;
      number: string;
      name: string;
      description: string;
      datasetHash: string;
    };
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
