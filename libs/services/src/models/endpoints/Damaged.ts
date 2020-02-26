export namespace DamagedModel {

  export interface List {
    permissions: Permission[],
    list_actions: Action[]
  }

  export interface Permission {
    id: number,
    classification: {
      id: number,
      name: string,
    },
    status: {
      id: number,
      name: string,
    },
    actions: Action[]
  }

  export interface Action {
    createdAt: string,
    updatedAt: string,
    id: number,
    name: string,
    status: boolean
  }

  export interface Filters {
    classifications?: number[],
    statuses?: number[]
  }

  export interface FilterOptionsRequest {
    type: {
      classifications: boolean,
      statuses: boolean
    },
    currentFilter?: {
      id: number,
      value?: string
    }[]
  }

  export interface FilterOptions {
    classifications?: FilterOption[],
    statuses?: FilterOption[]
  }

  export interface FilterOption {
    id: number,
    value: string,
    checked?: boolean
  }

  export interface ModalResponse {
    classificationId: number,
    statusId: number,
    actions: {
      id: number,
      name: string,
      isChecked: boolean
    }[]
  }

  export interface Classification {
    id?: number;
    name: string;
  }
  export interface ResponseIndex {
    data: Classification[];
  }
  export interface ResponseStore {
    data: {
      id: number;
      name: string;
    };
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: {
      id: number;
      name: string;
      status?: {
        id: number;
      };
      permits:[{
        id:number;
        status:{
          name:string;
          id:number;
        },
        actions:[{
          id:number;
          action:{
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
