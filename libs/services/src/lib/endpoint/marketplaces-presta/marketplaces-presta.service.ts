import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarketplacesPrestaService {

  private apiBase = 'https://miniprecios.dev-krack.com.es/module/enodesync';
  private getBrandsPrestaUrl = this.apiBase + '/manufacturers?task=get_manufacturers_markets&all_info=true';
  private getSizesPrestaUrl = this.apiBase + '/sizes?task=get_sizes_markets&all_info=true';
  private getColorsPrestaUrl = this.apiBase + '/colors?task=get_colors&all_info=true';
  private getFeaturesPrestaUrl = this.apiBase + '/features?task=get_features&all_info=true';

  constructor(
    private http: HttpClient
  ) {}

  getBrands():Observable<any> { 
    return this.http.get<any>(this.getBrandsPrestaUrl, {}).pipe(map(response=>{
      return response;
    }));
  }

  getSizes():Observable<any> { 
    return this.http.get<any>(this.getSizesPrestaUrl, {}).pipe(map(response=>{
      return response;
    }));
  }

  getColors():Observable<any> { 
    return this.http.get<any>(this.getColorsPrestaUrl, {}).pipe(map(response=>{
      return response;
    }));
  }

  getFeatures():Observable<any> { 
    return this.http.get<any>(this.getFeaturesPrestaUrl, {}).pipe(map(response=>{
      return response;
    }));
  }

}
