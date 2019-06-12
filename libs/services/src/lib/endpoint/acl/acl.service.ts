import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { ACLModel } from '../../../models/endpoints/ACL';



@Injectable({
  providedIn: 'root'
})
export class AclService {
  
  /**urls for acl service */
  private getUserRolesUrl:string = environment.apiBase+"/users/{{id}}/roles";
  private getRolPermissionsUrl:string = environment.apiBase+"/roles/{{id}}/permissions";

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getUserRoles(
    userId: number
  ): Promise<Observable<HttpResponse<ACLModel.ResponseUserRoles>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<ACLModel.ResponseUserRoles>(
      this.getUserRolesUrl.replace("{{id}}",String(userId)),
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

  async getRolPermissions(
    rolId: number
  ): Promise<Observable<HttpResponse<ACLModel.ResponseUserRoles>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<ACLModel.ResponseUserRoles>(
      this.getRolPermissionsUrl.replace("{{id}}",String(rolId)),
      {
        headers: headers,
        observe: 'response'
      }
    );
  }
}
