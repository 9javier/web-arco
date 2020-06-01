import { ProductModel, WarehouseModel } from '@suite/services';

export namespace PredistributionModel {
  import Warehouse = WarehouseModel.Warehouse;
  import Product = ProductModel.Product;

  export interface Predistribution {
    expeditionLineId?: number,
    sizeId?:number,
    avelonOrderId?: number,
    id?: number;
    warehouse?: Warehouse;
    article?: string;
    date_service?: string;
    distribution?: boolean;
    reserved?: boolean;
    positioned?: boolean
  }
  export interface DataSource {
    filters: Array<Filters>
    pagination: Pagination,
    results: Array<Results>
  }
  interface Filters {
    id: number,
    name: string
  }
  interface Results {
    expeditionLineId: number,
    warehouse: {
      id: number,
      name: string,
      description: string,
      reference: string,
      is_store: boolean,
      is_main: boolean,
      has_racks: boolean,
      is_outlet: boolean,
      prefix_container: string,
      packingType: number
    },
    provider: {
      createdAt: string,
      updatedAt: string,
      id: number,
      name: string,
      hash: string,
      avelonId: number
    },
    model: {
      createdAt: string,
      updatedAt: string,
      id: number,
      reference: string,
      name: string,
      hash: string,
      avelonInternalBrandId: number,
      detailColor: string,
      brand: {
        createdAt: string,
        updatedAt: string,
        id: number,
        avelonId: number,
        datasetHash: string,
        name: string,
        supplierName: string,
        providerId: number
      },
      color: {
        createdAt: string,
        updatedAt: string,
        id: number,
        avelonId: string,
        datasetHash: string,
        name: string,
        colorHex: string,
        description: string
      },
      family: {
        createdAt: string,
        updatedAt: string,
        id: number,
        avelonId: string,
        reference: string,
        name: string,
        groupNumber: number,
        datasetHash: string
      },
      lifestyle: {
        createdAt: string,
        updatedAt: string,
        id: number,
        avelonId: string,
        reference: string,
        name: string,
        groupNumber: number,
        datasetHash: string
      },
      category: {
        createdAt: string,
        updatedAt: string,
        id: number,
        avelonId: string,
        reference: string,
        name: string,
        groupNumber: number,
        datasetHash: string
      }
    },
    article: string,
    date_service: string,
    distribution: boolean,
    reserved: boolean
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
    orderBy: OrderBy
    pagination: Pagination
   }

  export interface PickingRequest {
    ids: number[],
    destinies: Destiny[]
  }
  export interface Destiny {
    warehouseId: number,
    userId: number
  }

   interface Pagination {
    page:number;
    limit:number;
   }

   interface OrderBy {
    type:number,
    order:string
   }
   export interface BlockReservedRequest {
    reserved: boolean,
    distribution: boolean,
    modelId: number,
    warehouseId: number,
    sizeId: number,
    avelonOrderId: number,
    userId:number
   }
}
