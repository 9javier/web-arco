import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import { AuthenticationService } from '../authentication/authentication.service';
import {from, Observable} from "rxjs";

import {HallsService} from "../halls/halls.service";
import {WarehouseModel} from "@suite/services";
import {map, switchMap, filter} from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  /**urls for warehouse service */
  private getShowUrl:string = environment.apiBase+"/warehouses/{{id}}";
  private getIndexUrl:string = environment.apiBase+"/warehouses";
  private getFullIndexUrl:string = environment.apiBase+"/warehouses/full";
  private warehouseMainUrl:string = environment.apiBase+"/warehouses/main";
  private warehouseForTariffUrl:string = environment.apiBase + "/tariffs/warehouse/{{id}}";


  private _idWarehouseMain: number;
  private _listWarehouses: any[] = [];
  private _listHalls: any = {};
  private _listRows: any = {};
  private _listColumns: any = {};
  private _listReferences: any = {};
  private _warehousesWithRacks: WarehouseModel.Warehouse[];

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private hallsService: HallsService
  ) {}

  async init() { 
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({Authorization: currentToken});
        
    return this.http.get(this.warehouseMainUrl, {
      headers: headers,
      observe: 'response'
    });

    
    
  }

  /**
   * Get warehouse by id number
   * @param id - the warehouse id
   */
  getShow(id:number):Observable<WarehouseModel.Warehouse>{
    return from(this.auth.getCurrentToken()).pipe(
     
      switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get(this.getShowUrl.replace("{{id}}",id.toString()), {headers}).pipe(map((response:any)=>response.data));
    }));
  }

  async getIndex() {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({Authorization: currentToken});
    return this.http.get(this.getIndexUrl, {
      headers: headers,
      observe: 'response'
    });
  }

  getAllByTariff(tariffId:number) {
    return this.http.get(
      this.warehouseForTariffUrl.replace("{{id}}", tariffId.toString())
    );
  }
  async getFullIndex() {

    const currentToken = await this.auth.getCurrentToken();
    if(currentToken === null){
      return;
    }
    
    const headers = new HttpHeaders({Authorization: currentToken});
    return this.http.get(this.getFullIndexUrl, {
      headers: headers,
      observe: 'response'
    });
  }

  loadWarehousesWithRacks() {
    this.getIndex()
      .then((data: Observable<HttpResponse<WarehouseModel.ResponseIndex>>) => {
        data.subscribe((res: HttpResponse<WarehouseModel.ResponseIndex>) => {
          this.warehousesWithRacks = res.body.data.filter((warehouse) => {
            return warehouse.is_store;
          });
        },
        e => {
          console.log(e);
        });
      });
  }

  loadWarehousesData() {
    this.listWarehouses = [];
    this.listHalls = {};
    this.listRows = {};
    this.listColumns = {};
    this.listReferences = {};
    try {
      this.getFullIndex()
      .then((data: Observable<HttpResponse<any>>) => {
        if(data === undefined){
          return;
        }
        data.subscribe((res: HttpResponse<any>) => {
          res.body.data.forEach(warehouse => {
            this.listWarehouses.push({id: warehouse.id, value: warehouse.name, has_racks: warehouse.has_racks, reference: warehouse.reference });
            warehouse.racks.forEach(hall => {
              if (typeof this.listHalls[warehouse.id] === 'undefined') {
                this.listHalls[warehouse.id] = [];
              }
              if (hall.containers.length > 0) {
                if (!this.listHalls[warehouse.id].find(searchHall => searchHall.id === hall.id)) {
                  this.listHalls[warehouse.id].push({id: hall.id, value: hall.hall, containers: hall.containers.length > 0});
                }
              }
              let lastRow = 0;
              hall.containers.forEach(container => {
                if (typeof this.listRows[warehouse.id] === 'undefined') {
                  this.listRows[warehouse.id] = {};
                }
                if (typeof this.listColumns[warehouse.id] === 'undefined') {
                  this.listColumns[warehouse.id] = {};
                }
                if (typeof this.listReferences[warehouse.id] === 'undefined') {
                  this.listReferences[warehouse.id] = {};
                }
                if (typeof this.listColumns[warehouse.id] === 'undefined') {
                  this.listColumns[warehouse.id] = {};
                }
                if (typeof this.listRows[warehouse.id][hall.id] === 'undefined') {
                  this.listRows[warehouse.id][hall.id] = [];
                }
                if (typeof this.listColumns[warehouse.id][hall.id] === 'undefined') {
                  this.listColumns[warehouse.id][hall.id] = [];
                }
                if (typeof this.listReferences[warehouse.id][hall.id] === 'undefined') {
                  this.listReferences[warehouse.id][hall.id] = [];
                }
                if (typeof this.listColumns[warehouse.id][hall.id][container.row] === 'undefined') {
                  this.listColumns[warehouse.id][hall.id][container.row] = [];
                }
                if (typeof this.listReferences[warehouse.id][hall.id][container.row] === 'undefined') {
                  this.listReferences[warehouse.id][hall.id][container.row] = [];
                }
                if (typeof this.listReferences[warehouse.id][hall.id][container.row][container.column] === 'undefined') {
                  this.listReferences[warehouse.id][hall.id][container.row][container.column] = [];
                }
                if (container.row !== lastRow) {
                  this.listRows[warehouse.id][hall.id].push({id: container.id, value: container.row, row: container.row});
                  lastRow = container.row;
                }
                this.listColumns[warehouse.id][hall.id][container.row].push({id: container.id, value: container.column, column: container.column});
                this.listReferences[warehouse.id][hall.id][container.row][container.column] = container.reference;
              });
            });
          });
        });
      });
    } catch (error) {
      console.log(error);
      
    }
  
    
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

  get warehousesWithRacks(): WarehouseModel.Warehouse[] {
    return this._warehousesWithRacks;
  }

  set warehousesWithRacks(value: WarehouseModel.Warehouse[]) {
    this._warehousesWithRacks = value;
  }

}
