import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { ProcessModel } from '../../../models/endpoints/Process';
import { UserProcessesModel } from '../../../models/endpoints/UserProcesses';
import { PATH, URL } from '../../../../../../config/base';
import {ACLModel} from "@suite/services";
const PATH_BASE: string = URL + '/api/';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService {
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(): Promise<Observable<HttpResponse<ProcessModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<ProcessModel.ResponseIndex>(PATH_BASE + 'types/process', {
      headers: headers,
      observe: 'response'
    });
  }


  async getUsersProcesses(): Promise<Observable<HttpResponse<UserProcessesModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<UserProcessesModel.ResponseIndex>(PATH_BASE + 'users/processes/grouped', {
      headers: headers,
      observe: 'response'
    });
  }
}
