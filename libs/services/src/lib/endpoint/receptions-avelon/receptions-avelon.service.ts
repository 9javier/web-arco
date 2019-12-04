import { map } from 'rxjs/operators';
import { ReceptionAvelonModel } from '@suite/services';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';

@Injectable({
  providedIn: 'root'
})
export class ReceptionsAvelonService {
  url: string;
  providersUrl: string;
  checkUrl: string
  constructor(
    private http: HttpClient
  ) {
    this.url = `${environment.apiSorter}/reception/all`
    this.providersUrl = `${environment.apiSorter}/avelonProviders/all`
    this.checkUrl = `${environment.apiSorter}/avelonProviders`

  }

  getReceptions() {
    return this.http.get<HttpRequestModel.Response>(this.url).pipe(map(resp => resp.data));
  }

  getAllProviders() {
    return this.http.get<HttpRequestModel.Response>(this.providersUrl).pipe(map(resp => resp.data));
  }

  isProviderAviable(body) {
    return this.http.post<HttpRequestModel.Response>(this.checkUrl, body).pipe(map(resp => resp.data));
  }
}
