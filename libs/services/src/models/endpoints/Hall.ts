export namespace HallModel {
  export interface Hall {
    id?: number;
    enabled?: boolean;
    hall?: number;
    columns?: number;
    rows?: number;
    warehouse?: {id: number};
    items?: number;
  }
  export interface HallFull extends Hall {
    containers?: any[];
  }
  export function formToMap(formHall) {
    return {
      rows: formHall.rows,
      columns: formHall.columns,
      warehouse: {
        id: formHall.warehouse
      }
    }
  }
  export interface ResponseIndex {
    data: Hall[];
  }
  export interface ResponseFullIndex {
    data: HallFull[];
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
        selected: boolean;
        items: number;
        incidence: string;
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

  export interface ResponseUpdateEnable {
    data?: any;
    message: string;
    name: string;
  }

  export interface ResponseUpdateDisable {
    data?: any;
    message: string;
    name: string;
  }

  export interface ResponseUpdateLock {
    data?: any;
    message: string;
    code: number;
    name: string;
  }

  export interface ResponseUpdateUnlock {
    data?: any;
    message: string;
    code: number;
    name: string;
  }
}
