import {Injectable} from '@angular/core';
import {AuthenticationService} from '../../../../services/src/lib/endpoint/authentication/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {empty} from 'rxjs/internal/Observer';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable, from, BehaviorSubject} from 'rxjs';
import {catchError, map, switchMap, finalize, filter, take} from 'rxjs/operators';
import {Oauth2Service} from '../endpoint/oauth2/oauth2.service';
import {IntermediaryService} from '../endpoint/intermediary/intermediary.service';
import {Location} from "@angular/common";
import { TimesToastType } from '../../models/timesToastType';

@Injectable()
export class AddTokenToRequestInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private intermediaryService: IntermediaryService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private oauth2Service: Oauth2Service
  ) { }

  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private isToastVisible: boolean = false;

  private listRoutesWithCustomErrorConnectionManagement: string[] = [
    '/print/product/relabel',
    '/print-tag/manual/price'
  ];

  addTokenToRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   return next.handle(request);
  }

  /**
   * Handle the http 401 error(authentication) to request a new refresh token
   * @param request
   * @param next
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    /**the token is not current refreshing */
    if (!this.isRefreshingToken) {
      /**activate the flag: the token is refreshing */
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
      /**first we obtain the refresh token */
      return from(this.authenticationService.getCurrentRefreshToken())
        /**then with that token call the refresh token endpoint */
        .pipe(switchMap(token => {
          return this.oauth2Service.refreshToken(token)
            /**save the new token  in storage*/
            .pipe(switchMap(response => {
              return from(this.authenticationService.login(response.data.access_token, response.data.user.id, response.data.accessPermitionsDictionary, response.data.refresh_token));
            }))
        })).pipe(
          switchMap((user) => {
            this.tokenSubject.next("ok");
            return this.addTokenToRequest(request, next);
          }),
          catchError(err => {
            this.isRefreshingToken = false;
            this.intermediaryService.presentWarning("Su sesión ha expirado", () => { });
            this.authenticationService.logout();
            return new Observable(observer => observer.error(err));
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

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.addTokenToRequest(request, next);
  }
}
