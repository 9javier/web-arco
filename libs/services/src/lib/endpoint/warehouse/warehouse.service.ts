import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";

const PATH_GET_WAREHOUSE_MAIN: string = PATH('Permissions', 'Show');

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private _idWarehouseMain: number = 1;

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  async init() {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({Authorization: currentToken});
    this.http.get(PATH_GET_WAREHOUSE_MAIN, {
      headers: headers,
      observe: 'response'
    }).subscribe((res: HttpResponse<any>) => {
      console.debug('Test::Response -> ', res);
      this.idWarehouseMain = res.body.data.id;
      this.idWarehouseMain = 1;
    });
  }

  get idWarehouseMain(): number {
    return this._idWarehouseMain;
  }

  set idWarehouseMain(value: number) {
    this._idWarehouseMain = value;
  }
}
