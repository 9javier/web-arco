import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';

import { Storage } from '@ionic/storage'; 

import {
  RequestLogin,
  ResponseLogin,
  ResponseLogout,
  ErrorResponseLogout
} from '../../../models/endpoints/OAuth2';

import {
  HeaderEntity,
  BearerEntityOrBasicEntityOrUrlencodedEntityOrOauth2Entity,
  Auth1
} from '../../../../../../config/postman/Api.Team.postman_collection';

import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import {
  PATH,
  HEADERS,
  AUTH,
  ACCESS_TOKEN,
  AppInfo
} from '../../../../../../config/base';
import { environment,app } from '../../../environments/environment';import { from } from 'rxjs';
;

export const HEADERS_LOGIN: any[] = HEADERS('OAuth2', 'Login');
export const AUTH_LOGIN: Auth1 = AUTH('OAuth2', 'Login');
export const PATH_POST_LOGIN: string = PATH('OAuth2', 'Login');

export const AUTH_LOGOUT: Auth1 = AUTH('OAuth2', 'Logout');
export const PATH_GET_LOGOUT: string = PATH('OAuth2', 'Logout');
export const ACCESS_TOKEN_LOGOUT = ACCESS_TOKEN;

@Injectable({
  providedIn: 'root'
})
export class Oauth2Service {
  
  /**Urls for the oauth2 service */
  private refreshTokenUrl:string = environment.apiBase+"/oauth2/access_token";
  private accessTokenUrl:string = environment.apiBase+"/oauth2/access_token";
  private logoutUrl:string = environment.apiBase+"/oauth2/logout";

 
  
  constructor(private http: HttpClient, private storage:Storage) {}

  /**
   * @returns authorization headers for authenticate the aplication
   */
  getAuthorizationHeaders(application:"sga"|"al" = "sga"):HttpHeaders{
    return (new HttpHeaders({
      'Content-Type':	'application/x-www-form-urlencoded',
      'Authorization': 'Basic '+btoa(environment[app.name].client_id+":"+environment[app.name].client_secret) 
    }));
  }


  /**
   * Refresh the current access token with the refresh token
   * @param token - the refresh token
   */
  refreshToken(refreshToken:string):Observable<any>{
    const headers:HttpHeaders = this.getAuthorizationHeaders()
    /**properly format the params of the request */
    const body = new HttpParams()
    .set('refresh_token', refreshToken)
    .set('grant_type', 'refresh_token');

    return this.http.post(this.refreshTokenUrl,body,{headers});
  }

  /**
   * Authenticate with user and password
   * @param user  - Object with user and password
   * @param appName - The application name
   */
  post_login(user: RequestLogin, appName: AppInfo.Name): Observable<HttpResponse<ResponseLogin>> {
    const headers:HttpHeaders = this.getAuthorizationHeaders();
    const body = new HttpParams()
      .set('username', user.username)
      .set('password', user.password)
      .set('grant_type', user.grant_type);
    return this.http.post<ResponseLogin>(PATH_POST_LOGIN, body, {
      headers: headers,
      observe: 'response'
    }).pipe(map(response=>{
      this.storage.set("username",user.username);
      return response;
    }));
  }

  /**
   * Get out of the application 
   */
  get_logout(accessToken): Observable<HttpResponse<ResponseLogout>> {
    return Observable.create(obs => {
      this.http.get<ResponseLogout>(this.logoutUrl, {
        observe: 'response'
      }).subscribe(
        (data: HttpResponse<ResponseLogout>) => {
          obs.next(true);
        }, (error: HttpResponse<ErrorResponseLogout>) => {
          obs.next(true);
        }
      )});
  }
}
