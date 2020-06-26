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
  private postBrandsUrl: string = environment.apiBase + "/marketplace/brands/brands-list/";
  private deleteTransportUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/";
  private putUpdateTrasnportUrl: string = environment.apiBase + "/opl-expedition/expedition/transport/";
  private getBrandsFiltersUrl: string = environment.apiBase + "/marketplace/brands/filters";
  private getBrandsAllUrl: string = environment.apiBase + "/marketplace/prestashop/brands";
  private getSubBrandsUrl: string = environment.apiBase + "/marketplace/brands/subbrands/";
  private getGroupsUrl: string = environment.apiBase + "/marketplace/prestashop/brands/";
  private getSizesUrl: string = environment.apiBase + "/marketplace/brands/sizes-group/";
  private postOnBoardMatchUrl: string = environment.apiBase + "/marketplace/brands/brands/";


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
    return this.http.get<HttpRequestModel.Response>(this.getGroupsUrl+`${id}/zalando/sizes/`).pipe(
      map(resp => resp.data)
    )
  }

  getSizes(body): Observable<any> {
    return this.http.post<HttpRequestModel.Response>(this.getSizesUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  postOnBoardingMatchingBrand(body): Observable<any> {
    return this.http.post<HttpRequestModel.Response>(this.postOnBoardMatchUrl,body).pipe(
      map(resp => resp.data)
    )
  }

}
