import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PriceModel } from 'libs/services/src/models/endpoints/Price';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  /**urls of for the price service */
  private getIndexUrl:string = environment.apiBase+"/filter/prices/tariff";
  private getIndexByModelTariffUrl:string = environment.apiBase+"/filter/prices/references";

  constructor(private http:HttpClient) { }

  /**
   * Get the prices relateds with a tariff
   * @param warehouseId - the id of the warehouse of the price
   * @param tariffId - the tariff id related to price
   */
  getIndex(warehouseId:number = 51,tariffId:number,page:number,limit:number):Observable<PriceModel.ResponsePricePaginated>{
    return this.http.post<PriceModel.ResponsePrice>(this.getIndexUrl,{
      warehouseId:warehouseId,
      tariffId:tariffId,
      pagination:{
        page:page,
        limit:limit
      }
    }).pipe(map(response=>{
      console.log("respuesta",response)
      return response.data;
    }));
  }

  /**
   * Search prices by model tariff for print
   * @param object object for search
   */
  getIndexByModelTariff(object):Observable<Array<Array<PriceModel.PriceByModelTariff>>>{
    return this.http.post<PriceModel.ResponsePriceByModelTariff>(this.getIndexByModelTariffUrl,object).pipe(map(response=>{
      return response.data;
    }));
  }
}
