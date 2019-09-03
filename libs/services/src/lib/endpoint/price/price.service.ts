import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PriceModel } from 'libs/services/src/models/endpoints/Price';
import { Enum } from 'libs/services/src/models/enum.model';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  /**urls of for the price service */
  private getIndexUrl:string = environment.apiBase+"/tariffs/tariff";
  private getIndexByModelTariffUrl:string = environment.apiBase+"/tariffs/references";
  private postPricesByProductsReferencesUrl: string = environment.apiBase + "/tariffs/references-products";
  private getStatusEnumUrl:string = environment.apiBase + "/types/status-prices";
  private postPricesByModelUrl: string = environment.apiBase + "/tariffs/model";

  constructor(private http:HttpClient) { }

  /**
   * Get the prices relateds with a tariff
   * @param tariffId - the tariff id related to price
   * @param page
   * @param limit
   */
  // getIndex(tariffId:number,page:number,limit:number,status:number,warehouseId:number):Observable<PriceModel.ResponsePricePaginated>{
  //   return this.http.post<PriceModel.ResponsePrice>(this.getIndexUrl,{
  //    // warehouseId:warehouseId,
  //     tariffId:tariffId,
  //     status:status,
  //     pagination:{
  //       page:page,
  //       limit:limit
  //     }
  //   }).pipe(map(response=>{
  //     return response.data;
  //   }));
  // }

  /**
   * Get the prices relateds with a tariff
   * @param tariffId - the tariff id related to price
   * @param page
   * @param limit
   */
  getIndex(parameters):Observable<PriceModel.ResponsePricePaginated>{
    return this.http.post<PriceModel.ResponsePrice>(this.getIndexUrl,parameters).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Get enums with the status of prices
   */
  getStatusEnum():Observable<Array<PriceModel.StatusType>>{
    return this.http.get<PriceModel.ResponseStatusType>(this.getStatusEnumUrl).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Search prices by model tariff for print
   * @param object object for search
   */
  getIndexByModelTariff(object):Observable<Array<Array<PriceModel.PriceByModelTariff>>>{
    console.debug("PRINT::getIndexByModelTariff 1 [" + new Date().toJSON() + "]", object);
    return this.http.post<PriceModel.ResponsePriceByModelTariff>(this.getIndexByModelTariffUrl,object).pipe(map(response=>{
      console.debug("PRINT::getIndexByModelTariff 2 [" + new Date().toJSON() + "]", response);
      return response.data;
    }));
  }

  /**
   * Search prices by products references
   * @param parameters object for search
   */
  postPricesByProductsReferences(parameters: PriceModel.ProductsReferences): Observable<PriceModel.PriceByModelTariff[]> {
    console.debug("PRINT::postPricesByProductsReferences 1 [" + new Date().toJSON() + "]", parameters);
    return this.http.post<PriceModel.ResponsePricesByProductsReferences>(this.postPricesByProductsReferencesUrl, parameters).pipe(map(response => {
      console.debug("PRINT::postPricesByProductsReferences 2 [" + new Date().toJSON() + "]", response);
      return response.data;
    }));
  }

  postPricesByModel(model: string): Observable<any[]> {
    let parameters = {
      reference: model
    };

    return this.http.post<any>(this.postPricesByModelUrl, parameters).pipe(map(response=>{
      return response.data;
    }));
  }
}
