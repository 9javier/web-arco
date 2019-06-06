import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PickingModel} from "../../../models/endpoints/Picking";
import {switchMap} from "rxjs/operators";
import {AuthenticationService} from "@suite/services";

@Injectable({
  providedIn: 'root'
})
export class PickingService {

  private getShowUrl = environment.apiBase+"/workwaves/order/{{id}}";
  private getListByUserUrl = environment.apiBase+"/workwaves/order/{{id}}/user";
  private putUpdateUrl = environment.apiBase+"/workwaves/order";
  private postVerifyPackingUrl = environment.apiBase+"/workwaves/order/packing";

  private _pickingAssignments: PickingModel.Picking[] = [];

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  getShow(workwaveId: number) : Observable<PickingModel.ResponseShow> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.get<PickingModel.ResponseShow>(this.getShowUrl.replace('{{id}}', workwaveId.toString()), { headers });
    }));
  }

  getListByUser(userId: number) : Observable<PickingModel.ResponseShow> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.get<PickingModel.ResponseShow>(this.getListByUserUrl.replace('{{id}}', userId.toString()), { headers });
    }));
  }

  putUpdate(workwaveId: number, pickings: Array<PickingModel.Picking>) : Observable<PickingModel.ResponseUpdate> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });

      let pickingsUpdate: PickingModel.PickingUpdate[] = pickings.map((picking: PickingModel.Picking) => {
        return {
          userId: picking.user.id,
          pikingId: picking.id
        }
      });

      let paramsPickingUpdate = {
        workwaveId: workwaveId,
        pikings: pickingsUpdate
      };

      return this.http.put<PickingModel.ResponseUpdate>(this.putUpdateUrl, paramsPickingUpdate, { headers });
    }));
  }

  postVerifyPacking(packing) : Observable<PickingModel.ResponseUpdate> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<PickingModel.ResponseUpdate>(this.postVerifyPackingUrl, packing, { headers });
    }));
  }

  get pickingAssignments(): PickingModel.Picking[] {
    return this._pickingAssignments;
  }

  set pickingAssignments(value: PickingModel.Picking[]) {
    this._pickingAssignments = value;
  }
}
