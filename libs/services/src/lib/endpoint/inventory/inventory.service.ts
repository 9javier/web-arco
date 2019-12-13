import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";
import {from, Observable} from "rxjs";
import {InventoryModel} from "../../../models/endpoints/Inventory";
import {environment} from '../../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import { ExcellModell } from 'libs/services/src/models/endpoints/Excell';
import { response } from 'express';

const PATH_POST_STORE: string = PATH('Inventory Process', 'Store');
const PATH_GET_PRODUCTS_CONTAINER: string = PATH('Inventory', 'List by Container').slice(0, -1);
const PATH_GET_PRODUCTS_HISTORY_CONTAINER: string = PATH('Inventory Process', 'List by container').slice(0, -1);

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  /**Urls for the inventory service */
  private postStoreUrl:string = environment.apiBase+"/processes/positioner-main";
  private getProductsByContainerUrl:string = environment.apiBase+"/inventory/container/{{id}}";
  private getProductsHistoryByContainerUrl:string = environment.apiBase+"/inventory/processes/container/{{id}}";


  private postGlobalUrl:string = environment.apiBase+"/processes/positioner-main/global";
  private postPickingDirectUrl:string = environment.apiBase+"/processes/picking-main/direct";
  private postPickingConsolidatedUrl: string = environment.apiBase + '/processes/picking-main/consolidated';
  private postPickingOnlineStoreUrl: string = environment.apiBase + '/processes/picking-main/ot';

  private sendexcell = "http://localhost:8081/api/inventory/export-to-excel";
  private searchInContainerUrl = environment.apiBase+"/inventory/search";
  private searchFiltersUrl = environment.apiBase+"/inventory/searchFilters";
  private userPermissionUrl = `${environment.apiBase}/gestion-permissions/users/has-force-permission`;
  private deleteProducts = `${environment.apiBase}/inventory/delete-products`;
  private userPrimsiondeleteProducts = `${environment.apiBase}/gestion-permissions/users/has-delete-product-permission`;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}

  /**
   * Seach products in the inventory filtereds by params
   * @param parameters filters
   */
  searchInContainer(parameters):Observable<InventoryModel.ResponseSearchInContainer>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.post<InventoryModel.ResponseSearchInContainer>(this.searchInContainerUrl,parameters, {headers});
    }));
  }

  /**
   * Seach filters in the inventory
   * @param parameters filters
   */
  searchFilters(parameters):Observable<InventoryModel.ResponseFilters>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      // let headers = new HttpHeaders().set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').set('Authorization', token);
      // return this.http.post<InventoryModel.ResponseFilters>(this.searchFiltersUrl,parameters, {headers});
      return this.http.post<InventoryModel.ResponseFilters>(this.searchFiltersUrl,parameters, {headers});
    }));
  }


  /**
   * @author Gaetano Sabino
   * @param parameters 
   */
  getFileExcell(parameters:ExcellModell.fileExcell){
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      // let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      console.log(parameters);
      
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});

      return this.http.post(this.sendexcell, parameters, {headers,responseType:'blob'});
    }));
  }

  /**
   * @author Gaetano Sabino
   * @param ids 
   */
  delete_Products(ids:number[]){
    let body = {
      ids
    }
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.post(this.deleteProducts,body,{headers})
    }))
  }

  permisis_user(){
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get(this.userPrimsiondeleteProducts);
    }))
  }

  postStore(params: InventoryModel.Inventory) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postStoreUrl, params);
  }

  checkUserPermissions(): Promise<HttpRequestModel.Response>{
    return this.requestsProvider.get(this.userPermissionUrl);
  }


  async productsByContainer(
    containerId: number
  ): Promise<Observable<HttpResponse<InventoryModel.ResponseProductsContainer>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<InventoryModel.ResponseProductsContainer>( this.getProductsByContainerUrl.replace("{{id}}",String(containerId)), {
      headers: headers,
      observe: 'response'
    });
  }

  async productsHistoryByContainer(
    containerId: number
  ): Promise<Observable<HttpResponse<InventoryModel.ResponseProductsContainer>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<InventoryModel.ResponseProductsContainer>(
      this.getProductsHistoryByContainerUrl.replace("{{id}}",String(containerId)), {
      headers: headers,
      observe: 'response'
    });
  }

  postGlobal(containersToMoveProducts) : Observable<InventoryModel.ResponseGlobal> {
    return this.http.post<InventoryModel.ResponseGlobal>(this.postGlobalUrl, containersToMoveProducts);
  }

  postPickingDirect(picking: InventoryModel.Picking) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postPickingDirectUrl, picking);
  }

  postPickingConsolidated(picking: InventoryModel.Picking) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postPickingConsolidatedUrl, picking);
  }

  postPickingOnlineStore(picking: InventoryModel.Picking) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postPickingOnlineStoreUrl, picking);
  }
}
