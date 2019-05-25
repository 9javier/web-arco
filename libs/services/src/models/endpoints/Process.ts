export namespace ProcessModel {
  export interface Process {
    id?: number;
    name: string;
  }

  export interface ResponseIndex {
    data: Process[];
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: Process;
  }

  export interface ErrorResponseShow {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
