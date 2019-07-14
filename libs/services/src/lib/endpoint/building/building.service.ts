import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { BuildingModel } from "@suite/services";
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  /**Urls for the building service */
  private getIndexUrl:string = environment.apiBase+'/buildings';
  private postStoreUrl:string = environment.apiBase+'/buildings';
  private getShowUrl:string = environment.apiBase+'/buildings/{{id}}';
  private putUpdateUrl:string = environment.apiBase+'/buildings/{{id}}';
  private delDeleteUrl:string = environment.apiBase+'/buildings/{{id}}';

  constructor(private http:HttpClient){}

  /**
   * Obtain all buildings registereds
   * @returns Observable width the list of buildings registereds
   */
  getIndex():Observable<BuildingModel.Building[]>{
    return this.http.get<BuildingModel.ListResponse>(this.getIndexUrl).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Save new building in the server
   * @param building - the object to be saved
   * @returns the created building
   */
  store(building:BuildingModel.SingleRequest):Observable<BuildingModel.Building>{
    return this.http.post<BuildingModel.SingleResponse>(this.postStoreUrl,building).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Modify existing building in server
   * @param id - the id of building to be updated
   * @param building - new building object
   * @returns the updated building
   */
  update(id:number,building:BuildingModel.SingleRequest):Observable<BuildingModel.Building>{
    return this.http.put<BuildingModel.SingleResponse>(this.putUpdateUrl.replace("{{id}}",String(id)),building).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Delete existing building in server
   * @param id - the id of building to be deleted
   */
  delete(id:number):Observable<string>{
    return this.http.delete<BuildingModel.SingleResponse>(this.delDeleteUrl.replace("{{id}}",String(id))).pipe(map(response=>{
      return response.message;
    }));
  }


}