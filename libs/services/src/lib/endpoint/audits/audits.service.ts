import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {  map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {AuditsModel} from "../../../models/endpoints/Audits";

@Injectable({
  providedIn: 'root'
})
export class AuditsService {

  private postCreateAuditUrl = environment.apiBase + '/sorter/audit';
  private postCheckProductInPackingUrl = environment.apiBase + '/sorter/audit/packing/product';

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider
  ) { }

  getAll():Observable<any>{
    return this.http.get(environment.apiBase+ '/sorter/audit/all-products').pipe();
  }

  create(data : any):Observable<any>{
    return this.http.post(environment.apiBase+ '/sorter/audit',data).pipe();
  }

  addProduct(data : any):Observable<any>{
    return this.http.post(environment.apiBase+ '/sorter/audit/audit-packing-product',data).pipe();
  }

  getById(id:any):Observable<any>{
    return this.http.get(environment.apiBase+ '/sorter/audit/'+id).pipe();
  }

  postCreateAudit(params: AuditsModel.ParamsCreateAudit) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postCreateAuditUrl, params);
  }

  postCheckProductInPacking(params: AuditsModel.ParamsCheckProductInPacking) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postCheckProductInPackingUrl, params);
  }

}
