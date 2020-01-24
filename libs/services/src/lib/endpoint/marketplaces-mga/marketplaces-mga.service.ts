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
  private getColorsUrl = this.apiBase + '/products/models/color';
  private geBrandsUrl = this.apiBase + '/products/models/brand';
  private getSizesUrl = this.apiBase + '/products/models/domainsizes/sizes';
  private getFeaturesUrl = this.apiBase + '/products/models/internalgroups';
  private getFeaturesByMarketUrl = this.apiBase + '/products/models/internalgroups/{{idMarketplace}}';

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

  getFeatures():Observable<any>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<any>(this.getFeaturesUrl, {headers}).pipe(map(response=>{
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

}
