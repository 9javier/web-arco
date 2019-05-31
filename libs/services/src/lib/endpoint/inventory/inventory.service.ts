import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";
import {Observable} from "rxjs";
import {InventoryModel} from "../../../models/endpoints/Inventory";

import { environment } from '../../../environments/environment'; 
import { map } from 'rxjs/operators';

const PATH_POST_STORE: string = PATH('Inventory Process', 'Store');
const PATH_GET_PRODUCTS_CONTAINER: string = PATH('Inventory', 'List by Container').slice(0, -1);
const PATH_GET_PRODUCTS_HISTORY_CONTAINER: string = PATH('Inventory Process', 'List by container').slice(0, -1);

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private searchInContainerUrl = environment.apiBase+"/inventory/search";

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  searchInContainer(parameters):Observable<InventoryModel.ResponseSearchInContainer>{
    return this.http.post<InventoryModel.ResponseSearchInContainer>(this.searchInContainerUrl,parameters);
  }

  async postStore(
    inventoryProcess: InventoryModel.Inventory
  ): Promise<Observable<HttpResponse<InventoryModel.ResponseStore>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<InventoryModel.ResponseStore>(PATH_POST_STORE, inventoryProcess, {
      headers: headers,
      observe: 'response'
    });
  }

  async productsByContainer(
    containerId: number
  ): Promise<Observable<HttpResponse<InventoryModel.ResponseProductsContainer>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<InventoryModel.ResponseProductsContainer>(`${PATH_GET_PRODUCTS_CONTAINER}${containerId}`, {
      headers: headers,
      observe: 'response'
    });
  }

  async productsHistoryByContainer(
    containerId: number
  ): Promise<Observable<HttpResponse<InventoryModel.ResponseProductsContainer>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<InventoryModel.ResponseProductsContainer>(`${PATH_GET_PRODUCTS_HISTORY_CONTAINER}${containerId}`, {
      headers: headers,
      observe: 'response'
    });
  }
}
