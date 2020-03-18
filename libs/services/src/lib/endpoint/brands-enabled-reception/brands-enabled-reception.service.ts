import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';

import { environment } from '../../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";

@Injectable({
  providedIn: 'root'
})

export class BrandsEnabledReceptionService {
  /**routes for services */
  private indexUrl = environment.apiBase+'/reception/brands-enabled-reception/search';
  private entitiesUrl = environment.apiBase+'/reception/brands-enabled-reception/search-filters';
  private updateUrl = environment.apiBase+'/reception/brands-enabled-reception/update';

  constructor(
    private http: HttpClient
  ) {}

  index(body): Observable<any> {
    return this.http.post<HttpRequestModel.Response>(this.indexUrl,body).pipe(map(resp => resp.data))
  }

  entities(): Observable<any>{
    return this.http.get(this.entitiesUrl).pipe(map((data:any)=>{
      return data.data.filters;
    }));
  }

  updateCommercialFields(body): Observable<any>{
    return this.http.post<HttpRequestModel.Response>(this.updateUrl,body).pipe(map(resp => resp.data))
  }
}
