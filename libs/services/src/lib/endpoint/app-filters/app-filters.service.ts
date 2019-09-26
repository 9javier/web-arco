import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {map} from "rxjs/operators";
import {AppFiltersModel} from "../../../models/endpoints/AppFilters";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppFiltersService {

  private postProductsReceivedUrl: string = environment.apiBase + '/app-filters/products/received';

  constructor(
    private http: HttpClient
  ) {}

  postProductsReceived(params: AppFiltersModel.ParamsProductsReceived) : Observable<AppFiltersModel.ProductsReceived> {
    return this.http.post<AppFiltersModel.ResponseProductsReceived>(this.postProductsReceivedUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

}
