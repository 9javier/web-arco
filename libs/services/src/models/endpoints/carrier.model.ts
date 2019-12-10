import { Request } from './request';
import { WarehouseModel } from './Warehouse';

export namespace CarrierModel{

    export interface CarrierWarehouseDestiny{
        id:number;
        createAt:string;
        updateAt:string;
        warehouse:WarehouseModel.Warehouse;
        carrier: CarrierModel.Carrier
    }

    export interface Carrier{
        createdAt: string;
        updatedAt: string;
        id: number;
        reference: string;
        status: number;
        packingType: number;
        warehouse: WarehouseModel.Warehouse;
        carrierWarehousesDestiny:CarrierWarehouseDestiny;
      packingInventorys: any[]
    }

    export interface CarrierResponse extends Request.Success{
        data:Array<Carrier>;
    }

    export interface SingleCarrierResponse extends Request.Success{
        data:Carrier
    }

    export interface CarrierWarehouseDestinyResponse extends Request.Success{
        data:CarrierWarehouseDestiny
    }
}