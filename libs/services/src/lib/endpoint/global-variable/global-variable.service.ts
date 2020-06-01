
import { Injectable } from '@angular/core';
import { CrudService } from '../crud-service/crud-service.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GlobalVariableModel } from 'libs/services/src/models/endpoints/global-variable.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * @class
 * @description ejemplo para el uso de la clase CrudService que permite crear un servicio de crud en unas pocas líneas
 * Los servicios deben extender de la clase crud service, y opcionalmente se le pueden pasar type parameters para definir los tipos de retorno de los metodos
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalVariableService extends CrudService<
  /**este tipo sería la abstracción a la que hace referencia el servicio, es decir, global variable en este caso, agency en el caso de las agencias, etc */
  GlobalVariableModel.GlobalVariable,
  /**este sería el tipo que se envía en las solicitudes de tipo store y update, por lo general son el mismo que el anterior sin el id, pero preferí diferenciarlos */
  GlobalVariableModel.Request
  /**Hay dos tipos más, pero no hay necesidad de pasarlos, ya que son de uso interno de la clase crudservice */
>{

  /**
   * acá se definen las rutas de los endpoint, para krack por lo general son solo estas dos rutas para todos los endpoints, una para los endpoints generales
   * y otra para los específicos, que vienen dictado por los ids, se requiere este formato si se desea extender de crudservice, a demás de esto, deben ser creadas
   * como protected
   */
  protected requestUrl:string = environment.apiBase+"/global-variables";
  protected singleRequestUrl:string = environment.apiBase+"/global-variables/{{id}}";

  /**esta ruta ya no pertenece a un crud básico, pues involucra obtener un tipo, en un futuro se podría añadir a la superclase, es cuestiond evaluar su frecuencia de uso */
  private requestTypeUrl:string = environment.apiBase+"/types/global-variables";

  /**acá el objeto http debe ser creado como protected en lugar de como privado, y debe inyectarse en el constructor del padre */
  constructor(protected http:HttpClient) {
    super(http);
  }

  /**acá un ejemplo de como se le pueden añadir métodos adicionales a un crud normal */
  getTypes():Observable<{id:number,name:string,workwave:boolean,type:string, tooltip:string}[]>{
      return this.http.get<any>(this.requestTypeUrl).pipe(map(response=>{
        return (<any>response).data;
      }))
  }
}
