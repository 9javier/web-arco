import {Request} from "./request";
import {BrandModel} from "./Brand";
import ProviderModel = ProviderModel.Provider;
import Brand = BrandModel.Brand;
export namespace SupplierConditionModel {

  export interface SupplierCondition {
    id: number,
    provider?: ProviderModel,
    noClaim?: boolean,
    contact?: string,
    observations?: string,
    brand?: Brand,
    showObs?: boolean
  }
  export interface Provider {
    id?: number,
    name?: string
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
  export interface Results {
    id: number;
    provider: {
      createdAt: string,
      updatedAt: string,
      id: number,
      name: string,
      hash: string,
      avelonId: number
    },
    brand: {
      createdAt: string,
      updatedAt: string,
      id: number,
      avelonId: number,
      name: string,
      supplierName: string,
      providerId: number,
    },
    noClaim: boolean,
    contact: string,
    observations: string
  }

  interface Pagination {
    firstPage: number,
    lastPage: number,
    limit: number,
    selectPage: number,
    totalResults: number
  }

  export interface ResponseIndex {
    data: SupplierCondition[];
  }

  export interface ResponseStore extends Request.Success{
    data: SupplierCondition;
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: SupplierCondition;
    message: string;
    code: number;
  }

  export interface ResponseUpdate {
    data: SupplierCondition;
    message: string;
    code: number;
  }

  export interface ResponseDestroy {
    data: number;
    message: string;
    code: number;
  }
   export interface IndexRequest {
    providers: Array<number | string>,
    brands: Array<number | string>,
    contacts: Array<number | string>,
    orderBy: OrderBy,
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
