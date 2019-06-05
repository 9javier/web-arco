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

export const PATH_GET_INDEX: string = PATH('Warehouses Maps', 'Listar estantes de un almacén');
export const PATH_POST_STORE: string = PATH('Warehouses Maps', 'Crear estante');
export const PATH_GET_SHOW: string = PATH('Warehouses Maps', 'Listar ubicaciones de un estante');
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
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async getIndex(
    warehouseId: string | number
  ): Promise<Observable<HttpResponse<HallModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<HallModel.ResponseIndex>(PATH_GET_INDEX.replace('{{warehouseId}}', String(warehouseId)), {
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
    return this.http.post<HallModel.ResponseStore>(PATH_POST_STORE, warehouseMap, {
      headers: headers,
      observe: 'response'
    });
  }

  async getShow(
    hallId: string | number
  ): Promise<Observable<HttpResponse<HallModel.ResponseShow>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<HallModel.ResponseShow>(PATH_GET_SHOW.replace('{{rackId}}', String(hallId)), {
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
      `${PATH_PUT_UPDATE}${hall.id}`,
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
          `${PATH_DEL_DESTROY}${user.id}`,
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
    return this.http.put<HallModel.ResponseUpdateDisable>(`${PATH_PUT_DISABLE}${containerId}`,
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
    return this.http.put<HallModel.ResponseUpdateEnable>(`${PATH_PUT_ENABLE}${containerId}`,
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
    return this.http.put<HallModel.ResponseUpdateLock>(`${PATH_PUT_LOCK}${containerId}`,
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
    return this.http.put<HallModel.ResponseUpdateUnlock>(`${PATH_PUT_UNLOCK}${containerId}`,
      {lock: false},
      {
        headers: headers,
        observe: 'response'
      }
      );
  }
}
