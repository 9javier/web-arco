import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {
  private defectTypesChildUrl: string = environment.apiBase + '/defects/child'
  private incidentsUrl: string = environment.apiBase + '/incidents';
  private addRegistryUrl: string = environment.apiBase + '/defects/registry/add';
  private statusManagamentDefectUrl: string = environment.apiBase + '/classification'
  private getAllIncidentProductUrl: string = this.incidentsUrl + '/all'
  constructor(private http: HttpClient) { }

  getDefectTypesChild() {
    return this.http.get<HttpRequestModel.Response>(this.defectTypesChildUrl).pipe(map(resp => resp.data));
  }

  getDtatusManagamentDefect() {
    return this.http.get<HttpRequestModel.Response>(this.statusManagamentDefectUrl).pipe(map(resp => resp.data));
  }

  storeIncidentProduct(data) {
    return this.http.post<HttpRequestModel.Response>(this.incidentsUrl, data).pipe(map(resp => resp.data));
  }

  addRegistry(data) {
    return this.http.post<HttpRequestModel.Response>(this.addRegistryUrl, data).pipe(map(resp => resp.data));
  }

  getAllIncidentProduct(data) {
    return this.http.post<HttpRequestModel.Response>(this.getAllIncidentProductUrl, data).pipe(map(resp => resp.data));
  }



}
