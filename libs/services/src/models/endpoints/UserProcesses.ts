import { ProcessModel } from './Process';

export namespace UserProcessesModel {
  export interface UserProcesses {
    id?: number;
    name: string;
    email?: string;
    processes?:  Array<ProcessModel.Process>;
    performance?: number;
  }

  export interface ResponseIndex {
    data: UserProcesses[];
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
