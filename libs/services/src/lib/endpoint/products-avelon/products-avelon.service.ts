import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { ProductModel } from '../../../models/endpoints/Product';

import { environment } from '../../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import { from, observable } from 'rxjs';
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";

@Injectable({
  providedIn: 'root'
})

export class ProductsAvelonService {
  /**routes for services */
  private getSecondAvelon = environment.apiBase+'/global-variables/GetSecondsToAvelon';
  private notifyAvelon = environment.apiBase+'/reception/notify-avelon-predistribution';
  private getProducts = environment.apiBase+'/products/';
  private UpdateSecondAvelon = environment.apiBase+'/global-variables/SecondsToAvelon';
  private indexRoute = environment.apiBase+'/reception/notify-avelon/search';
  private getEntities = environment.apiBase+'/reception/notify-avelon/search-filters';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}

  index(body): Observable<any>{
    return this.http.post<HttpRequestModel.Response>(this.indexRoute, body).pipe(map((response:any)=>{
      return response.data;
    }));
  }

  GetSecondAvelon(): Observable<any> {
    return this.http.get(this.getSecondAvelon).pipe(map((response:any)=>{
      return response.data;
    }));
  }

  notifyAvelonPredistribution(body): Observable<any>{
    return this.http.post(this.notifyAvelon, body).pipe(map((data:any)=>{
      return data.data;
    }));
  }

  GetProducts(): Observable<any>{
    return this.http.get(this.getProducts).pipe(map((data:any)=>{
      return data.data;
    }));
  }


  updateSecondAvelon(body): Observable<any>{
    return this.http.post(this.UpdateSecondAvelon, body).pipe(map((data:any)=>{
      return data.data;
    }));
  }

  entities(): Observable<any>{
    return this.http.get(this.getEntities).pipe(map((data:any)=>{
      return data.data;
    }));
  }
}
