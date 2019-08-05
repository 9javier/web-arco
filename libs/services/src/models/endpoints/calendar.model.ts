import { WarehouseModel} from './Warehouse';
import { Request } from './request';
export namespace CalendarModel{
    export interface Template{
        createAt:string;
        updateAt:string;
        id:number;
        date?:string;
        warehouses:Array<TemplateWarehouse>;
    }

    export interface CalendarDateResponse extends Request.Success{
        data:Array<string>
    }

    export interface TemplateWarehouse{
        createAt:string;
        updateAt:string;
        id:number;
        originWarehouse:WarehouseModel.Warehouse;
        destinationsWarehouses:Array<{
            createAt:string;
            updateAt:string;
            id:number;
            destinationWarehouse:WarehouseModel.Warehouse;    
        }>;
    }

    export interface SingleTemplateRequest extends Request.Success{
        data:Template
    }

    export interface BadRequest extends Request.Success{
        data:Array<TemplateWarehouse>;
    }

    export interface SingleTemplateParams{
        dates?:Array<string>;
        name?:string;
        warehouses:Array<{
            originWarehouseId:number;
            destinationWarehouseIds:number;
        }>
    }

    export interface CollectionTemplateRequest extends Request.Success{
        data:Array<Template>;
    }
}