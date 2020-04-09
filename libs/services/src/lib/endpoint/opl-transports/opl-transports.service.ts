import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';
import { map } from 'rxjs/operators';
import { OplTransportsModel } from '../../../models/endpoints/opl-transports.model'

@Injectable({
  providedIn: 'root'
})
export class OplTransportsService {

  private filtersUrl: string;
  private filtersTransportUrl: string;
  private orderExpeditionUrl: string

  constructor(private http: HttpClient) { 
    this.filtersUrl = `${environment.apiBase}/opl-expedition/order-expedition/get-filters`;
    this.filtersTransportUrl = `${environment.apiBase}/opl-expedition/order-expedition/get-tranports-filters`;
    this.orderExpeditionUrl = `${environment.apiBase}/opl-expedition/order-expedition/filter`;
  }

  getFilters(){
    return this.http.get<HttpRequestModel.Response>(this.filtersUrl).pipe(map(res => res.data));
  }
  getTransports() {
    return this.http.get<HttpRequestModel.Response>(this.filtersTransportUrl).pipe(map(res => res.data));
  }

  getList(body: OplTransportsModel.OrderExpeditionFilterRequest) {
    return this.http.post<HttpRequestModel.Response>(this.orderExpeditionUrl,body).pipe(map(res => res.data));
  }

}
