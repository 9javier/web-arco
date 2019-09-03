export namespace UserModel {
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

  export interface ErrorResponseIndex {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
