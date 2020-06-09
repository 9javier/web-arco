import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NewProductModel } from 'libs/services/src/models/endpoints/NewProduct';
import { RequestsProvider } from '../../../providers/requests/requests.provider';
import { ExcellModell } from 'libs/services/src/models/endpoints/Excell';
import { AuthenticationService } from '../authentication/authentication.service';
import { from, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PackageReceivedService {
  private getIndexUrl:string = environment.apiBase+"/package/all";
  private getStatusEnumUrl:string = environment.apiBase + "/types/status-prices";
  private getAllFiltersUrl: string = environment.apiBase + '/package/get/filters';
  private getListNewProductsFiltersUrl: string = environment.apiBase + '/processes/receive-store/list-new-product/filters';
  private getListNewProducts: string = environment.apiBase + '/processes/receive-store/list-new-product/all';
  private getListNewProductsFileExcel: string = environment.apiBase + '/inventory/export-to-excel/list-new-product';

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider,
    private auth: AuthenticationService,

  ) { }

  getIndex(parameters):Observable<any>{
    return this.http.post<any>(this.getIndexUrl,parameters).pipe(map(response=>{
      return response.data;
    }));
  }

  getListNewproducts(parameters):Observable<NewProductModel.ResponseNewProductsPaginated>{
    return this.http.post<NewProductModel.ResponseNewProduct>(this.getListNewProducts,parameters).pipe(map(response=>{
      return response.data;
    }));
  }

  getListNewproductsFileExcel(parameters):Observable<NewProductModel.ResponseNewProductsPaginated>{
    return this.http.post<NewProductModel.ResponseNewProduct>(this.getListNewProductsFileExcel,parameters).pipe(map(response=>{
      return response.data;
    }));
  }

  
  getFileExcell(form: any){
    return this.http.post(this.getListNewProductsFileExcel, form,{responseType: 'blob'})
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

  getListNewProductsFilters(form: any):Observable<any>{
    return this.http.post(this.getListNewProductsFiltersUrl, form).pipe(map((response:any)=>{
      return response.data;
    }));
  }

}
