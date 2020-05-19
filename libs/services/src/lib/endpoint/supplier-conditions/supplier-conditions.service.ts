import { HttpRequestModel } from 'libs/services/src/models/endpoints/HttpRequest';
import { Injectable } from '@angular/core';
import { from, Observable } from "rxjs";
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { SupplierConditionModel} from '../../../models/endpoints/SupplierCondition';
import { BrandModel } from '../../../models/endpoints/Brand';
import { ProviderModel } from '../../../models/endpoints/Provider';
import { environment } from '../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { response } from 'express';
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class SupplierConditionsService {
  private baseUrl: string;
  private indexUrl: string;
  private entitiesUrl: string;
  private sendexcell: string;
  private deleteUrl: string;
  private storeUrl: string;
  private updateUrl: string;
  private providersUrl: string;
  private brandsUrl: string;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {
    this.baseUrl = environment.apiSorter;
    this.indexUrl = `${this.baseUrl}/supplier-conditions`;
    this.entitiesUrl = `${this.baseUrl}/supplier-conditions/entities`;
    this.sendexcell = `${this.baseUrl}/supplier-conditions/export-to-excel`;
    this.deleteUrl = `${this.baseUrl}/supplier-conditions/delete`;
    this.storeUrl = `${this.baseUrl}/supplier-conditions/store`;
    this.updateUrl = `${this.baseUrl}/supplier-conditions/update/{{id}}`;
    this.providersUrl = `${this.baseUrl}/supplier-conditions/providers`;
    this.brandsUrl = `${this.baseUrl}/supplier-conditions/brands-by-provider`;
  }

  index(body: SupplierConditionModel.IndexRequest): Observable<SupplierConditionModel.DataSource> {
    return this.http.post<HttpRequestModel.Response>(this.indexUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  entities() {
    const body = {
      providers: [],
      brands: [],
      noClaim: [],
      contacts: []
    };

    return this.http.post<HttpRequestModel.Response>(this.entitiesUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  delete(ids: number[]) {
    let body = { ids };

    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post(this.deleteUrl, body, { headers })
    }))
  }

  store(supplierCondition): Observable<SupplierConditionModel.SupplierCondition> {
    return this.http.post<SupplierConditionModel.ResponseStore>(this.storeUrl, supplierCondition).pipe(map(response => {
      return response.data;
    }));
  }

  update(id, supplierCondition) {
    return this.http.put<SupplierConditionModel.ResponseUpdate>(this.updateUrl.replace("{{id}}", String(id)), supplierCondition).pipe(map(response => {
      return response.data;
    }));
  }

  getFileExcell(parameters: any) {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      // let headers:HttpHeaders = new HttpHeaders({Authorization:token});


      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post(this.sendexcell, parameters, { headers, responseType: 'blob' });
    }));
  }

  getProviders(body: any): Observable<ProviderModel.Provider> {
    return this.http.post<HttpRequestModel.Response>(this.providersUrl, body).pipe(
      map(resp => resp.data)
    )
  }


  getBrandsOfProvider(body): Observable<BrandModel.Brand> {
    return this.http.post<HttpRequestModel.Response>(this.brandsUrl, body).pipe(
      map(resp => resp.data)
    )
  }

}
