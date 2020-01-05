import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';
import { PermissionsModel } from '../../../models/endpoints/Permissions';
import { ACLModel } from '../../../models/endpoints/ACL';
import { environment } from '../../../environments/environment';
import { map, mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {


  /**Urls of permissions service */
  private getIndexUrl:string = environment.apiBase+"/permissions";
  private getShowUrl:string = environment.apiBase+"/permissions/{{id}}";
  private postAssignPermissionToRolUrl:string = environment.apiBase+"/gestion-permissions/roles/{{rolId}}/permissions/{{permissionId}}";
  private deletePermissionToRolUrl:string = environment.apiBase+"/gestion-permissions/roles/{{rolId}}/permissions/{{permissionId}}"
  private getPermision:string = environment.apiBase+"/gestion-permissions/users/has-force-permission";
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(): Promise<
    Observable<HttpResponse<PermissionsModel.ResponseIndex>>
  > {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<PermissionsModel.ResponseIndex>(this.getIndexUrl, {
      headers: headers,
      observe: 'response'
    });
  }

  /**
   * the postman query have an one, but this method dont received any param
   * then i add one and set default value
   * @param id id of the permission
   */
  async getShow(id:number = 1): Promise<
    Observable<HttpResponse<PermissionsModel.ResponseShow[]>>
  > {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<PermissionsModel.ResponseShow[]>(this.getShowUrl.replace("{{id}}",String(id)), {
      headers: headers,
      observe: 'response'
    });
  }

  /**@description response promise permision of user */
  async getGestionPermision():Promise<Observable<HttpResponse<PermissionsModel.ResponseGestionPermision>>>{
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<PermissionsModel.ResponseGestionPermision>(
      this.getPermision,{
        headers,
        observe:'response'}
    )
  }

  async postAssignPermissionToRol(
    rolId: number,
    permissionId: number
  ): Promise<Observable<HttpResponse<ACLModel.ResponseRolPermissions>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<ACLModel.ResponseRolPermissions>(
      this.postAssignPermissionToRolUrl.replace("{{rolId}}",String(rolId)).replace("{{permissionId}}",String(permissionId)),
      {},
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

  async deletePermissionToRol(
    rolId: number,
    permissionId: number
  ): Promise<Observable<HttpResponse<ACLModel.ResponseDeleteRolPermissions>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.delete<ACLModel.ResponseDeleteRolPermissions>(
      this.deletePermissionToRolUrl.replace("{{rolId}}",String(rolId)).replace("{{permissionId}}",String(permissionId)),
      {
        headers: headers,
        observe: 'response'
      }
    );
  }
}
