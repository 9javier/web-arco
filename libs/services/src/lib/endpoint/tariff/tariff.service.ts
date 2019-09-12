import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TariffModel } from 'libs/services/src/models/endpoints/Tariff';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {SortModel} from "../../../models/endpoints/Sort";

@Injectable({
  providedIn: 'root'
})
export class TariffService {

  /**urls for tariff service */
  private getIndexUrl:string = environment.apiBase+"/tariffs";
  private postUpdateEnabledUrl:string = environment.apiBase+"/tariffs/status";
  private updateTariffStatusSGA : string = environment.apiBase+"/tariffs/updateState";// enable = 1/0
  private getTariffIfSoftdeleteSGA : string = environment.apiBase+"/tariffs/";
  private putTariffEnabledUrl: string = environment.apiBase+"/tariffs2/updateTariffsState";
  constructor(private http:HttpClient) { }

  /**
   * Get all tariff of the system
   * @param page
   * @param limit
   * @param sort
   * @returns observable with the tariff
   */
  getIndex(page: number = 1, limit: number = 1, sort: SortModel.Sort):Observable<TariffModel.ResponseTariffPaginator>{
    let params = {
      pagination: {
        page: page,
        limit: limit,
        sortField: sort ? sort.field : null,
        sortType: sort ? sort.type : null
      }
    };
    return this.http.post<TariffModel.ResponseTariff>(this.getIndexUrl, params).pipe(map(response=>{
      return response.data;
    }));
  }

  updateEnabled(list: any) {
    return this.http.put(this.putTariffEnabledUrl,list).pipe(map(response=>{
      return response;
    }));
  }

  getTariffIfSoftdelete() {
    return this.http.get<{
      data:{
        name: string;
        activeFrom: string;
        activeTill: string;
      }[]
    }>(this.getTariffIfSoftdeleteSGA,{}).pipe(map(response=>{
      return response;
    })).pipe(map(response=>{
      return response.data;
    }));
  }

}
