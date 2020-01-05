import { Request } from './request';
import { WarehouseModel } from './Warehouse';
import { TariffModel } from './Tariff';
import { ModelModel, SizeModel } from '@suite/services';
import {StockModel} from "./Stock";
import {HttpRequestModel} from "./HttpRequest";
export namespace NewProductModel{

    export interface NewProduct{
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
        tariffId: number,
        model: ModelModel.Model,
        status?: number,
        stockStore?: StockModel.Stock,
        size: SizeModel.Size[]
    }

    export interface StatusType{
        id:number,
        name:string
    }

    export interface ResponseStatusType extends Request.Success{
        data:StatusType[],
    }

    export interface ResponseNewProductsPaginated{
        results:Array<NewProduct>;
        pagination: {
            selectPage:number;
            fisrtPage:number;
            lastPage:number;
            limit:number;
            totalResults:number;
        }
        filters: {
            ordertypes: Array<{
                id: number,
                name: string
            }>
        }
    }

    export interface ResponseNewProductsByProductsReferences extends HttpRequestModel.Response {
      data: NewProductsByModelTariff[],
      message: string,
      code: number
    }

    export interface ResponseNewProduct extends Request.Success{
        data:ResponseNewProductsPaginated
    }

    export interface ResponseNewProductsByModelTariff extends Request.Success{
        data:Array<Array<NewProductsByModelTariff>>;
    }

    export interface ProductsReferences {
      references: string[]
    }

    export interface NewProductsByModelTariff extends Request.Success{
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
        },
        range?: {
          createdAt: string,
          updatedAt: string,
          id: number,
          numRange: number,
          startRange: number,
          endRange: number,
          isAvelon: boolean
        },
      rangesNumbers?: {
        sizeRangeNumberMin: string,
        sizeRangeNumberMax: string
      }
    }

}
