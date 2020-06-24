import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { RequestsProvider } from "../../../providers/requests/requests.provider";
import { HttpRequestModel } from "../../../models/endpoints/HttpRequest";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageHistoryService {

  private postGetFiltersUrl: string = environment.apiBase + "/opl-expedition/order-package-history/filters";
  private postNewTrasnportUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/new";
  private postGetOpPackageHistorytsUrl: string = environment.apiBase + "/opl-expedition/order-package-history";
  private deleteTransportUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/";
  private putUpdateTrasnportUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/";
  private postGetFiltersOpTransportsUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/filters";
  private getHistoryDeatilsPackages: string = environment.apiBase +  "/opl-expedition/order-package-history/all";
  private getHistoryDeatilsPackagesLast: string = environment.apiBase +  "/opl-expedition/order-package/history/last";
  private getHistoryDeatilsPackagesProduct: string = environment.apiBase +  "/opl-expedition/order-package/history/products";
  private getContainerUrl: string = environment.apiBase + '/warehouses/containers/info/';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}


  getOpPackageHistory(body): Observable<any> {
    return this.http.post<HttpRequestModel.Response>(this.postGetOpPackageHistorytsUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  storeNewTransport(body){
    return this.http.post<HttpRequestModel.Response>(this.postNewTrasnportUrl,body).pipe(
      map(resp => resp))
  }

  deleteTransport(id){
    return this.http.delete<HttpRequestModel.Response>(this.deleteTransportUrl+id).pipe(
      map(resp => resp))
  }

  updateTransport(body){
    return this.http.put<HttpRequestModel.Response>(this.putUpdateTrasnportUrl,body).pipe(
      map(resp => resp.data))
  }

  getFilters(){
    return this.http.get<HttpRequestModel.Response>(this.postGetFiltersUrl).pipe(
      map(resp => resp.data)
    )
  }

  getHistorical(id){
    const body = {
      orderId:id
    }
    return this.http.post<HttpRequestModel.Response>(this.getHistoryDeatilsPackages, body).pipe(
      map(resp => resp.data)
    )
  }

  getHistoricalLast(id){
    const body = {
      opPackageId:id
    }
    return this.http.post<HttpRequestModel.Response>(this.getHistoryDeatilsPackagesLast, body).pipe(
      map(resp => resp.data)
    )
  }

  getList(id){
    const body = {
      orderId:id
    }
    return this.http.post<HttpRequestModel.Response>(this.getHistoryDeatilsPackagesProduct, body).pipe(
      map(resp => resp.data)
    )
  }

  getContainer(id: string) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getContainerUrl + id);
  }
}
