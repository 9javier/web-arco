import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService, environment } from '@suite/services';
import { AppVersionModel } from '../../../models/endpoints/appVersion.model';
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";

@Injectable({
  providedIn: 'root'
})
export class AppVersionService {
  private appVersionUrl:string = environment.apiBase+"/app-version";
  constructor(
    private http:RequestsProvider,
    private auth: AuthenticationService
  ) { }

  getVersion(): Promise<HttpRequestModel.Response> {
    return this.http.get(this.appVersionUrl);
  }
}
