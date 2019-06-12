import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { UserModel } from '../../../models/endpoints/User';
import { PATH } from '../../../../../../config/base';
import { environment } from '../../../environments/environment';
import { forkJoin, concat } from 'rxjs';

export const PATH_GET_INDEX: string = PATH('Users', 'Index');
export const PATH_POST_STORE: string = PATH('Users', 'Store');
export const PATH_GET_SHOW: string = PATH('Users', 'Show').slice(0, -1);
export const PATH_PUT_UPDATE: string = PATH('Users', 'Update').slice(0, -1);
export const PATH_DEL_DESTROY: string = PATH('Users', 'Destroy').slice(0, -1);

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  /**Urls for users service */
  private getIndexUrl:string = environment.apiBase+"/users";
  private postStoreUrl:string = environment.apiBase+"/users";
  private getShowUrl:string = environment.apiBase+"/users/{{id}}";
  private putUpdateUrl:string = environment.apiBase+"/users/{{id}}";
  private delDestroyUrl:string = environment.apiBase+"/users/{{id}}";

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(): Promise<Observable<HttpResponse<UserModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<UserModel.ResponseIndex>(
      this.getIndexUrl, {
      headers: headers,
      observe: 'response'
    });
  }

  async postStore(
    user: UserModel.User
  ): Promise<Observable<HttpResponse<UserModel.ResponseStore>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<UserModel.ResponseStore>(this.postStoreUrl, user, {
      headers: headers,
      observe: 'response'
    });
  }

  async getShow(
    userId: string | number
  ): Promise<Observable<HttpResponse<UserModel.ResponseShow>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<UserModel.ResponseShow>(this.getShowUrl.replace("{{id}}",String(userId)), {
      headers: headers,
      observe: 'response'
    });
  }

  async putUpdate(
    user: UserModel.User
  ): Promise<Observable<HttpResponse<UserModel.ResponseUpdate>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.put<UserModel.ResponseUpdate>(
      this.putUpdateUrl.replace("{{id}}",String(user.id)),
      user,
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

  async deleteDestroy(
    users: UserModel.User[]
  ): Promise<Observable<HttpResponse<UserModel.ResponseDestroy>>[]> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return users.map(user => {
      return concat(
        this.http.delete<UserModel.ResponseDestroy>(
          this.delDestroyUrl.replace("{{id}}",String(user.id)),
          {
            headers: headers,
            observe: 'response'
          }
        )
      );
    });
  }
}
