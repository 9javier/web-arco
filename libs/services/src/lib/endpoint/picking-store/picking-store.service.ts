import {Injectable} from '@angular/core';
import {from, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {switchMap} from "rxjs/operators";
import {AuthenticationService} from "@suite/services";
import {PickingStoreModel} from "../../../models/endpoints/PickingStore";
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";
import {DeliveryRequestModel} from "../../../models/endpoints/DeliveryRequest";
import ExpiredReservesResponse = DeliveryRequestModel.ExpiredReservesResponse;

@Injectable({
  providedIn: 'root'
})
export class PickingStoreService {

  private getByProductReferenceUrl = environment.apiBase + '/processes/picking-store/get-by-product-reference';
  private getInitiatedUrl = environment.apiBase + '/processes/picking-store/initiated';
  private getLineRequestsUrl = environment.apiBase + '/processes/picking-store/lines-request';
  private getLineRequestsStoreOnlineUrl = environment.apiBase + '/processes/picking-store/lines-request-store-online';
  private getLineRequestsStoreOnlineAmountUrl = environment.apiBase + '/processes/picking-store/lines-request-store-online-amount';
  private postLineRequestsPendingUrl = environment.apiBase + '/processes/picking-store/lines-request/pending';
  private postCheckPackingUrl = environment.apiBase + '/processes/picking-store/packing';
  private postLineRequestsFilteredUrl = environment.apiBase + '/processes/picking-store/lines-request/filtered';
  private getLoadRejectionReasonsUrl = environment.apiBase + '/processes/picking-store/lines-request-reasons-reject';
  private postRejectRequestUrl = environment.apiBase + '/processes/picking-store/line-request-reject';
  private postCancelRequestUrl = environment.apiBase + '/delivery-request/cancel';
  private getExpiredReservesUrl = environment.apiBase + '/delivery-request/expired-reserves';
  private postLineRequestDisassociateUrl = environment.apiBase + '/processes/picking-store/line-request-disassociate';
  private postVentilateUrl = environment.apiBase + '/processes/picking-store/ventilate';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}

  getExpiredReserves(): Promise<ExpiredReservesResponse>{
    return this.requestsProvider.get(this.getExpiredReservesUrl);
  }

  getByProductReference(parameters: PickingStoreModel.ProductReference) : Promise<HttpRequestModel.Response>{
    return this.requestsProvider.post(this.getByProductReferenceUrl, parameters);
  }

  getInitiated() : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getInitiatedUrl);
  }

  getLineRequests() : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getLineRequestsUrl);
  }

  getLineRequestsStoreOnline() : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getLineRequestsStoreOnlineUrl);
  }

  getLineRequestsStoreOnlineAmount() : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getLineRequestsStoreOnlineAmountUrl);
  }

  getLineRequestsPending() : Observable<PickingStoreModel.ResponseLineRequestsPending> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<PickingStoreModel.ResponseLineRequestsPending>(this.postLineRequestsPendingUrl, { headers });
    }));
  }

  postPackings(parameters: PickingStoreModel.PostPacking) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postCheckPackingUrl, parameters);
  }

  postLineRequestFiltered(parameters: PickingStoreModel.ParamsFiltered) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postLineRequestsFilteredUrl, parameters);
  }

  getLoadRejectionReasons() : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getLoadRejectionReasonsUrl);
  }

  postRejectRequest(params: PickingStoreModel.ParamsRejectRequest) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postRejectRequestUrl, params);
  }

  postCancelRequest(parameters: {reference: number}) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postCancelRequestUrl, parameters);
  }

  postLineRequestDisassociate(params: PickingStoreModel.ParamsLineRequestDisassociate) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postLineRequestDisassociateUrl, params);
  }

  postVentilate(params: PickingStoreModel.ParamsVentilate) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postVentilateUrl, params);
  }

  // Send_Process endpoints
  private postPickingStoreProcessUrl = environment.apiBase + '/processes/picking-store/process';
  private postPickingStoreChangeStatusUrl = environment.apiBase + '/processes/picking-store/change-status';

  postPickingStoreProcess(parameters: PickingStoreModel.SendProcess) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postPickingStoreProcessUrl, parameters);
  }

  postPickingStoreChangeStatus(parameters: PickingStoreModel.ChangeStatus) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postPickingStoreChangeStatusUrl, parameters);
  }

}
