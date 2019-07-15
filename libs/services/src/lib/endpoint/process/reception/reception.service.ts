import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {switchMap} from "rxjs/operators";
import {AuthenticationService} from "@suite/services";
import {ReceptionModel} from "../../../../models/endpoints/Reception";

@Injectable({
  providedIn: 'root'
})
export class ReceptionService {

  /**Urls for the picking service */
  private postReceiveUrl = environment.apiBase + '/process/receive';
  private getCheckPackingUrl = environment.apiBase + '/process/receive/check/';
  private getCheckProductsPackingUrl = environment.apiBase + '/process/receive/check/{{reference}}/products';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  postReceive(parameters: ReceptionModel.Reception) : Observable<ReceptionModel.ResponseReceive> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      parameters.force = true;

      return this.http.post<ReceptionModel.ResponseReceive>(this.postReceiveUrl, parameters, { headers });
    }));
  }

  getCheckPacking(packingReference: string) : Observable<ReceptionModel.ResponseCheckPacking> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });

      return this.http.get<ReceptionModel.ResponseCheckPacking>(this.getCheckPackingUrl+packingReference, { headers });
    }));
  }

  getCheckProductsPacking(packingReference: string) : Observable<ReceptionModel.ResponseCheckProductsPacking> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });

      let url = this.getCheckProductsPackingUrl.replace('{{reference}}', packingReference);

      return this.http.get<ReceptionModel.ResponseCheckProductsPacking>(url, { headers });
    }));
  }
}
