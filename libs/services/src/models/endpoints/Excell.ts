export namespace ExcellModell {

    
  export interface fileExcell {
    warehouses: any[];
    containers: any[];
    models: any[];
    colors: any[];
    sizes: any[];
    pagination: Pagination;
    orderby: Orderby;
  }

  interface Orderby {
    type: number;
    order: string;
  }

  interface Pagination {
    page: number;
    limit: number;
  }
}