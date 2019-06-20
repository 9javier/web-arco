import { Request } from './request';
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

    export interface ResponsePrice extends Request.Success{
        data:Array<Price>
    }

}