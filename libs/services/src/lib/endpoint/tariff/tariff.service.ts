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
   * @returns observable with the tariff
   */
  getIndex():Observable<Array<TariffModel.Tariff>>{
    return this.http.post<TariffModel.ResponseTariff>(this.getIndexUrl,{
      warehouseId: 51
    }).pipe(map(response=>{
      return response.data;
    }));
  }
}