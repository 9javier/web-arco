import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HttpRequestModel } from "../../../models/endpoints/HttpRequest";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ModelService {

  private getTableInfoURL: string = environment.apiBase + "/onBoardingDomains/paginated";
  private getSizePerModelURL: string = environment.apiBase + "/onBoardingDomains/sizes/";

  constructor(
    private http: HttpClient,
  ) {}


  getTableInfo(data){
    return this.http.post<HttpRequestModel.Response>(this.getTableInfoURL, data).pipe(
      map(resp => resp.data)
    )
  }
  
  getSizePerModel(id){
    return this.http.get<HttpRequestModel.Response>(this.getSizePerModelURL+id).pipe(
      map(resp => resp.data)
    )
  }
  
  // getFilters(){
  //   return this.http.get<HttpRequestModel.Response>(this.postGetFiltersUrl).pipe(
  //     map(resp => resp.data)
  //   )
  // }

  // getHistorical(id){
  //   const body = {
  //     orderId:id
  //   }
  //   return this.http.post<HttpRequestModel.Response>(this.getHistoryDeatilsPackages, body).pipe(
  //     map(resp => resp.data)
  //   )
  // }


}
