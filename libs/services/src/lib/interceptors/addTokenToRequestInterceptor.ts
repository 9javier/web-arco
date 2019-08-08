import { Injectable } from '@angular/core';

import { AuthenticationService } from '../../../../services/src/lib/endpoint/authentication/authentication.service';


import { Router, ActivatedRoute, Route } from '@angular/router';
import {empty} from 'rxjs/internal/Observer';

import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from, BehaviorSubject } from 'rxjs';
import { catchError,map, switchMap,finalize,filter,take } from 'rxjs/operators';
import { Oauth2Service } from '../endpoint/oauth2/oauth2.service';
import { IntermediaryService } from '../endpoint/intermediary/intermediary.service';
import {ToastController} from "@ionic/angular";

@Injectable()
export class AddTokenToRequestInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private intermediaryService:IntermediaryService,
    private router: Router,
    private route: ActivatedRoute,
    private oauth2Service:Oauth2Service,
    private toastController: ToastController
  ) {}

  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private isToastVisible: boolean = false;

  addTokenToRequest(request:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
    return from(this.authenticationService.getCurrentToken()).pipe(switchMap(token=>{
      if(!token && !(request.url.includes("/api/oauth2/"))){
        this.authenticationService.logout()
        return  Observable.create(empty);
      }else if(token){
        return  next.handle(!(request.url.includes("/api/oauth2/"))?request.clone({
          setHeaders: {
              Authorization: `${token}`
          }
        }):request).
        /**Catch http response error to detect if it is 401 or 403(authentication) */
        pipe(catchError((err,caught)=>{
          switch (err.status) {
            case 403:
              console.log(1);
              return this.handle401Error(request, next);
            case 401:
              console.log(2);
              if(!request.url.includes("/api/oauth2/"))
                return this.handle401Error(request, next);
              this.authenticationService.logout();
              return new Observable(observer=>observer.error(err));
            case 400:
              console.log(3);
              if(request.url.includes('token')){
                return new Observable(observer=>{
                  observer.error();
                }).pipe(map((error)=>{
                  this.authenticationService.logout();
                  return error;
                }));
              }
          }

          /*if (this.authenticationService.isAuthenticated()) {
            this.authenticationService.logout();
            if (!this.isToastVisible) {
              this.presentToast('Ha ocurrido un error al conectar con el servidor.', 'danger');
            }
          } else {
            this.presentToast('El servidor no se encuentra disponible en este instante.', 'danger');
          }*/
          return new Observable(observer=>observer.error(err));
        }));
      }else{
        return next.handle(request);
      }
    }));
  }



  /**
   * Handle the http 401 error(authentication) to request a new refresh token
   * @param request 
   * @param next 
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    /**the token is not current refreshing */
    if(!this.isRefreshingToken) {
      /**activate the flag: the token is refreshing */
      this.isRefreshingToken = true;
 
      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
      console.log("intentando refrescar");
      /**first we obtain the refresh token */
      return from(this.authenticationService.getCurrentRefreshToken())
      /**then with that token call the refresh token endpoint */
      .pipe(switchMap(token=>{
        return this.oauth2Service.refreshToken(token)
        /**save the new token  in storage*/
        .pipe(switchMap(response=>{
          console.log(response);
          return from(this.authenticationService.login(response.data.access_token, response.data.user.id,response.data.accessPermitionsDictionary,response.data.refresh_token));
        }))
      })).pipe(
          switchMap((user) => {
            this.tokenSubject.next("ok");
            return this.addTokenToRequest(request, next);
          }),
          catchError(err => {
            this.isRefreshingToken = false;
            this.intermediaryService.presentConfirm("Su sesión ha expirado",()=>{});
            this.authenticationService.logout();
            return new Observable(observer=>observer.error(err));
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      /**if the token is refreshing add the new request to subject */
       return this.tokenSubject
        .pipe(filter(token => token !== null),
          take(1),
          switchMap(token => {
          return this.addTokenToRequest(request, next);
        }));
    }
  }


  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.addTokenToRequest(request,next);
  }

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3750,
      color: color || "primary"
    });
    toast.present();
    this.isToastVisible = true;
    setTimeout(() => {
      this.isToastVisible = false;
    }, 3750);
  }
}
