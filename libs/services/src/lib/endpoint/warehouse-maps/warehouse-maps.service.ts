import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { WarehouseMapsModel } from '../../../models/endpoints/warehouse-maps';
import { switchMap,map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseMapsService {

  private getWarehousesRacksUrl = environment.apiBase+"/warehouses/{{id}}/racks";
  private configureLocationUrl = environment.apiBase+"/warehouses/{{id}}/containers";
  constructor(private auth:AuthenticationService,private http:HttpClient) { }

  /**
   * Get the racks of warehouse from an id given
   * @param id the warehouse id
   */
  getWarehousesRacks(id:number):Observable<Array<WarehouseMapsModel.Rack>>{
    return from(this.auth.getCurrentToken()).pipe(switchMap((token)=>{
      let headers = new HttpHeaders({Authorization:token});
      return this.http.get<WarehouseMapsModel.ResponseRacksIndex>(this.getWarehousesRacksUrl.replace("{{id}}",id.toString()),{headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  /**
   * Configure a location of warehouse
   * @param id - the id of warehouse
   * @param configuration - the new configuration for the Location
   */
  configureLocation(id,configuration:WarehouseMapsModel.ConfigurationParam):Observable<WarehouseMapsModel.WarehouseConfigured>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers = new HttpHeaders({Authorization:token});
      return this.http.put<WarehouseMapsModel.ResponseConfigLocations>(this.configureLocationUrl.replace("{{id}}",id.toString()),configuration,{headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  /**
   * Get locations of warehouse
   * @param id - the id of warehouse
   */
  getLocations(id):Observable<WarehouseMapsModel.LocationWarehouse[]> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers = new HttpHeaders({Authorization:token});
      return this.http.get<WarehouseMapsModel.ResponseGetLocationsWarehouse>(this.configureLocationUrl.replace("{{id}}",id.toString()),{headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

}
