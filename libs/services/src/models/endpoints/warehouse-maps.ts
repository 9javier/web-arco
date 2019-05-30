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
        rackId: number,
        row: number,
        column: number
    }

    export interface ResponseRacksIndex extends Request.Success{
        data:Array<Rack>;
    }
}