import { HttpRequestModel } from 'libs/services/src/models/endpoints/HttpRequest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DefectiveRegistryModel } from '../../../models/endpoints/DefectiveRegistry';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExpeditionManualService {
  private baseUrl: string;
  private getTrasnports: string;
  private epxeditionManualStore: string;
  private getIncidences: string;
  private getFilter: string;
  private getIncidenceById: string;

  constructor(private http: HttpClient) {
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
  
}
