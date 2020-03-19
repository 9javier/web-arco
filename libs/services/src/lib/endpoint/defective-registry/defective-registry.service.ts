import { HttpRequestModel } from 'libs/services/src/models/endpoints/HttpRequest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { PredistributionModel } from '../../../models/endpoints/Predistribution';
import { ModelModel, ProductModel, SizeModel, WarehouseModel } from '@suite/services';
import Warehouse = WarehouseModel.Warehouse;
import Product = ProductModel.Product;
import { BrandModel } from '../../../models/endpoints/Brand';
import { SeasonModel } from '../../../models/endpoints/Season';
import Model = ModelModel.Model;
import Size = SizeModel.Size;
import Brand = BrandModel.Brand;
import Season = SeasonModel.Season;
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DefectiveRegistryModel } from '../../../models/endpoints/DefectiveRegistry';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DefectiveRegistryService {
  private baseUrl: string;
  private indexRegistryHistoricFalseUrl: string;
  private indexHistoricTrueUrl: string;
  private entitiesFiltersFalseUrl: string;
  private entitiesFiltersTrueUrl: string;
  private getHistoricalUrl: string;
  private getDefectList: string;
  private getLastHistoricalUrl: string;
  private emitData = new BehaviorSubject({});
  private getData$ = this.emitData.asObservable();

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiSorter;
    this.indexRegistryHistoricFalseUrl = `${this.baseUrl}/defects/registry/all/false`;
    this.indexHistoricTrueUrl = `${this.baseUrl}/defects/registry/all`;
    this.entitiesFiltersTrueUrl = `${this.baseUrl}/defects/registry/filters`;
    this.entitiesFiltersFalseUrl = `${this.baseUrl}/defects/registry/filters/false`;
    this.getHistoricalUrl = `${this.baseUrl}/defects/registry/product-historial`;
    this.getDefectList = `${this.baseUrl}/defects/registry/listDefects`;
    this.getLastHistoricalUrl = `${this.baseUrl}/defects/registry/get-last-historial-product`;
  }

  indexHistoricTrue(body: DefectiveRegistryModel.IndexRequest): Observable<DefectiveRegistryModel.DataSource> {
    return this.http.post<HttpRequestModel.Response>(this.indexHistoricTrueUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  indexHistoricFalse(body: DefectiveRegistryModel.IndexRequest): Observable<DefectiveRegistryModel.DataSource> {
    return this.http.post<HttpRequestModel.Response>(this.indexRegistryHistoricFalseUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  getFiltersEntitiesTrue() {
    const body = {
      storeDetection: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      numberObservations:[],
      barCode: [],
      photo: [],
      warehouse: [],
      factoryReturn: [],
    };

    return this.http.post<HttpRequestModel.Response>(this.entitiesFiltersTrueUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  getFiltersEntitiesFalse() {
    const body = {
      storeDetection: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      numberObservations:[],
      barCode: [],
      photo: [],
      warehouse: [],
      factoryReturn: [],
    };

    return this.http.post<HttpRequestModel.Response>(this.entitiesFiltersFalseUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  getHistorical(body):Observable<any>{
    return this.http.post(this.getHistoricalUrl, body).pipe(map((response:any)=>{
      return response.data;
    }));
  }

  getListDefect(body) {
    this.callList(body).subscribe(data =>{
      console.log(data);
      this.emitData.next(data);
    });
  }

  getData(){
      return this.getData$;
  }

  callList(form): Observable<any>{
    return this.http.post<any>(this.getDefectList,form).pipe(
      (map((resp:any)=>{
        return resp.data;
      }))
    ); 
  }

  getLastHistorical(body):Observable<any>{
    return this.http.post(this.getLastHistoricalUrl, body).pipe(map((response:any)=>{
      return response.data;
    }));
  }

}
