export namespace HallModel {
  export interface Hall {
    id?: number;
    enabled?: boolean;
    hall: number;
    columns?: number;
    rows?: number;
  }
  export interface ResponseIndex {
    data: Hall[];
  }
  export interface ResponseStore {
    data: {
      id: number;
      enabled: boolean;
      hall: number;
      columns: number;
      rows: number;
      warehouse: {
        id: number
      };
    };
    message: string;
    code: number;
  }

  export interface ResponseShow {
    data: [
      {
        id: number;
        row: number;
        column: number;
        enabled: boolean;
        reference: string;
        on_right_side: boolean;
      }
    ];
    message: string;
    code: number;
  }

  export interface ResponseUpdate {
    data?: {
      id: number;
      enabled: boolean;
      hall: number;
      columns: number;
      rows: number;
    };
    errors?: string;
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
