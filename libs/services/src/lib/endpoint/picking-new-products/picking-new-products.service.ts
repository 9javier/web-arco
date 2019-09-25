import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, switchMap} from "rxjs/operators";
import {AuthenticationService} from "@suite/services";
import {PickingNewProductsModel} from "../../../models/endpoints/PickingNewProducts";

@Injectable({
  providedIn: 'root'
})
export class PickingNewProductsService {

  private postGetByWarehouseIdPickingIdUrl = environment.apiBase + '/picking-new-products/warehouse/picking';
  private postSearchUrl = environment.apiBase + '/picking-new-products/search';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  postGetByWarehouseIdPickingId(params?: PickingNewProductsModel.ParamsGetByWarehouseIdPickingId): Observable<PickingNewProductsModel.ResponseGetByWarehouseIdPickingId> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      if (!params) {
        params = {};
      }

      return this.http.post<PickingNewProductsModel.ResponseGetByWarehouseIdPickingId>(this.postGetByWarehouseIdPickingIdUrl, params, { headers });
    }));
  }

  postSearch(params: PickingNewProductsModel.ParamsSearch): Observable<PickingNewProductsModel.Search> {
    return this.http.post<PickingNewProductsModel.ResponseSearch>(this.postSearchUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

}
