import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PickingModel} from "../../../models/endpoints/Picking";

@Injectable({
  providedIn: 'root'
})
export class PickingService {

  // TODO fake endpoints that not exists yet
  private getShowUrl = environment.apiBase+"/workwaves/order/{{id}}";
  private putUpdateUrl = environment.apiBase+"/workwaves/order";

  constructor(
    private http: HttpClient
  ) {}

  getShow(workwaveId: number) : Observable<PickingModel.ResponseShow> {
    return this.http.get<PickingModel.ResponseShow>(this.getShowUrl.replace('{{id}}', workwaveId.toString()));
  }

  putUpdate(workwaveId: number, pickings: Array<PickingModel.Picking>) : Observable<PickingModel.ResponseUpdate> {
    pickings = pickings.map((picking: PickingModel.Picking) => {
      return {
        userId: picking.operator.id,
        pikingId: picking.id
      }
    });

    let paramsPickingUpdate = {
      workwaveId: workwaveId,
      pikings: pickings
    };

    return this.http.put<PickingModel.ResponseUpdate>(this.putUpdateUrl, paramsPickingUpdate);
  }

}
