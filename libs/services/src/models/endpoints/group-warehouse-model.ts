import { WarehouseModel } from './Warehouse';
import { Request } from './request';

export namespace GroupWarehousePickingModel{
    export interface GroupWarehousePicking{
        createdAt:string;
        updatedAt:string;
        id:number;
        name:string;
        warehouses:Array<WarehouseModel.Warehouse>
    }

    export interface ResponseGroupWarehousePicking extends Request.Success{
        data:Array<GroupWarehousePicking>
    }

    export interface ResponseSingleGroupWarehousePicking extends Request.Success{
        data:GroupWarehousePicking;
    }

    export interface RequestGroupWarehousePicking{
        name:string;
    }
}