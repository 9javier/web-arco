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
   * @param warehouseId - the warehouse of the tariff
   * @returns observable with the tariff
   */
  getIndex(warehouseId:number = 51):Observable<Array<TariffModel.Tariff>>{
    return this.http.post<TariffModel.ResponseTariff>(this.getIndexUrl,{
      warehouseId: warehouseId
    }).pipe(map(response=>{
      return response.data;
    }));
  }
}
