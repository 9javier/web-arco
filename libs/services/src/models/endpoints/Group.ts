export namespace GroupModel {
  export interface Group {
    id?: number;
    name: string;
    expanded: false;
  }

  export interface ResponseIndex {
    data: Group[];
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: Group;
  }

  export interface ErrorResponseShow {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
