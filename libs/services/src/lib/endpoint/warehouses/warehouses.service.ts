import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { WarehouseModel } from '../../../models/endpoints/Warehouse';
import { PATH, URL } from '../../../../../../config/base';


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
  ): Promise<Observable<HttpResponse<WarehouseModel.Warehouse>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<WarehouseModel.Warehouse>(
      `${PATH_BASE}/warehouses/${warehouseId}/categories/${groupId}`,
      {},
      {
        headers: headers,
        observe: 'response'
      }
    );
  }
}
