import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { ProductModel } from '../../../models/endpoints/Product';
import { PATH, URL } from '../../../../../../config/base';


const PATH_BASE: string = URL + '/api/';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  /**routes for services */
  private getHistoricalUrl = environment.apiBase+'/products/history/{{id}}';
  private getIndexUrl:string = environment.apiBase+'/products';
  
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
}
