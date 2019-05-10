import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";
import {Observable} from "rxjs";
import {InventoryModel} from "../../../models/endpoints/Inventory";

const PATH_POST_STORE: string = PATH('Inventory Process', 'Store');
const PATH_GET_PRODUCTS_CONTAINER: string = PATH('Inventory', 'List by Container').slice(0, -1);

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

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
    console.debug('Test::Inventory Process -> ', containerId);
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<InventoryModel.ResponseProductsContainer>(`${PATH_GET_PRODUCTS_CONTAINER}${containerId}`, {
      headers: headers,
      observe: 'response'
    });
  }
}
