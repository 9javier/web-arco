import { Request } from './request';
export namespace TariffModel{
    export interface Tariff{
        tariffsQuantity:number;
        tariffId?:number;
        tariffName:string;
        activeFrom:string;
        activeTill:string;
        updated:boolean;
    }
    export interface ResponseTariffPaginator{
        results:Array<Tariff>;
        pagination:{
            selectPage:number;
            fisrtPage:number;
            lastPage:number;
            limit:number;
            totalResults:number;
        }
    }
    export interface ResponseTariff extends Request.Success{
        data:ResponseTariffPaginator;
    }
    export interface TariffUpdates {
        results:Array<any>
    }

    export interface ResponseTariffUpdates {
        data:TariffUpdates;
    }
}