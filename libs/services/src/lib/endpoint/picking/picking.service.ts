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
  private getShowUrl = environment.apiBase+"/picking/{{id}}";
  private putUpdateUrl = environment.apiBase+"/picking/{{id}}";

  constructor(
    private http: HttpClient
  ) {}

  getShow(pickingId: number) : Observable<PickingModel.ResponseShow> {
    return this.http.get<PickingModel.ResponseShow>(this.getShowUrl.replace('{{id}}', pickingId.toString()));
  }

  putUpdate(pickingId: number, picking: Array<PickingModel.Picking>) : Observable<PickingModel.ResponseUpdate> {
    return this.http.put<PickingModel.ResponseUpdate>(this.putUpdateUrl.replace('{{id}}', pickingId.toString()), picking);
  }

}
