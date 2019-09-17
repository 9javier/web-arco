import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import {from} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {CarrierModel} from "../../../models/endpoints/Carrier";

@Injectable({
  providedIn: 'root'
})
export class CarriersService {

  private postGenerateUrl: string = environment.apiBase + "/packing/generate";
  private postSealUrl: string = environment.apiBase + "/packing/seal";
  private postTransferAmongPackingsUrl: string = environment.apiBase + "/packing/transfer";
  private getUpdatePackingStatusInPickingUrl: string = environment.apiBase + "/packing/update/";

  // Relabel
  private postListByWarehouseUrl: string = environment.apiBase + "/packing/destiny/show";

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  postListByWarehouse(parameters: CarrierModel.ParamsListByWarehouse) : Observable<CarrierModel.ResponseListByWarehouse> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });

      return this.http.post<CarrierModel.ResponseListByWarehouse>(this.postListByWarehouseUrl, parameters, { headers });
    }));
  }

  postGenerate(parameters: CarrierModel.ParamsGenerate) : Observable<CarrierModel.ResponseGenerate> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });

      return this.http.post<CarrierModel.ResponseGenerate>(this.postGenerateUrl, parameters, { headers });
    }));
  }

  postSeal(parameters: CarrierModel.ParamsSeal) : Observable<CarrierModel.ResponseSeal> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });

      return this.http.post<CarrierModel.ResponseSeal>(this.postSealUrl, parameters, { headers });
    }));
  }

  postTransferAmongPackings(params: CarrierModel.ParamsTransferAmongPackings): Observable<CarrierModel.ResponseTransferAmongPackings> {
    return this.http.post<CarrierModel.ResponseTransferAmongPackings>(this.postTransferAmongPackingsUrl, params).pipe(map(response => {
      return response;
    }));
  }

  getUpdatePackingStatusInPicking(pickingId: number) : Observable<any> {
    return this.http.get<CarrierModel.ResponseUpdateStatusInPicking>(`${this.getUpdatePackingStatusInPickingUrl}${pickingId}`).pipe(map(response => {
      return response.data;
    }));
  }

}
