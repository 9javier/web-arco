import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpRequestModel} from '../../../models/endpoints/HttpRequest';
import {RequestsProvider} from "../../../providers/requests/requests.provider";

@Injectable({
  providedIn: 'root'
})
export class ShopsTransfersService {

  private getInfoByPackingUrl: string = environment.apiBase + '/shop/transfers/';

  constructor(private requestsProvider: RequestsProvider) { }

  getInfoByPacking(packingReference: string): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getInfoByPackingUrl + packingReference);
  }
}
