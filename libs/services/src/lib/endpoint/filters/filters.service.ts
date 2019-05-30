import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpClient } from '@angular/common/http';
/**acá está la ruta base */
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
/**Hay que importar las rutas de esta manera para que no hayan dependencias circulares*/
import { FiltersModel } from '../../../models/endpoints/filters';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  /**las rutas deben ser privadas, solo se usan acá */
  private getColorsUrl = environment.apiBase+"/inventory/sizes";
  constructor(private http:HttpClient) { }

  /**
   * get colors to using in filters
   * @return observable with array of colors
   */
  getColors():Observable<Array<FiltersModel.Color>>{
    /**el pipe no es necesario, lo hago para devolver solo los colores y descartar la respuesta */
    return this.http.get<FiltersModel.ResponseColor>(this.getColorsUrl).pipe(map(response=>{
      return response.data;
    }))
  }
}
