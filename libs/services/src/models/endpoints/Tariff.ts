import { Request } from './request';
export namespace TariffModel{
    export interface Tariff{
        tariffsQuantity:number;
        tariffId?:number;
        tariffName:string;
        activeFrom:string;
        activeTill:string;
    }
    export interface ResponseTariffPaginator{
        results:Array<Tariff>;
        pagination:{
            page:number;
            limit:number;
            totalResults:number;
        }
    }
    export interface ResponseTariff extends Request.Success{
        data:ResponseTariffPaginator;
    }
}