import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import {from} from "rxjs";
import {switchMap} from "rxjs/operators";
import {CarrierModel} from "../../../models/endpoints/Carrier";

@Injectable({
  providedIn: 'root'
})
export class CarriersService {

  // Relabel
  private postListByWarehouseUrl: string = environment.apiBase + "/carriers/warehouses/show";

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
}
