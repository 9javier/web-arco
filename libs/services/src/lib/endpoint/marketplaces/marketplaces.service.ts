import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { RequestsProvider } from 'libs/services/src/providers/requests/requests.provider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MarketplacesService {

  private apiBase = 'https://localhost:5001/api';
  private getMapDataRulesUrl = this.apiBase + "/MapDataRules";
  private postMapDataRulesUrl = this.apiBase + "/MapDataRules";
  private getMapEntitiesUrl = this.apiBase + "/EnumMetadata/get/mapentity";
  private getRulesFilterTypesUrl = this.apiBase + "/EnumMetadata/get/rulefiltertype";
  private getRulesFilterUrl = this.apiBase + "/RuleFilter";
  private postRulesFilterUrl = this.apiBase + "/RuleFilter";
  private getMarketsUrl = this.apiBase + "/Markets";

  constructor(
    private http: HttpClient
  ) {}

  getMapEntities():Observable<any> { 
    return this.http.get<any>(this.getMapEntitiesUrl, {}).pipe(map(response=>{
      return response;
    }));
  }

  getMapDataRules():Observable<any> { 
    return this.http.get<any>(this.getMapDataRulesUrl, {}).pipe(map(response=>{
      return response;
    }));
  }

  postMapDataRules(data):Observable<any> { 
    return this.http.post<any>(this.postMapDataRulesUrl, data, {}).pipe(map(response=>{
      return response;
    }));
  }

  getRulesFilterTypes():Observable<any> {
    return this.http.get<any>(this.getRulesFilterTypesUrl, {}).pipe(map(response=>{
      return response;
    }));
  }

  getRulesFilter():Observable<any> {
    return this.http.get<any>(this.getRulesFilterUrl, {}).pipe(map(response=>{
      return response;
    }));
  }

  postRulesFilter(data):Observable<any> {
    return this.http.post<any>(this.getRulesFilterUrl, data, {}).pipe(map(response=>{
      return response;
    }));
  }

  getMarkets():Observable<any> {
    return this.http.get<any>(this.getMarketsUrl, {}).pipe(map(response=>{
      return response;
    }));
  }
}
