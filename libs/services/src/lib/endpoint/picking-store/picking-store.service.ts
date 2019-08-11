import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {switchMap} from "rxjs/operators";
import {AuthenticationService} from "@suite/services";
import {PickingStoreModel} from "../../../models/endpoints/PickingStore";

@Injectable({
  providedIn: 'root'
})
export class PickingStoreService {

  private getInitiatedUrl = environment.apiBase + '/processes/picking-store/initiated';
  private getLineRequestsUrl = environment.apiBase + '/processes/picking-store/lines-request';
  private postLineRequestsPendingUrl = environment.apiBase + '/processes/picking-store/lines-request/pending';
  private postCheckPackingUrl = environment.apiBase + '/processes/picking-store/packing';
  private postLineRequestsFilteredUrl = environment.apiBase + '/processes/picking-store/lines-request/filtered';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  getInitiated() : Observable<PickingStoreModel.ResponseInitiated> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.get<PickingStoreModel.ResponseInitiated>(this.getInitiatedUrl, { headers });
    }));
  }

  getLineRequests() : Observable<PickingStoreModel.ResponseLineRequests> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.get<PickingStoreModel.ResponseLineRequests>(this.getLineRequestsUrl, { headers });
    }));
  }

  getLineRequestsPending() : Observable<PickingStoreModel.ResponseLineRequestsPending> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<PickingStoreModel.ResponseLineRequestsPending>(this.postLineRequestsPendingUrl, { headers });
    }));
  }

  postPackings(parameters: PickingStoreModel.PostPacking) : Observable<PickingStoreModel.ResponsePostPacking> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<PickingStoreModel.ResponsePostPacking>(this.postCheckPackingUrl, parameters, { headers });
    }));
  }

  postLineRequestFiltered(parameters: PickingStoreModel.ParamsFiltered) : Observable<PickingStoreModel.ResponseLineRequestsFiltered> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<PickingStoreModel.ResponseLineRequestsFiltered>(this.postLineRequestsFilteredUrl, parameters, { headers });
    }));
  }


  // Send_Process endpoints
  private postPickingStoreProcessUrl = environment.apiBase + '/processes/picking-store/process';
  private postPickingStoreChangeStatusUrl = environment.apiBase + '/processes/picking-store/change-status';

  postPickingStoreProcess(parameters: PickingStoreModel.SendProcess) : Observable<PickingStoreModel.ResponseSendProcess> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<PickingStoreModel.ResponseSendProcess>(this.postPickingStoreProcessUrl, parameters, { headers });
    }));
  }

  postPickingStoreChangeStatus(parameters: PickingStoreModel.ChangeStatus) : Observable<PickingStoreModel.ResponseChangeStatus> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<PickingStoreModel.ResponseChangeStatus>(this.postPickingStoreChangeStatusUrl, parameters, { headers });
    }));
  }

}
