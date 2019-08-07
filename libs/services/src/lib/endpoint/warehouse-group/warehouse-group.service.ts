import { Injectable } from '@angular/core';
import { WarehouseGroupModel } from '../../../models/endpoints/warehouse-group';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap,map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseGroupService {

  /**ésto es lo único reutilizable, por lo tanto lo único que está en un archivo de configuración */
  private apiBase = environment.apiBase;
  /**pero realmente éstas url no son reutilizables, solo son utilizadas en este servicio, por lo tanto no tiene sentido ponerlas en otro lugar sino acá */
  private getIndexUrl = this.apiBase+"/warehouses/groups/categories?include=warehouses";

  constructor(
    private http:HttpClient,
    private auth:AuthenticationService) { }

  /**
   * Get all warehouse groups
   * @return an observable with an array of groups
   */
  getIndex():Observable<Array<WarehouseGroupModel.WarehouseGroup>>{
    /**hay que hacer un interceptor, ya que añadir el token de autenticación es una tarea común en todos los servicios más de una vez */
    return from(this.auth.getCurrentToken()).pipe(
      /**convierto la promesa del token en un observable que luego de resolverse es intercambiado por el observable del endpoint por lo que termina siendo transparente para quien llame el servicio */
      switchMap(token=>{
        let headers = new HttpHeaders({Authorization:token});
        /**si la respuesta es correcta extraigo solo la data */
        return this.http.get<WarehouseGroupModel.ResponseWarehouseGroup>(this.getIndexUrl,{headers}).pipe(map(response=>response.data));
      }));
  }
}
