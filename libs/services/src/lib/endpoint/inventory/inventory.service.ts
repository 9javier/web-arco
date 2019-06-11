import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";
import {from, Observable} from "rxjs";
import {InventoryModel} from "../../../models/endpoints/Inventory";
import {environment} from '../../../environments/environment';
import {map, switchMap} from 'rxjs/operators';

const PATH_POST_STORE: string = PATH('Inventory Process', 'Store');
const PATH_GET_PRODUCTS_CONTAINER: string = PATH('Inventory', 'List by Container').slice(0, -1);
const PATH_GET_PRODUCTS_HISTORY_CONTAINER: string = PATH('Inventory Process', 'List by container').slice(0, -1);

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  /**Urls for the inventory service */
  private postStoreUrl:string = environment.apiBase+"/inventory/process";
  private getProductsByContainerUrl:string = environment.apiBase+"/inventory/container/{{id}}";
  private getProductsHistoryByContainerUrl:string = environment.apiBase+"/inventory/process/container/{{id}}";


  private postGlobalUrl:string = environment.apiBase+"/inventory/process/global";
  private postPickingUrl:string = environment.apiBase+"/inventory/process/piking";

  private searchInContainerUrl = environment.apiBase+"/inventory/search";

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

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

  async postStore(
    inventoryProcess: InventoryModel.Inventory
  ): Promise<Observable<HttpResponse<InventoryModel.ResponseStore>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<InventoryModel.ResponseStore>(this.postStoreUrl, inventoryProcess, {
      headers: headers,
      observe: 'response'
    });
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

  postPicking(picking: InventoryModel.Picking) : Observable<InventoryModel.ResponsePicking> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<InventoryModel.ResponsePicking>(this.postPickingUrl, picking, { headers });
    }));
  }
}
