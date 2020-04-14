import { HttpRequestModel } from 'libs/services/src/models/endpoints/HttpRequest';
import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, filter, switchMap} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DefectiveRegistryModel } from '../../../models/endpoints/DefectiveRegistry';
import { BehaviorSubject } from "rxjs";
import {AuthenticationService} from "@suite/services";

@Injectable({
  providedIn: 'root'
})
export class ExpeditionManualService {

  private apiGeneralLogisticOperator = environment.apiLogisticOperator;
  private createExpeditionUrl = this.apiGeneralLogisticOperator + '/expedition/';
  private getWarehouseUrl = this.apiGeneralLogisticOperator + '/warehouse-logistic/index';
  private getWarehouseLogisticUrl = this.apiGeneralLogisticOperator + '/warehouse-logistic/';
  private getLogisticsOperatorsUrl = this.apiGeneralLogisticOperator + '/logistics-operators/';

  private baseUrl: string;
  private getTrasnports: string;
  private epxeditionManualStore: string;
  private getIncidences: string;
  private getFilter: string;
  private getIncidenceById: string;

  constructor(private http: HttpClient, private auth: AuthenticationService,) {
    this.baseUrl = environment.apiSorter;
    this.getTrasnports = `${this.baseUrl}/expeditions-manual/get-transports`;
    this.epxeditionManualStore = `${this.baseUrl}/expeditions-manual/store`;
    this.getIncidences = `${this.baseUrl}/expeditions-manual/get-incidence`;
    this.getFilter = `${this.baseUrl}/expeditions-manual/get-incidence-filters`;
    this.getIncidenceById = `${this.baseUrl}/expeditions-manual/get-incidence-id`;
  }

  store(body): Observable<any>{
    console.log('datos:', body);
    return this.http.post<HttpRequestModel.Response>(this.epxeditionManualStore, body).pipe(
      map(resp => resp.data)
    )
  }

  getTrasnport(): Observable<any>{
    return this.http.get<HttpRequestModel.Response>(this.getTrasnports).pipe(
      map(resp => resp.data)
    )
  }

  getIncidence(body): Observable<any>{
    return this.http.post<HttpRequestModel.Response>(this.getIncidences, body).pipe(
      map(resp => {
        return resp.data
      })
    )
  }

  getFilters(body){
    return this.http.post<HttpRequestModel.Response>(this.getFilter, body).pipe(
      map(resp => {
        return resp.data
      })
    )
  }

  getExpedition(id){
    return this.http.get<HttpRequestModel.Response>(this.getIncidenceById+'/'+id).pipe(
      map(resp => resp.data)
    )
  }

  createExpedition(data):Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.post<any>(this.createExpeditionUrl, data, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  getWarehouse():Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getWarehouseUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  getLogisticsOperators():Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getLogisticsOperatorsUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }
}
