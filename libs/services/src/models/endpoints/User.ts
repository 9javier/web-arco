export namespace UserModel {

  export interface List {
    permissions: Permission[],
    list_roles: Role[]
  }

  export interface Permission {
    id: number,
    user: {
      id: number,
      email: string,
      name: string,
      hasWarehouse: boolean
    },
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
    roles: Role[]
  }

  export interface Role {
    createdAt: string,
    updatedAt: string,
    id: number,
    name: string,
    description: string,
    sga_enabled: boolean,
    app_enabled: boolean,
    status: boolean
  }

  export interface Filters {
    users?: number[],
    warehouses?: number[]
  }

  export interface FilterOptionsRequest {
    type: {
      users: boolean,
      warehouses: boolean
    },
    currentFilter?: {
      id: number,
      value?: string
    }[]
  }

  export interface FilterOptions {
    users?: FilterOption[],
    warehouses?: FilterOption[]
  }

  export interface FilterOption {
    id: number,
    value: string,
    checked?: boolean
  }

  export interface ModalResponse {
    userId: number,
    warehouseId: number,
    roles: {
      id: number,
      name: string,
      isChecked: boolean
    }[]
  }

  export interface User {
    id?: number;
    email?: string;
    name: string;
    password?: string;
    address?: string;
    employeId?:number;
    hasWarehouse?: boolean
  }
  export interface ResponseIndex {
    data: User[];
  }
  export interface ResponseStore {
    data: {
      id: number;
      email: string;
      name: string;
    };
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: {
      id: number;
      email: string;
      name: string;
      warehouse?: {
        id: number;
      };
      permits:[{
        id:number;
        warehouse:{
          name:string;
          id:number;
        },
        roles:[{
          id:number;
          rol:{
            id:number;
            name:string;
          }
        }]
      }]
    };
    message: string;
    code: number;
  }

  export interface ResponseUpdate {
    data: {
      id: number;
      email: string;
      name: string;
    };
    message: string;
    code: number;
  }

  export interface ResponseDestroy {
    data: number;
    message: string;
    code: number;
  }

  export interface ResponseHasDeleteProductPermission {
    data: boolean;
    message: string;
    code: number;
  }

  export interface ErrorResponseIndex {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
