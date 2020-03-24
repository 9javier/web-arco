import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class MarketplacesMgaService {

  private apiBase = environment.apiBase;
  private apiGeneralLogisticOperator = environment.apiLogisticOperator;
  private getColorsUrl = this.apiBase + '/products/models/color';
  private geBrandsUrl = this.apiBase + '/products/models/brand';
  private getSizesUrl = this.apiBase + '/products/models/domainsizes/sizes';
  private getFeaturesRuleMarketUrl = this.apiBase + '/products/models/internalgroups/rulemarket/{{idMarketplace}}';
  private getFeaturesByMarketUrl = this.apiBase + '/products/models/internalgroups/{{idMarketplace}}';
  private getTotalProductsUrl = this.apiBase + '/products/models/numberOfModels';
  private getProvincesUrl = this.apiBase + '/provinces/';
  private getMarketsUrl = this.apiBase + '/markets/';
  private getCountriesUrl = this.apiBase + '/countries/';
  private getLogisticsOperatorsUrl = this.apiGeneralLogisticOperator + '/logistics-operators/';
  private createRulesUrl = this.apiGeneralLogisticOperator + '/logistics-operators-rules/';
  private getAllRulesUrl = this.apiGeneralLogisticOperator + '/logistics-operators-rules/';
  private deleteRulesUrl = this.apiGeneralLogisticOperator + '/logistics-operators-rules/{{idRule}}';
  private updateRulesUrl = this.apiGeneralLogisticOperator + '/logistics-operators-rules/';
  private getReferencesFilteredUrl = this.apiBase + '/products/models/filtered';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  getColors():Observable<any>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getColorsUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  getBrands():Observable<any>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.geBrandsUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }


  getSizes():Observable<any>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getSizesUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  getFeaturesRuleMarket(id:number):Observable<any>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getFeaturesRuleMarketUrl.replace("{{idMarketplace}}",String(id)), {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  getFeaturesByMarket(id: number):Observable<any>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getFeaturesByMarketUrl.replace("{{idMarketplace}}",String(id)), {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  getTotalNumberOfProducts():Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getTotalProductsUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  getProvinces():Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getProvincesUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  getCountries():Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getCountriesUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  getMarkets():Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getMarketsUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  getLogisticsOperators():Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getLogisticsOperatorsUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  createRules(data):Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.post<any>(this.createRulesUrl, data, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  getAllRules():Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getAllRulesUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  deleteRules(idRule:number){
    return this.http.delete<any>(this.deleteRulesUrl.replace("{{idRule}}",String(idRule)))
      .pipe(map(response => {
        return response;
      }));
  }

  updateRules(data){
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.put<any>(this.updateRulesUrl + data.id, data, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  postReferencesFiltered(data):Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.post<any>(this.getReferencesFilteredUrl, data, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

}
