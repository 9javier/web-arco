import { Request } from './request';
import { WarehouseModel } from './Warehouse';
import { TariffModel } from './Tariff';
import {ModelModel} from "@suite/services";
import {StockModel} from "./Stock";
import {HttpRequestModel} from "./HttpRequest";
import {BrandModel} from "./Brand";
import {LifestyleModel} from "./Lifestyle";
export namespace PriceModel{

    export interface SizeRange{
      rangesNumbers: {
        sizeRangeNumberMin: string,
        sizeRangeNumberMax: string
      }
    }

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
        tariffId: number,
        model: ModelModel.Model,
        status?: number,
        stockStore?: Array<StockModel.Stock>
    }

    export interface StatusType{
        id:number,
        name:string
    }

    export interface ResponseStatusType extends Request.Success{
        data:StatusType[],
    }

    export interface ResponsePricePaginated{
        results:Array<Price>;
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

    export interface ResponsePricesByProductsReferences extends HttpRequestModel.Response {
      data: PriceByModelTariff[],
      message: string,
      code: number
    }

    export interface ResponsePrice extends Request.Success{
        data:ResponsePricePaginated
    }

    export interface ResponsePriceByModelTariff extends Request.Success{
        data:Array<Array<PriceByModelTariff>>;
    }

    export interface ProductsReferences {
      references: string[],
      tariffId?: number
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
        totalPrice: string,
        priceOriginal: string,
        priceDiscount: string,
        priceDiscountOutlet: string,
        activeTill: string,
        activeFrom: string,
        tariffName: string,
        numRange: number,
        hash: string,
        hashPrices?: string,
        status?: number,
        enabled?: boolean,
        warehouse:WarehouseModel.Warehouse,
        tariff: {
          createdAt: string,
          updatedAt: string,
          id: number,
          name: string,
          activeFrom: string,
          activeTill: string,
          avelonId: number,
          datasetHash: string,
          discountReasonId: number,
          processing: boolean,
          softDeleted: boolean,
          enabled: boolean
        },
        model: {
            createdAt: string,
            updatedAt: string,
            id: number,
            reference: string,
            name: string,
            hash: string,
            avelonInternalBrandId: number,
            detailColor: string,
            season: {
              createdAt: string,
              updatedAt: string,
              id: number,
              name: string,
              avelonId: string,
              datasetHash: string
            },
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
                reference: string,
                name: string
            },
            brand: BrandModel.Brand,
            lifestyle: {
              createdAt: string,
              updatedAt: string,
              id: number,
              avelonId: string,
              reference: string,
              name: string,
              groupNumber: number,
              datasetHash: string
            },
            category:{
              createdAt: string,
              updatedAt: string,
              id: number,
              avelonId: string,
              reference: string,
              name: string,
              groupNumber: number,
              datasetHash: string
            }
        },
        sizeModelRange?: {
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
