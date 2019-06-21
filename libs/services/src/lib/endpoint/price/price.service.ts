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

  constructor(private http:HttpClient) { }

  /**
   * Get the prices relateds with a tariff
   * @param warehouseId - the id of the warehouse of the price
   * @param tariffId - the tariff id related to price
   */
  getIndex(warehouseId:number = 51,tariffId:number):Observable<Array<PriceModel.Price>>{
    return this.http.post<PriceModel.ResponsePrice>(this.getIndexUrl,{
      warehouseId:warehouseId,
      tariffId:tariffId
    }).pipe(map(response=>{
      console.log("respuesta",response)
      return response.data;
    }));
  }
}
