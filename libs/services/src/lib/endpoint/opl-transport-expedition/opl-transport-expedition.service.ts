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
export class OplTransportExpeditionService {

  private postGetFilterOplExpeditionUrl: string = environment.apiBase + "/opl-expedition/filter";
  private postNewTrasnportUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/new";
  private postGetOpTransportsUrl: string = environment.apiBase + "/opl-expedition/expedition/transport";
  private deleteTransportUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/";
  private putUpdateTrasnportUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/";
  private postGetFiltersOpTransportsUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/filters";

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}


  getOpTransports(body): Observable<any> {
    return this.http.post<HttpRequestModel.Response>(this.postGetOpTransportsUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  getFiltersOpTransport(): Observable<any> {
    return this.http.get<HttpRequestModel.Response>(this.postGetFiltersOpTransportsUrl).pipe(
      map(resp => resp.data)
    )
  }

  storeNewTransport(body){
    return this.http.post<HttpRequestModel.Response>(this.postNewTrasnportUrl,body).pipe(
      map(resp => resp))
  }

  deleteTransport(id){
    return this.http.delete<HttpRequestModel.Response>(this.deleteTransportUrl+id).pipe(
      map(resp => resp))
  }

  updateTransport(body){
    return this.http.put<HttpRequestModel.Response>(this.putUpdateTrasnportUrl,body).pipe(
      map(resp => resp.data))
  }

}
