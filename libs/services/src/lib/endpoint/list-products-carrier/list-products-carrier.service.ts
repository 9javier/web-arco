import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RequestsProvider } from '../../../providers/requests/requests.provider';
import { environment } from '@suite/services';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListProductsCarrierService {
  private urlPackingShow = '/packing/show';
  private getAllFiltersUrl = '/packing/show/entities';
  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider
  ) { }

  getProducts(carrierReference: string, data = null):Observable<any>{
    return this.http.post(environment.apiBase + this.urlPackingShow, {
      reference: carrierReference,
      "products": data ? data.products : [],
      "warehouses": data ? data.warehouses : [],
      "orderBy": data ? data.orderby ? {
        "type": data.orderby.type,
        "order": data.orderby.order
      } : {
        "type":1,
        "order": "asc"
      } : {
        "type":1,
        "order": "asc"
      }
    }).pipe();
  }

  getAllFilters(body: any):Observable<any>{
    return this.http.post(environment.apiBase + this.getAllFiltersUrl, body).pipe(map((response:any)=>{
      return response.data;
    }));
  }
}
