import { ProductModel, WarehouseModel } from '@suite/services';

export namespace PredistributionModel {
  import Warehouse = WarehouseModel.Warehouse;
  import Product = ProductModel.Product;

  export interface Predistribution {
    id?: number;
    warehouse?: Warehouse;
    article?: Product;
    date_service: string;
    distribution?: boolean;
    reserved?: boolean;
  }
  export interface ResponseIndex {
    data: Predistribution[];
  }
  export interface ResponseStore {
    data: Predistribution;
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: Predistribution;
    message: string;
    code: number;
  }

  export interface ResponseUpdate {
    data: Predistribution;
    message: string;
    code: number;
  }

  export interface ResponseDestroy {
    data: number;
    message: string;
    code: number;
  }
}
