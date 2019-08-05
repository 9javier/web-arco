import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { GroupWarehousePickingModel } from '../../../models/endpoints/group-warehouse-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupWarehousePickingService {

  /**Urls for group warehouse picking service */
  private groupWarehousePickingUrl:string = environment.apiBase+"/groups-warehouse-picking/";
  private singleGroupWarehousePickingUrl:string = environment.apiBase+"/groups-warehouse-picking/{{id}}";

  displayedColumns: string[] = ['name'];

  constructor(private http:HttpClient) { }

  /**
   * Get all group warehouse picking
   * @returns all group warehouses
   */
  getIndex():Observable<Array<GroupWarehousePickingModel.GroupWarehousePicking>>{
    return this.http.get<GroupWarehousePickingModel.ResponseGroupWarehousePicking>(this.groupWarehousePickingUrl).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Get an group warehouse picking by id
   * @param id - the id of group warehouse picking
   * @returns the warehose requested
   */
  getShow(id:number):Observable<GroupWarehousePickingModel.GroupWarehousePicking>{
    return this.http.get<GroupWarehousePickingModel.ResponseSingleGroupWarehousePicking>(this.singleGroupWarehousePickingUrl.replace("{{id}}",String(id))).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Save a new group into server
   * @param groupWarehousePicking the group to be saved 
   */
  store(groupWarehousePicking:GroupWarehousePickingModel.RequestGroupWarehousePicking):Observable<GroupWarehousePickingModel.GroupWarehousePicking>{
    return this.http.post<GroupWarehousePickingModel.ResponseSingleGroupWarehousePicking>(this.groupWarehousePickingUrl,groupWarehousePicking).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Update a new group into server
   * @param id - the id of the group to  be updated
   * @param groupWarehousePicking the new group
   */
  update(id:number,groupWarehousePicking:GroupWarehousePickingModel.RequestGroupWarehousePicking):Observable<GroupWarehousePickingModel.GroupWarehousePicking>{
    return this.http.put<GroupWarehousePickingModel.ResponseSingleGroupWarehousePicking>(this.singleGroupWarehousePickingUrl
      .replace("{{id}}",String(id)),groupWarehousePicking).pipe(map(response=>{
      return response.data;
    }));
  }

   /**
   * Delete a new group in server
   * @param id - the id of the group to be deleted
   */
  delete(id:number){
    return this.http.delete(this.singleGroupWarehousePickingUrl.replace("{{id}}",String(id)));
  }

}
