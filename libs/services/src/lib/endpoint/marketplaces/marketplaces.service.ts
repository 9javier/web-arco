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
  private getMapDataRulesUrl = this.apiBase + "/api/MapDataRules";
  private postMapDataRulesUrl = this.apiBase + "/api/MapDataRules/";
  private updateMapDataRulesUrl = this.apiBase + "/api/MapDataRules/";
  private deleteMapDataRulesUrl = this.apiBase + "/api/MapDataRules/";
  private getMapEntitiesUrl = this.apiBase + "/api/EnumMetadata/get/mapentity";
  private getRulesFilterTypesUrl = this.apiBase + "/api/EnumMetadata/get/rulefiltertype";
  private getRulesFilterUrl = this.apiBase + "/api/RuleFilter";
  private postRulesFilterUrl = this.apiBase + "/api/RuleFilter";
  private updateRulesFilterUrl = this.apiBase + "/api/RuleFilter/{{id}}";
  private getRulesFilterByTypeUrl = this.apiBase + "/api/RuleFilter/{{type}}";
  private getMarketsUrl = this.apiMiddleware + "/api/v1/market";
  private getRulesConfigurationsUrl = this.apiMiddleware + "/api/v1/ruleConfiguration/byMarket/";
  private postRulesConfigurationsUrl = this.apiMiddleware + "/api/v1/ruleConfiguration";
  private updateRulesConfigurationsUrl = this.apiMiddleware + "/api/v1/ruleConfiguration/";
  private getRulesConfigurationsByIdUrl = this.apiBase + "/api/RuleConfiguration/{{id}}";
  private getBrandsRuleFilters = this.apiBase + "/api/RuleFilter/5";
  private getColorsRuleFilters = this.apiBase + "/api/RuleFilter/3";
  private getFeaturesRuleFilters = this.apiBase + "/api/RuleFilter/2";
  private getSizesRuleFilters = this.apiBase + "/api/RuleFilter/4";
  private postProductCategoryUrl = this.apiBase + "/api/ProductCategory/";
  private getProductCategoryUrl = this.apiBase + "/api/ProductCategory/";
  private getProductCatalogUrl = this.apiMiddleware + "/api/v1/product";
  private getCategories = this.apiMiddleware + "/api/v1/marketCategory/byMarket/";
  private getMarketSizesUrl = this.apiMiddleware + "/market/product-property/sizes/by-market/";
  private getMarketBrandsUrl = this.apiMiddleware + "/market/product-property/brands/by-market/";
  private getMarketColorsUrl = this.apiMiddleware + "/market/product-property/colors/by-market/";
  private getMarketFeaturesUrl = this.apiMiddleware + "/market/product-property/features/by-market/";

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
    return this.http.get<any>(this.getMapDataRulesUrl , {}).pipe(map(response => {
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

  getRulesConfigurations(market): Observable<any> {
    return this.http.get<any>(this.getRulesConfigurationsUrl + market, {}).pipe(map(response => {
      return response;
    }));
  }

  /*
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
  */

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
    return this.http.put<any>(this.updateRulesConfigurationsUrl + ruleConfigurationId, data, {}).pipe(map(response => {
      return response;
    }));
  }

  getMarketCategories(market): Observable<any> {
    return this.http.get<any>(this.getCategories + market, {}).pipe(map(response => {
      return response;
    }));
  }

  /*
  getMarketCategories(marketId: number): Observable<any> {
    return this.http.get<any>(this.getCategoriesUrl.replace('{{id}}', marketId.toString()), {}).pipe(map(response => {
      return response;
    }));
  }
  */

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

  getMarketSizes(market): Observable<any> {
    return this.http.get<any>(this.getMarketSizesUrl + market, {}).pipe(map(response => {
      return response;
    }));
  }

  getMarketBrands(market): Observable<any> {
    return this.http.get<any>(this.getMarketBrandsUrl + market, {}).pipe(map(response => {
      return response;
    }));
  }

  getMarketColors(market): Observable<any> {
    return this.http.get<any>(this.getMarketColorsUrl + market, {}).pipe(map(response => {
      return response;
    }));
  }

  getMarketFeatures(market): Observable<any> {
    return this.http.get<any>(this.getMarketFeaturesUrl + market, {}).pipe(map(response => {
      return response;
    }));
  }
}
