import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { RequestsProvider } from "../../../providers/requests/requests.provider";
import { HttpRequestModel } from "../../../models/endpoints/HttpRequest";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OplExpeditionsService {

  private postGetFilterOplExpeditionUrl: string = environment.apiBase + "/opl-expedition/filter";
  private postGetListOplExpeditionUrl: string = environment.apiBase + "/opl-expedition/all";
  private postUnlockOplExpeditionUrl: string = environment.apiBase + "/opl-expedition/unlock";

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}

  getFiltersEntities() {
    const body = {
      expedition: [],
      barcode: [],
      date: [],
      warehouse: [],
      locked: [],
    };

    return this.http.post<HttpRequestModel.Response>(this.postGetFilterOplExpeditionUrl, body).pipe(
      map(resp => resp.data)
    )
  }

  getListOplExpedition(body: any): Observable<any> {
    return this.http.post<HttpRequestModel.Response>(this.postGetListOplExpeditionUrl, body).pipe(
      map(resp => resp.data)
    )
  }

  unlockExpedition(body: any): Observable<any> {
    return this.http.post<HttpRequestModel.Response>(this.postUnlockOplExpeditionUrl, body).pipe(
      map(resp => resp.data)
    )
  }
}
