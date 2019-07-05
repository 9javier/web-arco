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

  private getInitiatedUrl = environment.apiBase + '/picking/store/initiated';
  private getLineRequestsUrl = environment.apiBase + '/picking/store/lines-request';
  private postLineRequestsPendingUrl = environment.apiBase + '/picking/store/lines-request/pending';
  private postCheckPackingUrl = environment.apiBase + '/picking/store/packing';

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
      return this.http.get<PickingStoreModel.ResponseLineRequestsPending>(this.postLineRequestsPendingUrl, { headers });
    }));
  }

  postCheckPacking(parameters: PickingStoreModel.CheckPacking) : Observable<PickingStoreModel.ResponseCheckPacking> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<PickingStoreModel.ResponseCheckPacking>(this.postCheckPackingUrl, parameters, { headers });
    }));
  }


  // Send_Process endpoints
  private postPickingStoreProcessUrl = environment.apiBase + '/picking/store/process';
  private postPickingStoreChangeStatusUrl = environment.apiBase + '/picking/store/change-status';

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
