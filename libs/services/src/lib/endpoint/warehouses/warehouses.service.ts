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
import { GroupWarehousePickingModel } from '../../../models/endpoints/group-warehouse-model';
import { AgencyModel } from '../../../models/endpoints/agency.model';

const PATH_BASE: string = URL + '/api/';
@Injectable({
  providedIn: 'root'
})
export class WarehousesService {

  private apiBase = environment.apiBase;
  private postStoreUrl = this.apiBase+"/warehouses";
  private getShowUrl = this.apiBase+"/warehouses/{id}";
  private getMainUrl = this.apiBase+"/warehouses/main";
  private updateUrl = this.getShowUrl;
  private toGroupWarehousePickingUrl = this.apiBase+"/warehouses/{{id}}/group/{{groupId}}";
  private removeGroupWarehousePickingUrl = this.toGroupWarehousePickingUrl;
  private toAgencyUrl = this.apiBase+"/warehouses/{{id}}/agency/{{agencyId}}";
  private removeOfAgencyUrl = this.toAgencyUrl;
  private postAssignGroupToCategoryUrl:string = this.apiBase+"/warehouses/{{warehouseId}}/groups/{{groupId}}";
  private deleteGroupToWarehouseUrl:string = this.postAssignGroupToCategoryUrl;
  private enumPackingUrl:string = environment.apiBase+"/types/packing";
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(): Promise<Observable<HttpResponse<WarehouseModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<WarehouseModel.ResponseIndex>(PATH_BASE + 'warehouses', {
      headers: headers,
      observe: 'response'
    });
  }

    /**
   * Get enum of packing
   */
  getTypePacking(){
    return this.http.get(this.enumPackingUrl).pipe(map((response:any)=>{
      return response.data;
    }))
  }

  async postAssignGroupToCategory(
    warehousesId: number,
    groupId: number
  ): Promise<Observable<HttpResponse<WarehouseModel.ResponseUpdate>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<WarehouseModel.ResponseUpdate>(
      this.deleteGroupToWarehouseUrl.replace("{{warehouseId}}",String(warehousesId)).replace("{{groupId}}",String(groupId)),
      {},
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

  /**
   * Get the main warehouse
   */
  getMain():Observable<WarehouseModel.Warehouse>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<WarehouseModel.ResponseShow>(this.getMainUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
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
      this.deleteGroupToWarehouseUrl.replace("{{warehouseId}}",String(warehousesId)).replace("{{groupId}}",String(groupId)),
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

    /**
   * Add Warehouse to GroupWarehousePicking
   */

  async toGroupWarehousePicking(
    warehousesId: number,
    groupId: number
   ): Promise<Observable<HttpResponse<GroupWarehousePickingModel.GroupWarehousePicking>>>  {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<GroupWarehousePickingModel.GroupWarehousePicking>(
      this.toGroupWarehousePickingUrl.replace("{{id}}",String(warehousesId)).replace("{{groupId}}",String(groupId)),
      {},
      {
        headers: headers,
        observe: 'response'
      }
    )
   }

   /**
   * Remove Warehouse to GroupWarehousePicking
   */

  async removeOfGroupWarehousePicking(
    warehousesId: number,
    groupId: number
   ): Promise<Observable<HttpResponse<WarehouseModel.ResponseDelete>>>  {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.delete<WarehouseModel.ResponseDelete>(
      this.removeGroupWarehousePickingUrl.replace("{{id}}",String(warehousesId)).replace("{{groupId}}",String(groupId)),
      {
        headers: headers,
        observe: 'response'
      }
    )
   }

   /**
   * Add Warehouse to Agency
   */

  async toAgency(
    warehouseId: number,
    agencyId: number
   ): Promise<Observable<HttpResponse<AgencyModel.Agency>>>  {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<AgencyModel.Agency>(
      this.toAgencyUrl.replace("{{id}}",String(warehouseId)).replace("{{agencyId}}",String(agencyId)),
      {},
      {
        headers: headers,
        observe: 'response'
      }
    )
   }

   /**
   * Remove Warehouse to Agency
   */

  async removeOfAgency(
    warehousesId: number,
    agencyId: number
   ): Promise<Observable<HttpResponse<WarehouseModel.ResponseDelete>>>  {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.delete<WarehouseModel.ResponseDelete>(
      this.removeOfAgencyUrl.replace("{{id}}",String(warehousesId)).replace("{{agencyId}}",String(agencyId)),
      {
        headers: headers,
        observe: 'response'
      }
    )
   }

}
