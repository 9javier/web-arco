import { Request } from './request';
export namespace WarehouseMapsModel{

    export interface Rack{
        id?:number;
        enabled:boolean;
        hall:number;
        columns:number;
        rows:number;
    }

    export interface WarehouseConfigured {
        id: number;
        row: number;
        column: number;
        enabled: boolean;
        reference: string;
        lock: boolean;
        on_right_side: boolean;
        items: number;
    }

    export interface ResponseConfigLocations extends Request.Success{
        data:WarehouseConfigured
    }

    export interface ConfigurationParam{
        processTypeId: number,
        status: boolean,
        rack_pattern: string,
        row_pattern: string,
        column_pattern: string
    }

    export interface ResponseRacksIndex extends Request.Success{
        data:Array<Rack>;
    }

    export interface LocationWarehouse{
      id: number,
      row: number,
      column: number,
      enabled: boolean,
      reference: string,
      lock: boolean,
      on_right_side: boolean,
      items: number
    }

    export interface ResponseGetLocationsWarehouse extends Request.Success{
        data: Array<LocationWarehouse>;
    }
}
