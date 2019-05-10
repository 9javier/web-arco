import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { WarehouseModel } from '../../../models/endpoints/Warehouse';
import { PATH, URL } from '../../../../../../config/base';
import {ACLModel} from "@suite/services";


const PATH_BASE: string = URL + '/api/';
@Injectable({
  providedIn: 'root'
})
export class WarehousesService {
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(): Promise<Observable<HttpResponse<WarehouseModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<WarehouseModel.ResponseIndex>(PATH_BASE + 'warehouses', {
      headers: headers,
      observe: 'response'
    });
  }

  async postAssignGroupToCategory(
    warehouseId: number,
    groupId: number
  ): Promise<Observable<any>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<Observable<WarehouseModel.ResponseUpdate>>(
      `${PATH_BASE}warehouses/${warehouseId}/categories/${groupId}`,
      {},
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

  async deleteGroupToWarehouse(
    warehousesId: number,
    groupId: number
  ): Promise<Observable<HttpResponse<WarehouseModel.ResponseDelete>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.delete<WarehouseModel.ResponseDelete>(
      `${PATH_BASE}warehouses/${warehousesId}/categories/${groupId}`,
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

}
