import { Request } from './request';
import { WarehouseModel } from './Warehouse';
import { TariffModel } from './Tariff';
import { reference } from '@angular/core/src/render3';
export namespace PriceModel{
    
    export interface Price{
        createdAt: string,
        updatedAt: string,
        id: number,
        outlet: number,
        impress: number,
        discount: number,
        percent: number,
        percentOutlet: number,
        totalPrice: number,
        priceOriginal: number,
        priceDiscount: number,
        priceDiscountOutlet: number,
        activeTill: string,
        activeFrom: string,
        tariffPriceId: number,
        warehouseId: number,
        typeLabel: number,
        tariffFuture: number,
        tariffName: string,
        tariffId: number
    }

    export interface ResponsePricePaginated{
        results:Array<Price>;
        pagination: {
            page: number,
            limit: number,
            totalResults: number
        }
    }

    export interface ResponsePrice extends Request.Success{
        data:ResponsePricePaginated
    }

    export interface ResponsePriceByModelTariff extends Request.Success{
        data:Array<Array<PriceByModelTariff>>;
    }
    export interface PriceByModelTariff extends Request.Success{
        createdAt: string,
        updatedAt: string,
        id: number,
        typeLabel: number,
        outlet: boolean,
        impress: boolean,
        discount: boolean,
        tariffFuture: boolean,
        percent: number,
        percentOutlet: number,
        totalPrice: number,
        priceOriginal: number,
        priceDiscount: number,
        priceDiscountOutlet: number,
        activeTill: string,
        activeFrom: string,
        tariffName: string,
        numRange: number,
        hash: string,
        warehouse:WarehouseModel.Warehouse,
        tariff: TariffModel.Tariff,
        model: {
            createdAt: string,
            updatedAt: string,
            id: number,
            reference: string,
            name: string,
            datasetHash: number,
            hash: number,
            avelonInternalBrandId: number,
            season: number,
            color: {
                createdAt: string,
                updatedAt: string,
                id: number,
                avelonId: string,
                datasetHash: string,
                name: string,
                colorHex: string,
                description: string
            },
            domainSize: {
                id: number,
                reference: number,
                name: number
            },
            brand: any
        }
    }

}