import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {switchMap} from "rxjs/operators";
import {AuthenticationService} from "@suite/services";
import {ReceptionModel} from "../../../../models/endpoints/Reception";
import {HttpRequestModel} from "../../../../models/endpoints/HttpRequest";
import {RequestsProvider} from "../../../../providers/requests/requests.provider";

@Injectable({
  providedIn: 'root'
})
export class ReceptionService {

  /**Urls for the picking service */
  private postReceiveUrl = environment.apiBase + '/processes/receive-store';
  private getCheckPackingUrl = environment.apiBase + '/processes/receive-store/check/';
  private getCheckProductsPackingUrl = environment.apiBase + '/processes/receive-store/check/{{reference}}/products';
  private postReceiveProductUrl = environment.apiBase + '/processes/receive-store/products';
  private getNotReceivedProductsUrl = environment.apiBase + '/processes/receive-store/notreceived/';
  private postUpdateStockUrl = environment.apiBase + '/stock-stores/update';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}

  postReceive(parameters: ReceptionModel.Reception) : Promise<HttpRequestModel.Response> {
    parameters.force = true;
    return this.requestsProvider.post(this.postReceiveUrl, parameters);
  }

  getCheckPacking(packingReference: string) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getCheckPackingUrl + packingReference);
  }

  getCheckProductsPacking(packingReference: string) : Observable<ReceptionModel.ResponseCheckProductsPacking> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });

      let url = this.getCheckProductsPackingUrl.replace('{{reference}}', packingReference);

      return this.http.get<ReceptionModel.ResponseCheckProductsPacking>(url, { headers });
    }));
  }

  postReceiveProduct(parameters: ReceptionModel.ReceptionProduct) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postReceiveProductUrl, parameters);
  }

  getNotReceivedProducts(packingReference: string) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getNotReceivedProductsUrl + packingReference);
  }

  postUpdateStock(productReference: {productReference: string}) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postUpdateStockUrl, productReference);
  }

}
