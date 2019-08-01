import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { ProductModel } from '../../../models/endpoints/Product';

import { environment } from '../../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {from} from "rxjs";
@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  /**routes for services */
  private getHistoricalUrl = environment.apiBase+'/products/history/{{id}}';
  private getIndexUrl:string = environment.apiBase+'/products';
  private getInfoUrl: string = environment.apiBase + '/products/info/';
  private postRelabelUrl: string = environment.apiBase + '/products/relabel';

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(): Promise<Observable<HttpResponse<ProductModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<ProductModel.ResponseIndex>(this.getIndexUrl, {
      headers: headers,
      observe: 'response'
    });
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

  getInfo(reference: string): Observable<ProductModel.ResponseInfo> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });

      return this.http.get<ProductModel.ResponseInfo>(this.getInfoUrl + reference, { headers });
    }));
  }

  postRelabel(params: ProductModel.ParamsRelabel): Observable<ProductModel.ResponseRelabel> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });

      return this.http.post<ProductModel.ResponseRelabel>(this.postRelabelUrl, params,  { headers });
    }));
  }
}
