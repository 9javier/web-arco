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
  private getCheckReceivedInfoUrl = environment.apiBase + '/picking-new-products/${id}/products/received/check';
  private postListReceivedProductsRequestedUrl = environment.apiBase + '/picking-new-products/${id}/products/received/requested/list';
  private putAttendReceivedProductsRequestedUrl = environment.apiBase + '/picking-new-products/products/received/requested/attend';

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

  getCheckReceivedInfo(storeId: number): Observable<PickingNewProductsModel.CheckReceivedInfo> {
    return this.http.get<PickingNewProductsModel.ResponseCheckReceivedInfo>(this.getCheckReceivedInfoUrl.replace('${id}', storeId.toString())).pipe(map(response => {
      return response.data;
    }));
  }

  postListReceivedProductsRequested(storeId: number, params): Observable<PickingNewProductsModel.ReceivedProductsRequested[]> {
    return this.http.post<PickingNewProductsModel.ResponseListReceivedProductsRequested>(this.postListReceivedProductsRequestedUrl.replace('${id}', storeId.toString()), params).pipe(map(response => {
      return response.data;
    }));
  }

  putAttendReceivedProductsRequested(params: {receivedProductsRequestedIds: number[]}): Observable<PickingNewProductsModel.ReceivedProductsRequested[]> {
    return this.http.put<PickingNewProductsModel.ResponseListReceivedProductsRequested>(this.putAttendReceivedProductsRequestedUrl, params).pipe(map(response => {
      return response.data;
    }));
  }
}
