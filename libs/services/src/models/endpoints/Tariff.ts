import { Request } from './request';
export namespace TariffModel{
    export interface Tariff{
        id?:number;
        name:string;
        initDate:string;
        endDate:string;
    }
    export interface ResponseTariff extends Request.Success{
        data:Array<Tariff>;
    }
}