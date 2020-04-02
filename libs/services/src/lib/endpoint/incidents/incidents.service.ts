import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {
  private defectTypesChildUrl: string = environment.apiBase + '/defects/child';
  private defectTypesParentUrl: string = environment.apiBase + '/defects/parent';
  private incidentsUrl: string = environment.apiBase + '/incidents';
  private addRegistryUrl: string = environment.apiBase + '/defects/registry/add';
  private statusManagamentDefectUrl: string = environment.apiBase + '/classification';
  private getAllIncidentProductUrl: string = this.incidentsUrl + '/all';
  private getByIdIncidentProductUrl: string = environment.apiBase + '/defects/registry/get-last-historial-product';
  private getDataUrl: string = environment.apiBase + '/defects/registry/get-data';
  private defectZonesChildUrl: string = environment.apiBase + '/defects/zones/child';

  constructor(private http: HttpClient) { }

  getDefectTypesChild() {
    return this.http.get<HttpRequestModel.Response>(this.defectTypesChildUrl).pipe(map(resp => resp.data));
  }

  getDefectTypesParent() {
    return this.http.get<HttpRequestModel.Response>(this.defectTypesParentUrl).pipe(map(resp => resp.data));
  }

  getDefectZonesChild() {
    return this.http.get<HttpRequestModel.Response>(this.defectZonesChildUrl).pipe(map(resp => resp.data));
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

  getOneIncidentProductById(data) {
    return this.http.post<HttpRequestModel.Response>(this.getByIdIncidentProductUrl, data).pipe(map(resp => resp.data));
  }

  getData(data) {
    return this.http.post<HttpRequestModel.Response>(this.getDataUrl, data).pipe(map(resp => resp.data));
  }

}
