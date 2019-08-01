import { Request } from './request';
import { WarehouseModel } from './Warehouse';
export namespace UserTimeModel{

    export interface UserTimeRequest{
        type:number;
        force:boolean;
    }
    
    export interface UserTimeResponse extends Request.Success{
        data:UserTime
    }

    export interface UserTime{
        user: {
            id: number;
            email: string;
            name: string;
            address: string;
            phone: string;
            employedId: number;
            hasWarehouse: boolean;
            permits: Array<any>;
            warehouse: WarehouseModel.Warehouse;
        },
        inputDate: string;
        outputDate: string;
        createdAt: string;
        updatedAt: string;
        id: number;
    }
}