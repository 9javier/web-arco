import { Injectable } from '@angular/core';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import { RequestsProvider } from "../../../providers/requests/requests.provider";
import { HttpRequestModel } from "../../../models/endpoints/HttpRequest";
import { environment } from '../../../environments/environment';
import {ExcellModell} from "../../../models/endpoints/Excell";
import {InventoryModel} from "../../../models/endpoints/Inventory";
import { AuthenticationService } from '../authentication/authentication.service';
import { PATH } from "../../../../../../config/base";
import { from, Observable } from "rxjs";
import { map, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  /**Private urls for Customers service */
  private customersUrl: string = environment.apiBase + "/customer/all";
  private customersFiltersUrl: string = environment.apiBase + "/customer/filters";
  private customersByIdUrl: string = environment.apiBase + "/customer/get/id";
  private customersPutUrl: string = environment.apiBase + "/customer/save";
  private customersAddressPutUrl: string = environment.apiBase + "/customer/address/save";
  private customersEmailPutUrl: string = environment.apiBase + "/customer/email/";
  private customersEmailPostUrl: string = environment.apiBase + "/customer/email/save/";


  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider,
    private auth: AuthenticationService
  ) {
  }
  /**
   * Get all carriers in server
   * @returns an array of carriers
   */
  getIndex(body:any):Observable<any>{
    return this.http.post<any>(this.customersUrl,body).pipe(map(response => {
      return response.data;
    }));
  }

  getFiltersCustomer():Observable<any>{
    return this.http.get<any>(this.customersFiltersUrl).pipe(map(response => {
      return response.data;
    }));
  }

  
  getCustomerById(id):Observable<any>{
    return this.http.post<any>(this.customersByIdUrl,id).pipe(map(response => {
      return response.data;
    }));
  }

  postUpdateCustomer(data):Observable<any>{
    return this.http.post<any>(this.customersPutUrl,data).pipe(map(response => {
      return response.data;
    }));
  }

  postUpdateAddress(data):Observable<any>{
    return this.http.post<any>(this.customersAddressPutUrl,data).pipe(map(response => {
      return response.data;
    }));
  }

  putUpdateEmail(id,emailBody):Observable<any>{
    return this.http.put<any>(this.customersEmailPutUrl+`${id}`,emailBody).pipe(map(response => {
      return response.data;
    }));
  }
 
  postCreateEmail(id,emailBody):Observable<any>{
    return this.http.post<any>(this.customersEmailPostUrl+`${id}`,emailBody).pipe(map(response => {
      return response.data;
    }));
  }

}
