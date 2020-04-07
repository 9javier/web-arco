import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NewProductModel } from 'libs/services/src/models/endpoints/NewProduct';
import { ReceptionFinalModel } from 'libs/services/src/models/endpoints/reception-final';
import { RequestsProvider } from '../../../providers/requests/requests.provider';
import { ExcellModell } from 'libs/services/src/models/endpoints/Excell';
import { AuthenticationService } from '../authentication/authentication.service';
import { from, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReceptionFinalService {
  private getIndexUrl:string = environment.apiBase+"/final-reception/all";
  private updateRecepFinalUrl:string = environment.apiBase+"/final-reception/";
  private getWarehouseUrl:string = environment.apiBase+"/final-reception/warehouses";
  private getByIdWarehouseUrl:string = environment.apiBase+"/final-reception/";
  private getStatusEnumUrl:string = environment.apiBase + "/types/status-prices";
  private getAllFiltersUrl: string = environment.apiBase + '/processes/receive-store/store-stock-new-product/filters';
  private getListNewProductsFiltersUrl: string = environment.apiBase + '/processes/receive-store/list-new-product/filters';
  private getListNewProducts: string = environment.apiBase + '/processes/receive-store/list-new-product/all';
  private getListNewProductsFileExcel: string = environment.apiBase + '/inventory/export-to-excel/list-new-product';
  private postReceptionFinalUrl:string = environment.apiBase+"/final-reception";
  private deleteReceprionUrl:string = environment.apiBase+"/final-reception/delete/";
  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider,
    private auth: AuthenticationService,

  ) { }

  getIndex(body){
    return this.http.post<ReceptionFinalModel.receptionFinal>(this.getIndexUrl,body).pipe(map(response=>{
      return response.data;
    }));
  }

  getWarehouse(){
    return this.http.get(this.getWarehouseUrl).pipe(map(response=>{
      return response;
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

  postReceptionFinal(form: any):Observable<any>{
    return this.http.post(this.postReceptionFinalUrl, form).pipe(map((response:any)=>{
      return response.data;
    }));
  }

  destroyReceptionFinal(id: number):Observable<any>{
    return this.http.delete(this.deleteReceprionUrl+id).pipe(map((response:any)=>{
      return response;
    }));
  }

  updateRecepFinal(body,id: number):Observable<any>{
    return this.http.put(this.updateRecepFinalUrl+id,body).pipe(map((response:any)=>{
      return response.data;
    }));
  }

  getByIdWarehouse(id:number):Observable<any>{
    return this.http.get(this.getByIdWarehouseUrl+id).pipe(map((response:any)=>{
      return response.data;
    }));
  }

}
