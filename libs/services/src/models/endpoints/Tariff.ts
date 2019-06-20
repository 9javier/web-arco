import { Request } from './request';
export namespace TariffModel{
    export interface Tariff{
        tariffsQuantity:number;
        tariffId?:number;
        tariffName:string;
        activeFrom:string;
        activeTill:string;
    }
    export interface ResponseTariff extends Request.Success{
        data:Array<Tariff>;
    }
}