import { WarehouseModel } from './Warehouse';
import { ModelModel } from './Model';
import { SizeModel } from './Size';
import {BrandModel} from "./Brand";
import {SeasonModel} from "./Season";
import {PriceModel} from "@suite/services";
import {HttpRequestModel} from "./HttpRequest";

export namespace ProductModel {
  export interface Product {
    id?: number;
    reference: string;
    initialWarehouse: WarehouseModel.Warehouse;
    model: ModelModel.Model;
    size: SizeModel.Size;
    brand: BrandModel.Brand;
    season: SeasonModel.Season
  }

  export interface ProductShoesUnit {
    id: number,
    initialWarehouseReference: string,
    reference: string
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
      name?: string;
      color: {
        createdAt: string;
        updatedAt: string;
        id: number;
        avelonId: string;
        datasetHash: string;
        name: string;
        colorHex: string;
        description: string;
      },
      brand: {
        name:string;
      }
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

  interface SizePrice extends SizeModel.Size {
    price: PriceModel.Price
  }

  export interface ResponseIndex {
    data: Product[];
  }

  export interface SizesAndModel {
    sizes: SizeModel.Size[],
    model: ModelModel.Model
  }

  export interface ResponseInfo extends HttpRequestModel.Response {
    data?: Product|SizesAndModel,
    errors?: string,
    message: string,
    code: number
  }

  export interface InfoVerificationOnlineStore {
    reference: string,
    model: ModelModel.Model,
    size: SizeModel.Size
  }

  export interface ResponseInfoVerificationOnlineStore extends HttpRequestModel.Response {
    data: InfoVerificationOnlineStore
  }

  export interface ResponseExtendedInfo {
    data?: {
      productModel: ModelModel.Model,
      sizes: SizePrice[]
    },
    errors?: string,
    message: string,
    code: number
  }

  export interface ParamsRelabel {
    productReference: string,
    warehouseId?: number,
    modelId?: number,
    sizeId?: number,
    locationReference?: string
  }

  export interface ResponseRelabel {
    data?: Product,
    errors?: string,
    message: string,
    code: number
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
