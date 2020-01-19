import { ProductModel, WarehouseModel } from '@suite/services';

export namespace PredistributionModel {
  import Warehouse = WarehouseModel.Warehouse;
  import Product = ProductModel.Product;

  export interface Predistribution {
    id?: number;
    warehouse?: Warehouse;
    article?: string;
    date_service?: string;
    distribution?: boolean;
    reserved?: boolean;
  }
  export interface DataSource {
    filters: Array<Filters>
    pagination: Pagination,
    results: Array<any>
  }
  interface Filters { 
    id: number, 
    name: string 
  }


  interface Pagination {
    firstPage: number,
    lastPage: number,
    limit: number,
    selectPage: number,
    totalResults: number
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
   export interface IndexRequest {
    references: Array<number | string>,
    wharehouses: Array<number | string>,
    providers: Array<number | string>,
    brands: Array<number | string>,
    colors: Array<number | string>,
    sizes: Array<number | string>,
    orderBy: OrderBy
    pagination: Pagination
   }
   interface Pagination {
    page:number;
    limit:number;
   }

   interface OrderBy {
    type:number,
    order:string
   }
}
