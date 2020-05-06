import { HttpRequestModel } from 'libs/services/src/models/endpoints/HttpRequest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DefectiveRegistryModel } from '../../../models/endpoints/DefectiveRegistry';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExpeditionService {
  private baseUrl: string;
  private getExpeditionInfoURL: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiSorter;
    this.getExpeditionInfoURL = `${this.baseUrl}/opl-expedition/detail`;
  }

  
  getExpeditionInfo(id){
    return this.http.get<HttpRequestModel.Response>(this.getExpeditionInfoURL+'/'+id).pipe(
      map(resp => resp.data)
    )
  }

  
}
