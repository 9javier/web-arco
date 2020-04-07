import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';
import { RequestsProvider } from "../../../providers/requests/requests.provider";

@Injectable({
  providedIn: 'root'
})
export class WarehouseReceptionAlertService {

  private getAllUrl = environment.apiBase + "/warehouse-reception-alert";
  private saveUrl = environment.apiBase + "/warehouse-reception-alert/save";
  private checkUrl = environment.apiBase + "/warehouse-reception-alert/check";

  constructor(
    private requestsProvider: RequestsProvider
  ) {}

  getAll(): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getAllUrl);
  }

  saveAll(body: {reference: string, name: string, allowed: boolean}[]): Promise<HttpRequestModel.Response>{
    return this.requestsProvider.post(this.saveUrl, body);
  }

  check(body: {warehouseId: number}): Promise<HttpRequestModel.Response>{
    return this.requestsProvider.post(this.checkUrl, body);
  }

}
