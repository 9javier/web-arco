import { HttpRequestModel } from 'libs/services/src/models/endpoints/HttpRequest';
import { Injectable } from '@angular/core';
import { from, Observable } from "rxjs";
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { ReturnTypeModel} from '../../../models/endpoints/ReturnType';
import { environment } from '../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { response } from 'express';
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class ReturnTypesService {
  private baseUrl: string;
  private indexUrl: string;
  private entitiesUrl: string;
  private sendexcell: string;
  private deleteUrl: string;
  private storeUrl: string;
  private updateUrl: string;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {
    this.baseUrl = environment.apiSorter;
    this.indexUrl = `${this.baseUrl}/return-types`;
    this.entitiesUrl = `${this.baseUrl}/return-types/entities`;
    this.sendexcell = `${this.baseUrl}/return-types/export-to-excel`;
    this.deleteUrl = `${this.baseUrl}/return-types/delete`;
    this.storeUrl = `${this.baseUrl}/return-types/store`;
    this.updateUrl = `${this.baseUrl}/return-types/update/{{id}}`;
  }

  index(body: ReturnTypeModel.IndexRequest): Observable<ReturnTypeModel.DataSource> {
    return this.http.post<HttpRequestModel.Response>(this.indexUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  entities() {
    const body = {
      names: [],
      defective: []
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

  store(returnType): Observable<ReturnTypeModel.ReturnType> {
    return this.http.post<ReturnTypeModel.ResponseStore>(this.storeUrl, returnType).pipe(map(response => {
      return response.data;
    }));
  }

  update(id, returnType) {
    return this.http.put<ReturnTypeModel.ResponseUpdate>(this.updateUrl.replace("{{id}}", String(id)), returnType).pipe(map(response => {
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

}
