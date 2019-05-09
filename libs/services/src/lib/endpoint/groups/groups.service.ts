import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { GroupModel } from '../../../models/endpoints/Group';
import { PATH, URL } from '../../../../../../config/base';


const PATH_BASE: string = URL + '/api/';
@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(): Promise<Observable<HttpResponse<GroupModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<GroupModel.ResponseIndex>(PATH_BASE + 'warehouses/categories', {
      headers: headers,
      observe: 'response'
    });
  }


}
