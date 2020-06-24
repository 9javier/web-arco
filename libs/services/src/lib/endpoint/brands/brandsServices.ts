import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { RequestsProvider } from "../../../providers/requests/requests.provider";
import { HttpRequestModel } from "../../../models/endpoints/HttpRequest";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  private postGetFilterOplExpeditionUrl: string = environment.apiBase + "/opl-expedition/filter";
  private postNewTrasnportUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/new";
  private postBrandsUrl: string = environment.apiBase + "/brands/brands";
  private deleteTransportUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/";
  private putUpdateTrasnportUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/";
  private getBrandsFiltersUrl: string = environment.apiBase + "/brands/filters";
  private getBrandsAllUrl: string = environment.apiBase + "/brands/all";
  private getSubBrandsUrl: string = environment.apiBase + "/brands/subbrands/";
  private getGroupsUrl: string = environment.apiBase + "/brands/groups/";
  private getSizesUrl: string = environment.apiBase + "/brands/sizes-group/";


  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}


  getBrands(): Observable<any> {
    return this.http.get<HttpRequestModel.Response>(this.postBrandsUrl).pipe(
      map(resp => resp.data)
    )
  }

  getFiltersBrands(): Observable<any> {
    return this.http.get<HttpRequestModel.Response>(this.getBrandsFiltersUrl).pipe(
      map(resp => resp.data)
    )
  }

  getBrandsAll(): Observable<any> {
    return this.http.get<HttpRequestModel.Response>(this.getBrandsAllUrl).pipe(
      map(resp => resp.data)
    )
  }

  
  getSubBrands(id): Observable<any> {
    return this.http.get<HttpRequestModel.Response>(this.getSubBrandsUrl+`${id}`).pipe(
      map(resp => resp.data)
    )
  }
 
  getGroups(id): Observable<any> {
    return this.http.get<HttpRequestModel.Response>(this.getGroupsUrl+`${id}`).pipe(
      map(resp => resp.data)
    )
  }

  getSizes(id:number): Observable<any> {
    return this.http.get<HttpRequestModel.Response>(this.getSizesUrl+`${id}`).pipe(
      map(resp => resp.data)
    )
  }

}
