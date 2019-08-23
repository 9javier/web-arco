import { Request } from './request';
import { WarehouseModel } from './Warehouse';

export namespace AgencyModel{

    export interface Agency{
        id:number;
        name:string;
        address:string;
        phone:number;
        warehouses: WarehouseModel.Warehouse;
        
    }

    export interface Response extends Request.Success{
        data:Array<Agency>;
    }

    export interface SingleResponse extends Request.Success{
        data:Agency;
    }

    export interface Request extends Request.Success{
        name:string;
        address:string;
        phone:string;
        warehouses: WarehouseModel.Warehouse;
    }

}