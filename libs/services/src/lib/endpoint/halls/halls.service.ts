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
    console.debug('Test::WarehouseMap -> ', warehouseMap);
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.post<HallModel.ResponseStore>(PATH_POST_STORE, warehouseMap, {
      headers: headers,
      observe: 'response'
    });
  }

  async getShow(
    userId: string | number
  ): Promise<Observable<HttpResponse<HallModel.ResponseShow>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<HallModel.ResponseShow>(`${PATH_GET_SHOW}${userId}`, {
      headers: headers,
      observe: 'response'
    });
  }

  async putUpdate(
    user: HallModel.Hall
  ): Promise<Observable<HttpResponse<HallModel.ResponseUpdate>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.put<HallModel.ResponseUpdate>(
      `${PATH_PUT_UPDATE}${user.id}`,
      user,
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
}
