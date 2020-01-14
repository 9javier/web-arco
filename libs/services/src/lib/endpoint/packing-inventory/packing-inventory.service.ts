import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthenticationService} from "@suite/services";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {PackingInventoryModel} from "../../../models/endpoints/PackingInventory";

@Injectable({
  providedIn: 'root'
})
export class PackingInventoryService {

  private getCarrierOfProductUrl = environment.apiBase+"/packing/inventories/{{reference}}/carrier";
  private postAddUrl = environment.apiBase+"/packing/inventories/add";

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}

  getCarrierOfProduct(reference: string) : Promise<HttpRequestModel.Response> {
    let url = this.getCarrierOfProductUrl.replace('{{reference}}', reference);
    return this.requestsProvider.get(url);
  }

  postAdd(parameters: PackingInventoryModel.PackingInventory): Promise<HttpRequestModel.Response>{
    return this.requestsProvider.post(this.postAddUrl, parameters);
  }

}
