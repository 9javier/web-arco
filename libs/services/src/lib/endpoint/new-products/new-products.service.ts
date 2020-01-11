import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewProductModel } from 'libs/services/src/models/endpoints/NewProduct';
import { RequestsProvider } from '../../../providers/requests/requests.provider';

@Injectable({
  providedIn: 'root'
})
export class NewProductsService {
  private getIndexUrl:string = environment.apiBase+"/processes/receive-store/store-stock-new-product/all";
  private getStatusEnumUrl:string = environment.apiBase + "/types/status-prices";
  private getAllFiltersUrl: string = environment.apiBase + '/processes/receive-store/store-stock-new-product/filters';

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider
  ) { }

  getIndex(parameters):Observable<NewProductModel.ResponseNewProductsPaginated>{
    return this.http.post<NewProductModel.ResponseNewProduct>(this.getIndexUrl,parameters).pipe(map(response=>{
      return response.data;
    }));
  }

  getStatusEnum():Observable<Array<NewProductModel.StatusType>>{
    return this.http.get<NewProductModel.ResponseStatusType>(this.getStatusEnumUrl).pipe(map(response=>{
      return response.data;
    }));
  }

  getAllFilters(form: any):Observable<any>{
    return this.http.post(this.getAllFiltersUrl, form).pipe(map((response:any)=>{
      return response.data;
    }));
  }
}
