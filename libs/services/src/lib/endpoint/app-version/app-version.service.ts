import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService, environment } from '@suite/services';
import { AppVersionModel } from '../../../models/endpoints/appVersion.model';

@Injectable({
  providedIn: 'root'
})
export class AppVersionService {
  private appVersionUrl:string = environment.apiBase+"/app-version";
  constructor(
    private http:HttpClient,
    private auth: AuthenticationService
  ) { }

  async getVersion(): Promise<Observable<HttpResponse<AppVersionModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.get<AppVersionModel.ResponseIndex>(this.appVersionUrl, {
      headers,
      observe: 'response'
    });
  }
}
