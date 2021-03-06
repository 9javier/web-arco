import { HttpRequestModel } from 'libs/services/src/models/endpoints/HttpRequest';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DefectiveRegistryModel } from '../../../models/endpoints/DefectiveRegistry';
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ExpeditionCollectedService {
  private baseUrl: string;
  private getExpeditionsUrl: string;
  private epxeditionManualStore: string;
  private getIncidences: string;
  private getFilter: string;
  private getIncidenceById: string;
  private getProductsPackageByIdExpedition: string;
  private getFiltersPackages: string;
  private updatePackages: string;
  private getTransports: string;
  private getIncidenceInsideFiltersUrl: string;
  private getPacketsInsideUrl: string;
  private getFileExcellUrl: string;
  private $id = new BehaviorSubject({});
  private id = this.$id.asObservable();
  private emitData = new BehaviorSubject({});
  private getData$ = this.emitData.asObservable();
  private sendButtonEmit = new BehaviorSubject({});
  private getDataUpdateButton$ = this.sendButtonEmit.asObservable();
  private idTab;
  private idTab_;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiSorter;
    this.getExpeditionsUrl = `${this.baseUrl}/opl-expedition/transports`;
    this.epxeditionManualStore = `${this.baseUrl}/expeditions-manual/store`;
    this.getIncidences = `${this.baseUrl}/expeditions-manual/get-expedition-inside`;
    this.getFilter = `${this.baseUrl}/opl-expedition/transports/get-filters-expedition`;
    this.getIncidenceById = `${this.baseUrl}/expeditions-manual/get-incidence-id`;
    this.getProductsPackageByIdExpedition = `${this.baseUrl}/opl-expedition/transports/get-expedition-package`;
    this.getFiltersPackages = `${this.baseUrl}/opl-expedition/transports/get-expedition-package/filters`;
    this.updatePackages = `${this.baseUrl}/opl-expedition/transports/get-expedition-package/updatePackages`;
    this.getTransports = `${this.baseUrl}/expeditions-manual/get-transports`;
    this.getIncidenceInsideFiltersUrl = `${this.baseUrl}/expeditions-manual/get-expedition-inside/`;
    this.getPacketsInsideUrl = `${this.baseUrl}/opl-expedition/op-orders/index/`;
    this.getFileExcellUrl = `${this.baseUrl}/opl-expedition/op-orders/excel`;
  }

  store(body): Observable<any>{
    console.log('datos:', body);
    return this.http.post<HttpRequestModel.Response>(this.epxeditionManualStore, body).pipe(
      map(resp => resp.data)
    )
  }

  getExpeditions(body): Observable<any>{
    return this.http.post<HttpRequestModel.Response>(this.getExpeditionsUrl, body).pipe(
      map(resp => {
        return resp.data
      }) 
    )
  }

  getFilters(){
    return this.http.get<HttpRequestModel.Response>(this.getFilter).pipe(
      map(resp => {
        return resp.data
      }) 
    )
  }

  getFiltersPackage(id){
    const body = {
      idTransport:id
    };
    return this.http.post<HttpRequestModel.Response>(this.getFiltersPackages, body).pipe(
      map(resp => {
        return resp.data
      }) 
    )
  }

  getPackages(body):Observable<any>{
    return this.http.post<HttpRequestModel.Response>(this.getProductsPackageByIdExpedition, body).pipe(
      map(resp => {
        return resp.data
      }) 
    )
  }

  setEmitId(data: any){
    this.$id.next(data);
  }
  getEmitId(){
    return this.id;
  }

  updatePackage(data){
    const body = {
      packages:data
    };
    console.log(body);
    return this.http.post<HttpRequestModel.Response>(this.updatePackages, body).pipe(
      map(resp => {
        return resp.data
      }) 
    );
  }

  getTrasnport(): Observable<any>{
    return this.http.get<HttpRequestModel.Response>(this.getTransports).pipe(
      map(resp => resp.data)
    )
  }

  refreshTabTransport() {
    this.emitData.next(this.idTab);
  }
  setEmitTabId(idTab) {
    this.idTab = idTab;
    this.emitData.next(this.idTab);
  }

  getData(){
    return this.getData$;
  }

  getIncidenceInsideFilters():Observable<any>{
    return this.http.get<HttpRequestModel.Response>(this.getIncidenceInsideFiltersUrl).pipe(
      map(resp => resp.data)
    )
  }

  getPacketsInside(body):Observable<any>{
    return this.http.post<any>(this.getPacketsInsideUrl, body).pipe(
      map(resp =>{
        return resp.data;
      })
    );
  }


  getFileExcell(form: any){
    return this.http.post(this.getFileExcellUrl, form,{responseType: 'blob'})
  }


}
