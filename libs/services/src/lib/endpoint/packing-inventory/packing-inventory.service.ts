import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {switchMap} from "rxjs/operators";
import {AuthenticationService} from "@suite/services";
import {PackingInventoryModel} from "../../../models/endpoints/PackingInventory";

@Injectable({
  providedIn: 'root'
})
export class PackingInventoryService {

  private getCarrierOfProductUrl = environment.apiBase+"/packing/inventories/{{reference}}/carrier";

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  getCarrierOfProduct(reference: string) : Observable<PackingInventoryModel.ResponseGetCarrierOfProduct> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });

      let url = this.getCarrierOfProductUrl.replace('{{reference}}', reference);

      return this.http.get<PackingInventoryModel.ResponseGetCarrierOfProduct>(url, { headers });
    }));
  }

}
