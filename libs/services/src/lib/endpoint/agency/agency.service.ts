import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {  map } from 'rxjs/operators';
import { AgencyModel } from 'libs/services/src/models/endpoints/agency.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  /**Urls for Agency service */
  private requestUrl:string = environment.apiBase+"/manage-agencies";
  private singleRequestUrl:string = environment.apiBase+"/manage-agencies/{{id}}"

  constructor(
    private http:HttpClient
  ) { }

  getAll():Observable<AgencyModel.Agency[]>{
    return this.http.get<AgencyModel.Response>(this.requestUrl).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Get agency by id
   * @param id 
   */
  getShow(id:number){
    return this.http.get<AgencyModel.SingleResponse>(this.singleRequestUrl.replace("{{id}}",String(id))).pipe(map(response=>{
      return response.data;
    }))
  }

  /**
   * Delete agency by id
   * @param id 
   */
  delete(id:number){
    return this.http.delete(this.singleRequestUrl.replace("{{id}}",String(id)));
  }

  store(agency:AgencyModel.Request):Observable<AgencyModel.Agency>{
    return this.http.post<AgencyModel.SingleResponse>(this.requestUrl,agency).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Update agency by id
   * @param id 
   * @param agency 
   */
  update(id:number, agency:AgencyModel.Request):Observable<AgencyModel.Agency>{
    return this.http.put<AgencyModel.SingleResponse>(this.singleRequestUrl.replace("{{id}}",String(id)),agency).pipe(map(response=>{
      return response.data;
    }))
  }


}
