import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { ProcessModel } from '../../../models/endpoints/Process';
import { UserProcessesModel } from '../../../models/endpoints/UserProcesses';
import { PATH, URL } from '../../../../../../config/base';
import {ACLModel} from "@suite/services";
const PATH_BASE: string = URL + '/api/';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService {

  /**Urls for processes services */
  private getIndexUrl:string = environment.apiBase+"/types/process";
  private getUsersProcessesUrl:string = environment.apiBase+"users/processes/grouped";

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(): Promise<Observable<HttpResponse<ProcessModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<ProcessModel.ResponseIndex>(this.getIndexUrl, {
      headers: headers,
      observe: 'response'
    });
  }


  async getUsersProcesses(): Promise<Observable<HttpResponse<UserProcessesModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<UserProcessesModel.ResponseIndex>(this.getUsersProcessesUrl, {
      headers: headers,
      observe: 'response'
    });
  }
}
