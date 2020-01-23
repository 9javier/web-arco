import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { ProductModel } from '../../../models/endpoints/Product';

import { environment } from '../../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {from} from "rxjs";
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  /**routes for services */
  private getHistoricalUrl = environment.apiBase+'/products/history/{{id}}';
  private getIndexUrl:string = environment.apiBase+'/products';
  private getInfoUrl: string = environment.apiBase + '/products/info/';
  private postRelabelUrl: string = environment.apiBase + '/products/relabel';
  private getExtendedInfoUrl: string = environment.apiBase + '/products/info/extended/';
  private relabelPrint: string = environment.apiBase + '/products/relabel/print';
  private getAllFiltersUrl: string = environment.apiBase + '/filter/prices/tariff/entities';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}

  async getIndex() : Promise<Observable<HttpResponse<ProductModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<ProductModel.ResponseIndex>(this.getIndexUrl, {
      headers: headers,
      observe: 'response'
    });
  }
  relablePrint(body: ProductModel.ParamsRelabelPrint): Observable<HttpRequestModel.Response>{
    return this.http.post<HttpRequestModel.Response>(this.relabelPrint, body).pipe(
      map(resp => resp.data)
    );
  }
  /**
   * Get the historical of a product
   * @param id the id of the product
   */
  getHistorical(id:number):Observable<any>{
    return this.http.get(this.getHistoricalUrl.replace("{{id}}",id.toString())).pipe(map((response:any)=>{
      return response.data;
    }));
  }

  getInfo(reference: string) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getInfoUrl + reference);
  }

  postRelabel(params: ProductModel.ParamsRelabel) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postRelabelUrl, params);
  }

  getExtendedInfo(reference: string) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getExtendedInfoUrl + reference);
  }

  /**
   * Get the models list
   */
  getAllFilters(form: any):Observable<any>{
    return this.http.post(this.getAllFiltersUrl, form).pipe(map((response:any)=>{
      return response.data;
    }));
  }
}
