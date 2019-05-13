export namespace JailModel {
  export interface Jail {
    id?: number;
    reference?: string;
  }
  export interface ResponseIndex {
    data: Jail[];
  }

  export interface ResponseStore {
    data: {
      id: number;
      reference: string;
    };
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: {
      id: number;
      reference: string;
    };
    message: string;
    code: number;
  }

  export interface ResponseUpdate {
    data: {
      id: number;
      reference: string;
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
