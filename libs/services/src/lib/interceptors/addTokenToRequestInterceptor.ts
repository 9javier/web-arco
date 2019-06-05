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
import { Observable, throwError, from } from 'rxjs';
import { catchError,map, switchMap } from 'rxjs/operators';

@Injectable()
export class AddTokenToRequestInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


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
        }):request);
      }else{
        return next.handle(request);
      }

    }));
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.addTokenToRequest(request,next);
  }
}
