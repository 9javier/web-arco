export namespace WarehouseModel {
  export interface Warehouse {
    id?: number;
    name?: string;
    description?: string;
    reference?: string;
    is_store?: boolean;
    is_main?: boolean;
    groupId?: number;
  }

  export interface ResponseIndex {
    data: Warehouse[];
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: Warehouse;
  }

  export interface ErrorResponseShow {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
