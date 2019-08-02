import { Request } from './request';
import { WarehouseModel } from './Warehouse';
export namespace UserTimeModel{

    export interface UserTimeRequest{
        type:number;
    }

    export interface UserRegisterTime {
      id: number;
      inputDate: string;
      outputDate: string;
      createdAt: string;
      updatedAt: string;
    }

    export interface UserRegisterTimeResponse extends Request.Success {
      data: UserRegisterTime
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
