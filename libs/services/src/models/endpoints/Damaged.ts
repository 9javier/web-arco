export namespace DamagedModel {

  export interface List {
    classifications: Classifications[],
    statuses: Status[],
    list_actions: Action[]
  }

  export interface Classifications {
    createdAt: string,
    updatedAt: string,
    id: number,
    defectType: number,
    ticketEmit: boolean,
    passHistory: boolean,
    requirePhoto: boolean,
    requireContact: boolean,
    requireOk: boolean,
    allowOrders: boolean,
    shippedFallback: boolean
  }

  export interface Status {
    id: number,
    name: string
  }

  export interface Action {
    id: number,
    name: string
  }

  export interface ModalResponse {
    name: string,
    actions: {
      id: number,
      name: string,
      isChecked: boolean
    }[]
  }

  export interface ResponseIndex {
    data: List;
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
