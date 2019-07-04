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

  private getLineRequestsUrl = environment.apiBase + '/picking/store/lines-request';
  private postLineRequestsPendingUrl = environment.apiBase + '/picking/store/lines-request/pending';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  getLineRequests() : Observable<PickingStoreModel.ResponseLineRequests> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.get<PickingStoreModel.ResponseLineRequests>(this.getLineRequestsUrl, { headers });
    }));
  }

  postLineRequestsPending(parameters: PickingStoreModel.ListStoresIds) : Observable<PickingStoreModel.ResponseLineRequestsPending> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<PickingStoreModel.ResponseLineRequestsPending>(this.postLineRequestsPendingUrl, parameters, { headers });
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
