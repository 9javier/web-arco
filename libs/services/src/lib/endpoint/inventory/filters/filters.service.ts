import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
/**acá está la ruta base del api, es bueno manejarla así ya que este archivo se sobreescribe cuando se compila como prod y tendríamos la url de producción sin tener que cambiar nada */
import { environment } from '../../../../environments/environment';
import {from, Observable} from 'rxjs';
/**Hay que importar las rutas de esta manera para que no hayan dependencias circulares*/
import { FiltersModel } from '../../../../models/endpoints/filters';
import {map, switchMap} from 'rxjs/operators';
import {AuthenticationService} from "@suite/services";

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  /**las rutas deben ser privadas, solo se usan acá */
  private getColorsUrl = environment.apiBase+"/inventory/colors";
  private getWarehousesUrl = environment.apiBase+"/inventory/warehouses";
  private getContainersUrl = environment.apiBase+"/inventory/containers";
  private getModelsUrl = environment.apiBase+"/inventory/models";
  private getSizesUrl = environment.apiBase+"/inventory/sizes";
  
  constructor(
    private http:HttpClient,
    private auth: AuthenticationService
  ) { }

  /**
   * get colors to using in filters
   * @return observable with array of colors
   */
  getColors():Observable<Array<FiltersModel.Color>>{
    /**
     * el pipe no es necesario, lo hago para devolver solo los colores y descartar lo demás en la respuesta, sería bueno usarlo así como standar
     * porque igual no estamos usando los messages que vienen en la respuesta ni los códigos de success 
    */
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<FiltersModel.ResponseColor>(this.getColorsUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  /**
   * get warehouses to using in filters
   * @return observable with array of warehouses
   */
  getWarehouses():Observable<Array<FiltersModel.Warehouse>>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<FiltersModel.ResponseWarehouse>(this.getWarehousesUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  /**
   * get warehouses to using in filters
   * @return observable with array of containers
   */
  getContainers():Observable<Array<FiltersModel.Container>>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<FiltersModel.ResponseContainer>(this.getContainersUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  /**
   * get models to using in filters
   * @return observable with array of models
   */
  getModels():Observable<Array<FiltersModel.Model>>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<FiltersModel.ResponseModel>(this.getModelsUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  /**
   * get sizes to be useds in filters
   */
  getSizes():Observable<Array<FiltersModel.Size>>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<FiltersModel.ResponseSize>(this.getSizesUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }


}
