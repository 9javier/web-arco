import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { ProductModel } from '../../../models/endpoints/Product';
import { PATH, URL } from '../../../../../../config/base';


const PATH_BASE: string = URL + '/api/';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(): Promise<Observable<HttpResponse<ProductModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<ProductModel.ResponseIndex>(PATH_BASE + 'products', {
      headers: headers,
      observe: 'response'
    });
  }
}
