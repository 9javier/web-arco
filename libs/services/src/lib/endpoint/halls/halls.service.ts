import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

import { HallModel } from '../../../models/endpoints/Hall';
import { PATH } from '../../../../../../config/base';
import { forkJoin, concat } from 'rxjs';
import { environment } from '../../../environments/environment';

export const PATH_GET_INDEX: string = PATH('Warehouses Maps', 'Listar estantes de un almacén');
export const PATH_POST_STORE: string = PATH('Warehouses Maps', 'Crear estante');
export const PATH_GET_SHOW: string = PATH('Warehouses Maps', 'Listar ubicaciones de un estante');
export const PATH_GET_FULL_INDEX: string = PATH('Warehouses Maps', 'Listar estantes y ubicaciones de un almacén');
export const PATH_PUT_UPDATE: string = PATH('Warehouses Maps', 'Redimensionar un estante').replace('{{rackId}}', '');
export const PATH_DEL_DESTROY: string = PATH('Warehouses Maps', 'Eliminar un estante').replace('{{rackId}}', '');
export const PATH_PUT_ENABLE: string = PATH('Warehouses Maps', 'Habilitar ubicación').replace('{{containerId}}', '');
export const PATH_PUT_DISABLE: string = PATH('Warehouses Maps', 'Deshabilitar ubicación').replace('{{containerId}}', '');
export const PATH_PUT_LOCK: string = PATH('Warehouses Maps', 'Bloquear ubicación').replace('{{containerId}}', '');
export const PATH_PUT_UNLOCK: string = PATH('Warehouses Maps', 'Desbloquear ubicación').replace('{{containerId}}', '');

@Injectable({
  providedIn: 'root'
})
export class HallsService {

  /**urls for halls service */
  private getIndexUrl:string = environment.apiBase+"/warehouses/{{id}}/racks";
  private getFullIndexUrl:string = environment.apiBase+"/warehouses/{{id}}/racks/full";
  private postStoreUrl:string = environment.apiBase+"/racks/";
  private getShowUrl:string = environment.apiBase+"/racks/{{id}}/containers";
  private putUpdateUrl:string = environment.apiBase+"/racks/{{id}}";
  private deleteDestroyUrl:string = environment.apiBase+"/racks/{{id}}";
  private updateDisableUrl:string = environment.apiBase+"/containers/{{id}}";
  private updateEnableUrl:string = environment.apiBase+"/containers/{{id}}";
  private updateLockUrl:string = environment.apiBase+"/containers/{{id}}";
  private updateUnlockUrl:string = environment.apiBase+"/containers/{{id}}";

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(
    warehouseId: string | number
  ): Promise<Observable<HttpResponse<HallModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<HallModel.ResponseIndex>(this.getIndexUrl.replace('{{id}}', String(warehouseId)), {
      headers: headers,
      observe: 'response'
    });
  }

  async getFullIndex(
    warehouseId: string | number
  ): Promise<Observable<HttpResponse<HallModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<HallModel.ResponseIndex>(this.getFullIndexUrl.replace('{{id}}', String(warehouseId)), {
      headers: headers,
      observe: 'response'
    });
  }

  async postStore(
    warehouseMapForm
  ): Promise<Observable<HttpResponse<HallModel.ResponseStore>>> {
    const warehouseMap: HallModel.Hall = HallModel.formToMap(warehouseMapForm);
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<HallModel.ResponseStore>(this.postStoreUrl, warehouseMap, {
      headers: headers,
      observe: 'response'
    });
  }

  async getShow(
    hallId: string | number
  ): Promise<Observable<HttpResponse<HallModel.ResponseShow>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<HallModel.ResponseShow>(this.getShowUrl.replace('{{id}}', String(hallId)), {
      headers: headers,
      observe: 'response'
    });
  }

  async putUpdate(
    hall: HallModel.Hall
  ): Promise<Observable<HttpResponse<HallModel.ResponseUpdate>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.put<HallModel.ResponseUpdate>(
      this.putUpdateUrl.replace("{{id}}",String(hall.id)),
      hall,
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

  async deleteDestroy(
    users: HallModel.Hall[]
  ): Promise<Observable<HttpResponse<HallModel.ResponseDestroy>>[]> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return users.map(user => {
      return concat(
        this.http.delete<HallModel.ResponseDestroy>(
          this.deleteDestroyUrl.replace("{{id}}",String(user.id)),
          {
            headers: headers,
            observe: 'response'
          }
        )
      );
    });
  }

  async updateDisable(
    containerId: string | number
  ): Promise<Observable<HttpResponse<HallModel.ResponseUpdateDisable>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.put<HallModel.ResponseUpdateDisable>(
      this.updateDisableUrl.replace("{{id}}",String(containerId)),
      {enabled: false},
      {
        headers: headers,
        observe: 'response'
      }
      );
  }

  async updateEnable(
    containerId: string | number
  ): Promise<Observable<HttpResponse<HallModel.ResponseUpdateEnable>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.put<HallModel.ResponseUpdateEnable>(
      this.updateEnableUrl.replace("{{id}}",String(containerId)),
      {enabled: true},
      {
        headers: headers,
        observe: 'response'
      }
      );
  }

  async updateLock(
    containerId: string | number
  ): Promise<Observable<HttpResponse<HallModel.ResponseUpdateLock>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.put<HallModel.ResponseUpdateLock>(
      this.updateLockUrl.replace("{{id}}",String(containerId)),
      {lock: true},
      {
        headers: headers,
        observe: 'response'
      }
      );
  }

  async updateUnlock(
    containerId: string | number
  ): Promise<Observable<HttpResponse<HallModel.ResponseUpdateUnlock>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.put<HallModel.ResponseUpdateUnlock>(
      this.updateLockUrl.replace("{{id}}",String(containerId)),
      {lock: false},
      {
        headers: headers,
        observe: 'response'
      }
      );
  }
}
