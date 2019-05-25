import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";
import {TypeModel} from "../../../models/endpoints/Type";

export const PATH_GET_INDEX_ACTIONS: string = PATH('Types', 'Actions');
export const PATH_GET_INDEX_ACTIVITIES: string = PATH('Types', 'Activities');
export const PATH_GET_INDEX_EXECUTION: string = PATH('Types', 'Execution');
export const PATH_GET_INDEX_GENERATION: string = PATH('Types', 'Generation');
export const PATH_GET_INDEX_INCIDENCES: string = PATH('Types', 'Incidences');
export const PATH_GET_INDEX_PACKING: string = PATH('Types', 'Packing');
export const PATH_GET_INDEX_PICKING: string = PATH('Types', 'Picking');
export const PATH_GET_INDEX_PREPARATION_LINES: string = PATH('Types', 'Preparation Lines');
export const PATH_GET_INDEX_PRODUCT: string = PATH('Types', 'Product');
export const PATH_GET_INDEX_SELECTION_CRITERIA: string = PATH('Types', 'Selection criteria');
export const PATH_GET_INDEX_PROCESS: string = PATH('Types', 'Process');
export const PATH_GET_INDEX_SHIPPING_ORDER: string = PATH('Types', 'Shipping order');
export const PATH_GET_INDEX_STATUS_PRODUCT: string = PATH('Types', 'Status Product');
export const PATH_GET_INDEX_STORE: string = PATH('Types', 'Store');

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  private types = {
    actions: [],
    activities: [],
    execution: [],
    generation: [],
    incidences: [],
    packing: [],
    picking: [],
    preparationLines: [],
    product: [],
    selectionCriteria: [],
    process: [],
    shippingOrder: [],
    statusProduct: [],
    store: []
  };

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  init = (listTypes: TypeModel.TypeLoad) => {
    if (listTypes.all) {
      this.loadType(PATH_GET_INDEX_ACTIONS, 'actions');
      this.loadType(PATH_GET_INDEX_ACTIVITIES, 'activities');
      this.loadType(PATH_GET_INDEX_EXECUTION, 'execution');
      this.loadType(PATH_GET_INDEX_GENERATION, 'generation');
      this.loadType(PATH_GET_INDEX_INCIDENCES, 'incidences');
      this.loadType(PATH_GET_INDEX_PACKING, 'packing');
      this.loadType(PATH_GET_INDEX_PICKING, 'picking');
      this.loadType(PATH_GET_INDEX_PREPARATION_LINES, 'preparationLines');
      this.loadType(PATH_GET_INDEX_PRODUCT, 'product');
      this.loadType(PATH_GET_INDEX_SELECTION_CRITERIA, 'selectionCriteria');
      this.loadType(PATH_GET_INDEX_PROCESS, 'process');
      this.loadType(PATH_GET_INDEX_SHIPPING_ORDER, 'shippingOrder');
      this.loadType(PATH_GET_INDEX_STATUS_PRODUCT, 'statusProduct');
      this.loadType(PATH_GET_INDEX_STORE, 'store');
    } else {
      if (listTypes.actions) this.loadType(PATH_GET_INDEX_ACTIONS, 'actions');
      if (listTypes.activities) this.loadType(PATH_GET_INDEX_ACTIVITIES, 'activities');
      if (listTypes.execution) this.loadType(PATH_GET_INDEX_EXECUTION, 'execution');
      if (listTypes.generation) this.loadType(PATH_GET_INDEX_GENERATION, 'generation');
      if (listTypes.incidences) this.loadType(PATH_GET_INDEX_INCIDENCES, 'incidences');
      if (listTypes.packing) this.loadType(PATH_GET_INDEX_PACKING, 'packing');
      if (listTypes.picking) this.loadType(PATH_GET_INDEX_PICKING, 'picking');
      if (listTypes.preparation_lines) this.loadType(PATH_GET_INDEX_PREPARATION_LINES, 'preparationLines');
      if (listTypes.product) this.loadType(PATH_GET_INDEX_PRODUCT, 'product');
      if (listTypes.selection_criteria) this.loadType(PATH_GET_INDEX_SELECTION_CRITERIA, 'selectionCriteria');
      if (listTypes.process) this.loadType(PATH_GET_INDEX_PROCESS, 'process');
      if (listTypes.shipping_order) this.loadType(PATH_GET_INDEX_SHIPPING_ORDER, 'shippingOrder');
      if (listTypes.status_product) this.loadType(PATH_GET_INDEX_STATUS_PRODUCT, 'statusProduct');
      if (listTypes.store) this.loadType(PATH_GET_INDEX_STORE, 'store');
    }
  };

  private loadType(path: string, type: string) {
    this.getIndex(path)
      .then((data: Observable<HttpResponse<TypeModel.ResponseIndex>>) => {
        data.subscribe((res: HttpResponse<TypeModel.ResponseIndex>) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.types[type] = res.body.data;
          } else {
            console.debug('Test::Error Response -> ', res);
          }
        }, (error: HttpErrorResponse) => {
          console.debug('Test::Error Subscribe -> ', error);
        });
      }, (error: HttpErrorResponse) => {
        console.debug('Test::Error -> ', error);
      });
  }

  async getIndex(path: string): Promise<Observable<HttpResponse<TypeModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.get<TypeModel.ResponseIndex>(path,
      {
        headers: headers,
        observe: 'response'
      });
  }

  get listActions(): TypeModel.Type[] {
    return this.types.actions ;
  }
  set listActions(value: TypeModel.Type[]) {
    this.types.actions = value;
  }

  get listActivities(): TypeModel.Type[] {
    return this.types.activities ;
  }
  set listActivities(value: TypeModel.Type[]) {
    this.types.activities = value;
  }

  get listExecution(): TypeModel.Type[] {
    return this.types.execution ;
  }
  set listExecution(value: TypeModel.Type[]) {
    this.types.execution = value;
  }

  get listGeneration(): TypeModel.Type[] {
    return this.types.generation ;
  }
  set listGeneration(value: TypeModel.Type[]) {
    this.types.generation = value;
  }

  get listIncidences(): TypeModel.Type[] {
    return this.types.incidences ;
  }
  set listIncidences(value: TypeModel.Type[]) {
    this.types.incidences = value;
  }

  get listPacking(): TypeModel.Type[] {
    return this.types.packing;
  }
  set listPacking(value: TypeModel.Type[]) {
    this.types.packing = value;
  }

  get listPicking(): TypeModel.Type[] {
    return this.types.picking ;
  }
  set listPicking(value: TypeModel.Type[]) {
    this.types.picking = value;
  }

  get listPreparationLines(): TypeModel.Type[] {
    return this.types.preparationLines ;
  }
  set listPreparationLines(value: TypeModel.Type[]) {
    this.types.preparationLines = value;
  }

  get listProduct(): TypeModel.Type[] {
    return this.types.product ;
  }
  set listProduct(value: TypeModel.Type[]) {
    this.types.product = value;
  }

  get listSelectionCriteria(): TypeModel.Type[] {
    return this.types.selectionCriteria;
  }
  set listSelectionCriteria(value: TypeModel.Type[]) {
    this.types.selectionCriteria = value;
  }

  get listProcess(): TypeModel.Type[] {
    return this.types.process ;
  }
  set listProcess(value: TypeModel.Type[]) {
    this.types.process = value;
  }

  get listShippingOrder(): TypeModel.Type[] {
    return this.types.shippingOrder;
  }
  set listShippingOrder(value: TypeModel.Type[]) {
    this.types.shippingOrder = value;
  }

  get listStatusProduct(): TypeModel.Type[] {
    return this.types.statusProduct ;
  }
  set listStatusProduct(value: TypeModel.Type[]) {
    this.types.statusProduct = value;
  }

  get listStore(): TypeModel.Type[] {
    return this.types.store ;
  }
  set listStore(value: TypeModel.Type[]) {
    this.types.store = value;
  }

}