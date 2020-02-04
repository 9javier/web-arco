export namespace ExcellModell {


  export interface fileExcell {
    filters: any[];
    warehouses: any[];
    containers: any[];
    models: any[];
    colors: any[];
    sizes: any[];
    pagination: Pagination;
    orderby: Orderby;
  }

  interface Orderby {
    type: number|string;
    order: string;
  }

  interface Pagination {
    page: number;
    limit: number;
  }
}
