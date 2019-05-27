import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { WarehouseModel } from '../../../models/endpoints/Warehouse';
import { PATH, URL } from '../../../../../../config/base';
import {ACLModel} from "@suite/services";
import { from } from 'rxjs';
import { switchMap,map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


const PATH_BASE: string = URL + '/api/';
@Injectable({
  providedIn: 'root'
})
export class WarehousesService {

  private apiBase = environment.apiBase;
  private postStoreUrl = this.apiBase+"/warehouses";
  private getShowUrl = this.apiBase+"/warehouses/{id}"
  private updateUrl = this.getShowUrl;

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
  ): Promise<Observable<HttpResponse<WarehouseModel.ResponseUpdate>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<WarehouseModel.ResponseUpdate>(
      `${PATH_BASE}warehouses/${warehouseId}/groups/${groupId}`,
      {},
      {
        headers: headers,
        observe: 'response'
      }
    );
  }
  
  /**
   * Create new warehouse in server side
   * @param warehouse to be storage
   */
  postStore(warehouse:WarehouseModel.Warehouse):Observable<WarehouseModel.Warehouse>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers = new HttpHeaders({Authorization:token});
      return this.http.post<WarehouseModel.ResponseSingle>(this.postStoreUrl,warehouse,{headers}).pipe(map(response=>{
        return response.data;
      }))
    }));
  }


  put(warehouse:WarehouseModel.Warehouse):Observable<WarehouseModel.Warehouse>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers = new HttpHeaders({Authorization:token});
      return this.http.put<WarehouseModel.ResponseSingle>(this.updateUrl.replace("{id}",warehouse.id.toString()),warehouse,{headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  /**
   * Get a certain warehouse
   * @param id of warehouse to be shown
   * @return observable of the requested warehouse
   */
  getShow(id:number):Observable<WarehouseModel.Warehouse>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers = new HttpHeaders({Authorization:token});
      return this.http.get<WarehouseModel.ResponseSingle>(this.getShowUrl.replace("{id}",id.toString()),{headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  async deleteGroupToWarehouse(
    warehousesId: number,
    groupId: number
  ): Promise<Observable<HttpResponse<WarehouseModel.ResponseDelete>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.delete<WarehouseModel.ResponseDelete>(
      `${PATH_BASE}warehouses/${warehousesId}/groups/${groupId}`,
      {
        headers: headers,
        observe: 'response'
      }
    );
  }
}
