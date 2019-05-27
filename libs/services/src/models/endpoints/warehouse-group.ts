import {Request} from './request';
export namespace WarehouseGroupModel{
    export interface WarehouseGroup{
        createdAt: string;
        string: string;
        id: number;
        name: string;
        warehouses:Array<{        
            id?: number;
            name: string;
            description: string;
            reference: string;
            is_store?: boolean;
            is_main?: boolean;
            has_racks?: boolean;
        }>;
    }
    export interface ResponseWarehouseGroup extends Request.Success{
        data:Array<WarehouseGroup>
    }
}