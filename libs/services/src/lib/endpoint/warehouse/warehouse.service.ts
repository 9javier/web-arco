import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";
import {Observable} from "rxjs";
import {HallModel} from "../../../models/endpoints/Hall";
import {HallsService} from "../halls/halls.service";

const PATH_GET_WAREHOUSE_MAIN: string = PATH('Warehouses', 'Main');
const PATH_GET_WAREHOUSE_INDEX: string = PATH('Warehouses', 'Index');

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private _idWarehouseMain: number = 1;
  private _listWarehouses: any[] = [];
  private _listHalls: any = {};
  private _listRows: any = {};
  private _listColumns: any = {};
  private _listReferences: any = {};

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private hallsService: HallsService
  ) {}

  async init() {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({Authorization: currentToken});
    return this.http.get(PATH_GET_WAREHOUSE_MAIN, {
      headers: headers,
      observe: 'response'
    });
  }

  async getIndex() {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({Authorization: currentToken});
    return this.http.get(PATH_GET_WAREHOUSE_INDEX, {
      headers: headers,
      observe: 'response'
    });
  }

  loadWarehousesData() {
    this.listWarehouses = [];
    this.listHalls = {};
    this.listRows = {};
    this.listColumns = {};
    this.listReferences = {};

    this.getIndex()
      .then((data: Observable<HttpResponse<any>>) => {
        data.subscribe((res: HttpResponse<any>) => {
          res.body.data.forEach(warehouse => {
            this.listWarehouses.push({id: warehouse.id, value: warehouse.name});

            this.hallsService
              .getIndex(warehouse.id)
              .then((dataHall: Observable<HttpResponse<HallModel.ResponseIndex>>) => {
                dataHall.subscribe((resHall: HttpResponse<HallModel.ResponseIndex>) => {
                  resHall.body.data.forEach(hall => {
                    if (typeof this.listHalls[warehouse.id] == 'undefined') {
                      this.listHalls[warehouse.id] = [];
                    }
                    this.listHalls[warehouse.id].push({id: hall.id, value: hall.hall});

                    this.hallsService
                      .getShow(hall.id)
                      .then((dataContainer: Observable<HttpResponse<HallModel.ResponseShow>>) => {
                        dataContainer.subscribe((resContainer: HttpResponse<HallModel.ResponseShow>) => {
                          let lastRow = 0;
                          resContainer.body.data.forEach(container => {
                            if (typeof this.listRows[warehouse.id] == 'undefined') {
                              this.listRows[warehouse.id] = {};
                            }
                            if (typeof this.listColumns[warehouse.id] == 'undefined') {
                              this.listColumns[warehouse.id] = {};
                            }
                            if (typeof this.listReferences[warehouse.id] == 'undefined') {
                              this.listReferences[warehouse.id] = {};
                            }
                            if (typeof this.listColumns[warehouse.id] == 'undefined') {
                              this.listColumns[warehouse.id] = {};
                            }
                            if (typeof this.listRows[warehouse.id][hall.id] == 'undefined') {
                              this.listRows[warehouse.id][hall.id] = [];
                            }
                            if (typeof this.listColumns[warehouse.id][hall.id] == 'undefined') {
                              this.listColumns[warehouse.id][hall.id] = [];
                            }
                            if (typeof this.listReferences[warehouse.id][hall.id] == 'undefined') {
                              this.listReferences[warehouse.id][hall.id] = [];
                            }
                            if (typeof this.listColumns[warehouse.id][hall.id][container.row] == 'undefined') {
                              this.listColumns[warehouse.id][hall.id][container.row] = [];
                            }
                            if (typeof this.listReferences[warehouse.id][hall.id][container.row] == 'undefined') {
                              this.listReferences[warehouse.id][hall.id][container.row] = [];
                            }
                            if (typeof this.listReferences[warehouse.id][hall.id][container.row][container.column] == 'undefined') {
                              this.listReferences[warehouse.id][hall.id][container.row][container.column] = [];
                            }
                            if (container.row != lastRow) {
                              this.listRows[warehouse.id][hall.id].push({id: container.id, row: container.row});
                              lastRow = container.row;
                            }
                            this.listColumns[warehouse.id][hall.id][container.row].push({id: container.id, column: container.column});
                            this.listReferences[warehouse.id][hall.id][container.row][container.column] = container.reference;
                          });
                        });
                      });
                  });
                });
              });
          });
        });
      });
  }

  get idWarehouseMain(): number {
    return this._idWarehouseMain;
  }

  set idWarehouseMain(value: number) {
    this._idWarehouseMain = value;
  }

  get listWarehouses(): any[] {
    return this._listWarehouses;
  }

  set listWarehouses(value: any[]) {
    this._listWarehouses = value;
  }

  get listHalls(): any {
    return this._listHalls;
  }

  set listHalls(value: any) {
    this._listHalls = value;
  }

  get listRows(): any {
    return this._listRows;
  }

  set listRows(value: any) {
    this._listRows = value;
  }

  get listColumns(): any {
    return this._listColumns;
  }

  set listColumns(value: any) {
    this._listColumns = value;
  }

  get listReferences(): any {
    return this._listReferences;
  }

  set listReferences(value: any) {
    this._listReferences = value;
  }
}
