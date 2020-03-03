import { Request } from './request';
import { WarehouseModel } from './Warehouse';
import { TariffModel } from './Tariff';
import { ModelModel, SizeModel } from '@suite/services';
import {StockModel} from "./Stock";
import {HttpRequestModel} from "./HttpRequest";
export namespace ReceptionFinalModel{


    export interface receptionFinalData{
        
        id:number,
        recepTtionFinal:boolean,
        warehouseId:{
            id: number,
            name: string,
            description: string,
            reference: string,
            is_store: boolean,
            is_main: boolean,
            has_racks: boolean,
            is_outlet: boolean,
            packingType: number
        }
    }

    export interface receptionFinal{
        data:receptionFinal
       
    }

    

}