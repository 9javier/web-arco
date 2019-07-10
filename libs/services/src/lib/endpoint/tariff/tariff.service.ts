import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TariffModel } from 'libs/services/src/models/endpoints/Tariff';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TariffService {

  /**urls for tariff service */
  private getIndexUrl:string = environment.apiBase+"/filter/prices";

  constructor(private http:HttpClient) { }

  /**
   * Get all tariff of the system
   * @param page
   * @param limit
   * @returns observable with the tariff
   */
  getIndex(page:number = 1, limit:number =1,id:number = 51):Observable<TariffModel.ResponseTariffPaginator>{
    return this.http.post<TariffModel.ResponseTariff>(this.getIndexUrl,{
      //warehouseId:id,
      pagination: {
        page: page,
        limit: limit
      }
    }).pipe(map(response=>{
      return response.data;
    }));
  }
}
