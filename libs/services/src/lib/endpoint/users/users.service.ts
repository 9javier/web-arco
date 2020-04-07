import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserModel } from '../../../models/endpoints/User';
import { environment } from '../../../environments/environment';
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  /**Urls for users service */
  private getIndexUrl:string = environment.apiBase+"/gestion-permissions/users";
  private postStoreUrl:string = environment.apiBase+"/gestion-permissions/users";
  private getShowUrl:string = environment.apiBase+"/gestion-permissions/users/{{id}}";
  private putUpdateUrl:string = environment.apiBase+"/gestion-permissions/users/{{id}}";
  private hasDeleteProductPermissionUrl:string = environment.apiBase+"/gestion-permissions/users/has-delete-product-permission";
  private postListUrl:string = environment.apiBase+"/gestion-permissions/users/list";
  private postFiltersUrl:string = environment.apiBase+"/gestion-permissions/permissions/filters";
  private postUpdateUrl:string = environment.apiBase+"/gestion-permissions/permissions/update";
  private postNewUrl:string = environment.apiBase+"/gestion-permissions/permissions/create";

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider) {}

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

  async hasDeleteProductPermission(): Promise<Observable<HttpResponse<UserModel.ResponseHasDeleteProductPermission>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<UserModel.ResponseHasDeleteProductPermission>(
      this.hasDeleteProductPermissionUrl, {
        headers: headers,
        observe: 'response'
      });
  }

  getList(parameters?: UserModel.Filters): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postListUrl, parameters);
  }

  getFilters(parameters?: UserModel.FilterOptionsRequest): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postFiltersUrl, parameters);
  }

  postUpdate(parameters?: UserModel.Permission[]): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postUpdateUrl, parameters);
  }

  postNew(parameters?: UserModel.ModalResponse): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postNewUrl, parameters);
  }

}
