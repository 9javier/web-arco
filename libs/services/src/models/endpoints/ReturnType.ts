import {Request} from "./request";

export namespace ReturnTypeModel {

  export interface ReturnType {
    id: number,
    name?: string,
    defective?: boolean
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
    name: string,
    defective: boolean
  }

  interface Pagination {
    firstPage: number,
    lastPage: number,
    limit: number,
    selectPage: number,
    totalResults: number
  }

  export interface ResponseIndex {
    data: ReturnType[];
  }

  export interface ResponseStore extends Request.Success{
    data: ReturnType;
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: ReturnType;
    message: string;
    code: number;
  }

  export interface ResponseUpdate {
    data: ReturnType;
    message: string;
    code: number;
  }

  export interface ResponseDestroy {
    data: number;
    message: string;
    code: number;
  }
   export interface IndexRequest {
    names: Array<number | string>,
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
