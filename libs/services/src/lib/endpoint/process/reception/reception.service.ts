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
  private getShowUrl = environment.apiBase + '/process/receive';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  postReceive(parameters: ReceptionModel.Reception) : Observable<ReceptionModel.ResponseReceive> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      parameters.force = true;

      return this.http.post<ReceptionModel.ResponseReceive>(this.getShowUrl, parameters, { headers });
    }));
  }
}
