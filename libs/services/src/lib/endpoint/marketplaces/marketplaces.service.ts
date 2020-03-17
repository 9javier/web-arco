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
  private apiMiddleware = environment.apiMiddleware;
  private getMapDataRulesUrl = this.apiMiddleware + "/api/v1/ruleDataMap";
  private postMapDataRulesUrl = this.apiMiddleware + "/api/v1/ruleDataMap";
  private updateMapDataRulesUrl = this.apiMiddleware + "/api/v1/ruleDataMap/";
  private getMarketsUrl = this.apiMiddleware + "/api/v1/market";
  private getRulesConfigurationsUrl = this.apiMiddleware + "/api/v1/ruleConfiguration";
  private getRulesConfigurationsByMarketUrl = this.apiMiddleware + "/api/v1/ruleConfiguration/byMarket/{{id}}";
  private postRulesConfigurationsUrl = this.apiMiddleware + "/api/v1/ruleConfiguration";
  private updateRulesConfigurationsUrl = this.apiMiddleware + "/api/v1/ruleConfiguration/{{id}}";
  private getRulesConfigurationsByIdUrl = this.apiMiddleware + "/api/v1/ruleConfiguration/{{id}}";
  private getProductCatalogUrl = this.apiMiddleware + "/api/v1/product";

  private getBrandsRuleFilters = this.apiMiddleware + "/api/v1/ruleFilter/type/5";
  private getColorsRuleFilters = this.apiMiddleware + "/api/v1/ruleFilter/type/3";
  private getFeaturesRuleFilters = this.apiMiddleware + "/api/v1/ruleFilter/type/2";
  private getSizesRuleFilters = this.apiMiddleware + "/api/v1/ruleFilter/type/4";
  
  private postProductCategoryUrl = this.apiMiddleware + "/api/v1/productCategory";
  private getCategoriesUrl = this.apiMiddleware + "/api/v1/productCategory/byMarket/{{id}}";

  private getRulesFilterTypesUrl = this.apiBase + "/api/EnumMetadata/get/rulefiltertype";
  private getRulesFilterUrl = this.apiBase + "/api/RuleFilter";
  private postRulesFilterUrl = this.apiBase + "/api/RuleFilter";
  private updateRulesFilterUrl = this.apiBase + "/api/RuleFilter/{{id}}";
  private getRulesFilterByTypeUrl = this.apiBase + "/api/RuleFilter/{{type}}";

  private deleteMapDataRulesUrl = this.apiBase + "/api/MapDataRules/";
  private getMapEntitiesUrl = this.apiBase + "/api/EnumMetadata/get/mapentity";
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

  updateMapDataRules(mapDataId: number, data) {
    return this.http.put(this.updateMapDataRulesUrl + mapDataId.toString(), data).pipe(map(response => {
      return response;
    }));
  }

  deleteMapDataRules(mapDataId: number): Observable<any> {
    return this.http.delete<any>(this.deleteMapDataRulesUrl + mapDataId.toString(), {}).pipe(map(response => {
      return response;
    }));
  }

  getRulesFilterTypes(): Observable<any> {
    return this.http.get<any>(this.getRulesFilterTypesUrl, {}).pipe(map(response => {
      return response;
    }));
  }

  getBrands(): Observable<any> {
    return this.http.get<any>(this.getBrandsRuleFilters, {}).pipe(map(response => {
      return response;
    }));
  }

  getSizes(): Observable<any> {
    return this.http.get<any>(this.getSizesRuleFilters, {}).pipe(map(response => {
      return response;
    }));
  }

  getFeatures(): Observable<any> {
    return this.http.get<any>(this.getFeaturesRuleFilters, {}).pipe(map(response => {
      return response;
    }));
  }

  getColors(): Observable<any> {
    return this.http.get<any>(this.getColorsRuleFilters, {}).pipe(map(response => {
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

  getRulesConfigurations(): Observable<any> {
    return this.http.get<any>(this.getRulesConfigurationsUrl, {}).pipe(map(response => {
      return response;
    }));
  }

  getRulesConfigurationsByMarket(marketId: number): Observable<any> {
    return this.http.get<any>(this.getRulesConfigurationsByMarketUrl.replace('{{id}}', marketId.toString()), {}).pipe(map(response => {
      return response;
    }));
  }

  getRulesConfigurationsById(ruleConfigurationId: number): Observable<any> {
    return this.http.get<any>(this.getRulesConfigurationsByIdUrl.replace('{{id}}', ruleConfigurationId.toString()), {}).pipe(map(response => {
      return response;
    }));
  }

  postRulesConfigurations(data): Observable<any> {
    return this.http.post<any>(this.postRulesConfigurationsUrl, data, {}).pipe(map(response => {
      return response;
    }));
  }

  updateRulesConfigurations(ruleConfigurationId, data): Observable<any> {
    return this.http.put<any>(this.updateRulesConfigurationsUrl.replace('{{id}}', ruleConfigurationId.toString()), data, {}).pipe(map(response => {
      return response;
    }));
  }

  getMarketCategories(marketId: number): Observable<any> {
    return this.http.get<any>(this.getCategoriesUrl.replace('{{id}}', marketId.toString()), {}).pipe(map(response => {
      return response;
    }));
  }

  postProductCategory(data): Observable<any> {
    return this.http.post<any>(this.postProductCategoryUrl, data, {}).pipe(map(response => {
      return response;
    }));
  }

  getProductCatalog(): Observable<any> {
    return this.http.get<any>(this.getProductCatalogUrl, {}).pipe(map(response => {
      return response;
    }));
  }
}
