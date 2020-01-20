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
    let products = [];
    if (data && data.products) {
      products = data.products;
    }

    let warehouses = [];
    if (data && data.warehouses) {
      warehouses = data.warehouses;
    }

    let orderBy = {
      "type": 1,
      "order": "asc"
    };

    if (data && data.orderby) {
      orderBy = {
        "type": data.orderby.type,
        "order": data.orderby.order
      };
    }

    return this.http.post(environment.apiBase + this.urlPackingShow, {
      reference: carrierReference,
      "products": products,
      "warehouses": warehouses,
      "orderBy": orderBy
    }).pipe();
  }

  getAllFilters(body: any):Observable<any>{
    return this.http.post(environment.apiBase + this.getAllFiltersUrl, body).pipe(map((response:any)=>{
      return response.data;
    }));
  }
}
