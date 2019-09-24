import { Request } from './request';
export namespace TemplateZoneModel{

    export interface Zone{
        zoneNumber: number;
        color: number;
        active: boolean;
        name: string;
        zoneWays?: any,
        zoneWarehouses?: any;
        template?: number;
        id: number;
    }

    export interface ZoneWarehouse {
        zone: number;
        warehouses: number[];
    }
    
    export interface ZonesWarehouses {
        zones: ZoneWarehouse[];
    }

    export interface ResponseZone{
        data:Array<Zone>;
    }

    export interface ResponseZoneCreate{
        data:Zone;
    }
}