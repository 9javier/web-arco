import { WarehouseModel} from './Warehouse';
import { Request } from './request';
export namespace CalendarModel{
    export interface Template{
        createAt:string;
        updateAt:string;
        id:number;
        warehouses:Array<{
            createAt:string;
            updateAt:string;
            id:number;
            originWarehouse:WarehouseModel.Warehouse;
            warehousesDestinations:Array<{
                createAt:string;
                updateAt:string;
                id:number;
                destinationWarehouse:WarehouseModel.Warehouse;    
            }>;
        }>;
    }
    export interface SingleTemplateRequest extends Request.Success{
        data:Template
    }

    export interface CollectionTemplateRequest extends Request.Success{
        data:Array<Template>;
    }
}