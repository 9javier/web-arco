import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class MarketplacesService {

  private apiBase = environment.apiRule;
  private getMapDataRulesUrl = this.apiBase + "/MapDataRules";
  private postMapDataRulesUrl = this.apiBase + "/MapDataRules";
  private updateMapDataRulesUrl = this.apiBase + "/MapDataRules/";
  private getMapEntitiesUrl = this.apiBase + "/EnumMetadata/get/mapentity";
  private getRulesFilterTypesUrl = this.apiBase + "/EnumMetadata/get/rulefiltertype";
  private getRulesFilterUrl = this.apiBase + "/RuleFilter";
  private postRulesFilterUrl = this.apiBase + "/RuleFilter";
  private updateRulesFilterUrl = this.apiBase + "/RuleFilter/{{id}}";
  private getRulesFilterByTypeUrl = this.apiBase + "/RuleFilter/{{type}}";
  private getMarketsUrl = this.apiBase + "/Markets";

  constructor(
    private http: HttpClient
  ) {
  }

  getMapEntities(): Observable<any> {
    return this.http.get<any>(this.getMapEntitiesUrl, {}).pipe(
      map(response => {
        return response;
    }));
  }

  getMapDataRules(): Observable<any> {
    return this.http.get<any>(this.getMapDataRulesUrl, {}).pipe(map(response => {
      return response;
    }));
  }

  postMapDataRules(data): Observable<any> {
    return this.http.post<any>(this.postMapDataRulesUrl, data, {}).pipe(map(response => {
      return response;
    }));
  }

  updateMapDataRules(mapDataId: number, data): Observable<any> {
    return this.http.put<any>(this.updateMapDataRulesUrl + mapDataId.toString(), data, {}).pipe(map(response => {
      return response;
    }));
  }

  getRulesFilterTypes(): Observable<any> {
    return this.http.get<any>(this.getRulesFilterTypesUrl, {}).pipe(map(response => {
      return response;
    }));
  }

  getRulesFilter(): Observable<any> {
    return this.http.get<any>(this.getRulesFilterUrl, {}).pipe(map(response => {
      return response;
    }));
  }

  postRulesFilter(data): Observable<any> {
    return this.http.post<any>(this.postRulesFilterUrl, data, {}).pipe(map(response => {
      return response;
    }));
  }

  updateRulesFilter(ruleFilterId: number, data): Observable<any> {
    return this.http.put<any>(this.updateRulesFilterUrl.replace('{{id}}', ruleFilterId.toString()), data, {}).pipe(map(response => {
      return response;
    }));
  }

  getRulesFilterByType(type): Observable<any> {
    return this.http.get<any>(this.getRulesFilterByTypeUrl.replace('{{type}}', type.toString()), {}).pipe(map(response => {
      return response;
    }));
  }

  getMarkets(): Observable<any> {
    return this.http.get<any>(this.getMarketsUrl, {}).pipe(map(response => {
      return response;
    }));
  }
}
