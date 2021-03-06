import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { RolModel } from '../../../models/endpoints/Rol';
import { concat } from 'rxjs';
import { ACLModel } from '@suite/services';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  /**Urls for the roles service */
  private getIndexUrl:string = environment.apiBase+"/gestion-permissions/roles";
  private postStoreUrl:string = environment.apiBase+"/gestion-permissions/roles";
  private getShowUrl:string = environment.apiBase+"/gestion-permissions/roles/{{id}}";
  private putUpdateUrl:string = environment.apiBase+"/gestion-permissions/roles/{{id}}";
  private destroyUrl:string = environment.apiBase+"/gestion-permissions/roles/{{id}}";
  private postAssignRolToUserUrl:string =environment.apiBase+"/gestion-permissions/users/{{userId}}/roles/{{rolId}";
  private deleteRolToUserUrl:string = environment.apiBase+"/gestion-permissions/users/{{userId}}/roles/{{rolId}";

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(): Promise<Observable<HttpResponse<RolModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<RolModel.ResponseIndex>(this.getIndexUrl, {
      headers: headers,
      observe: 'response'
    });
  }

  async postStore(
    rol: RolModel.Rol
  ): Promise<Observable<HttpResponse<RolModel.ResponseStore>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<RolModel.ResponseStore>(this.postStoreUrl, rol, {
      headers: headers,
      observe: 'response'
    });
  }

  async getShow(
    userId: string | number
  ): Promise<Observable<HttpResponse<RolModel.ResponseShow>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<RolModel.ResponseShow>(this.getShowUrl.replace("{{id}}",String(userId)), {
      headers: headers,
      observe: 'response'
    });
  }

  async putUpdate(
    rol: RolModel.Rol
  ): Promise<Observable<HttpResponse<RolModel.ResponseUpdate>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.put<RolModel.ResponseUpdate>(
      this.putUpdateUrl.replace("{{id}}",String(rol.id)),
      rol,
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

  /**
   * Delete rol given by the id
   * @param id - the id of rol to be deleted
   * @returns response of deletion state
   */
  destroy(id:number):Observable<any>{
    return this.http.delete(this.destroyUrl.replace("{{id}}",id.toString()));
  }

  async deleteDestroy(
    users: RolModel.Rol[]
  ): Promise<Observable<HttpResponse<RolModel.ResponseDestroy>>[]> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return users.map(rol => {
      return concat(
        this.http.delete<RolModel.ResponseDestroy>(
          this.destroyUrl.replace("{{id}}",String(rol.id)),
          {
            headers: headers,
            observe: 'response'
          }
        )
      );
    });
  }

  async postAssignRolToUser(
    userId: number,
    rolId: number
  ): Promise<Observable<HttpResponse<ACLModel.ResponseUserRoles>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<ACLModel.ResponseUserRoles>(
      this.postAssignRolToUserUrl.replace("{{userId}}",String(userId)).replace("{{rolId}}",String(rolId)),
      {},
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

  async deleteRolToUser(
    userId: number,
    rolId: number
  ): Promise<Observable<HttpResponse<ACLModel.ResponseDeleteUserRol>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.delete<ACLModel.ResponseDeleteUserRol>(
      this.deleteRolToUserUrl.replace("{{userId}}",String(userId)).replace("{{rolId}}",String(rolId)),
      {
        headers: headers,
        observe: 'response'
      }
    );
  }
}
