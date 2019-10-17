import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {switchMap} from "rxjs/operators";
import {AuthenticationService} from "@suite/services";
import {ShoesPickingModel} from "../../../models/endpoints/ShoesPicking";

@Injectable({
  providedIn: 'root'
})
export class ShoesPickingService {

  private getListByPickingUrl = environment.apiBase+"/processes/picking-main/shoes/{{id}}";
  private getPendingListByPickingUrl = environment.apiBase+"/processes/picking-main/shoes/{{id}}/pending";

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  getListByPicking(pickingId: number) : Observable<ShoesPickingModel.ResponseListByPicking> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.get<ShoesPickingModel.ResponseListByPicking>(this.getListByPickingUrl.replace('{{id}}', pickingId.toString()), { headers });
    }));
  }

  getPendingListByPicking(pickingId: number) : Observable<ShoesPickingModel.ResponseListByPicking> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.get<ShoesPickingModel.ResponseListByPicking>(this.getPendingListByPickingUrl.replace('{{id}}', pickingId.toString()), { headers });
    }));
  }

}
