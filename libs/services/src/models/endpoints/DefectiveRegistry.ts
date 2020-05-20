import { ProductModel, WarehouseModel } from '@suite/services';

export namespace DefectiveRegistryModel {
  import Warehouse = WarehouseModel.Warehouse;
  import Product = ProductModel.Product;

  export interface DefectiveRegistry {
    id?: number;
    autoId?: any;
    warehouseDefectId: number;
    product?: Product;
    dateDetection?: Date;
    statusManagementDefect?: StatusManagementDefect;
    defectTypeParent?: DefectTypeParent;
    defectTypeChild?: DefectTypeChild;
    numberObservations?: number;
    photo?: string;
    photos?: (any)[];
    warehouse?: Warehouse;
    factoryReturn?: boolean;
    sold?: boolean;
  }

  export interface StatusManagementDefect {
    id?: number;
    defectType?: number;
    ticketEmit?: boolean;
    passHistory?: boolean;
    requirePhoto?: boolean;
    requireContact?: boolean;
    requireOk?: boolean;
    allowOrders?: boolean;
  }

  export interface DefectTypeParent {
    id?: number;
    name?: string;
  }

  export interface DefectTypeChild {
    id?: number;
    name?: string;
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
    data: DefectiveRegistry[];
  }
  export interface ResponseStore {
    data: DefectiveRegistry;
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: DefectiveRegistry;
    message: string;
    code: number;
  }

  export interface ResponseUpdate {
    data: DefectiveRegistry;
    message: string;
    code: number;
  }

  export interface ResponseDestroy {
    data: number;
    message: string;
    code: number;
  }
   export interface IndexRequest {
     product?: (number | string)[],
     dateDetection?:(Date)[],
     statusManagementDefect?: (number | string)[],
     defectTypeParent?: (number | string)[],
     defectTypeChild?: (number | string)[],
     numberObservations?: (number | string)[],
     photo?: (number | string)[],
     warehouse?: (number | string)[],
     factoryReturn?: (boolean)[],
     contact?: (number | string)[],
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

   export interface test {
    id?: number;
    name?:string,
    code:string

  }
}
