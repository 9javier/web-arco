import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { GroupModel } from '../../../models/endpoints/Group';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  /**Urls for groups service */
  private getIndexUrl:string = environment.apiBase+"/warehouses/categories";

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(): Promise<Observable<HttpResponse<GroupModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<GroupModel.ResponseIndex>(this.getIndexUrl, {
      headers: headers,
      observe: 'response'
    });
  }
}
