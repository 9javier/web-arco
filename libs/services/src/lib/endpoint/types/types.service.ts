import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';
import {TypeModel} from "../../../models/endpoints/Type";
import { map,switchMap} from 'rxjs/operators';
import { from } from 'rxjs';
import { environment } from '../../../environments/environment';

export const PATH_GET_INDEX_ACTIONS: string = environment.apiBase+"/types/execution";
//export const PATH_GET_INDEX_ACTIVITIES: string = PATH('Types', 'Activities');
export const PATH_GET_INDEX_EXECUTION: string = environment.apiBase+"/types/execution";
export const PATH_GET_INDEX_GENERATION: string = environment.apiBase+"/types/generation";
export const PATH_GET_INDEX_INCIDENCES: string = environment.apiBase+"/types/incidences";
export const PATH_GET_INDEX_PACKING: string = environment.apiBase+"/api/types/packing";
export const PATH_GET_INDEX_PICKING: string = environment.apiBase+"/types/picking";
export const PATH_GET_INDEX_PREPARATION_LINES: string = environment.apiBase+"/types/preparation-lines";
export const PATH_GET_INDEX_PRODUCT: string = environment.apiBase+"/types/product";
export const PATH_GET_INDEX_SELECTION_CRITERIA: string = environment.apiBase+"/types/selection-criteria";
export const PATH_GET_INDEX_PROCESS: string = environment.apiBase+"/types/process";
export const PATH_GET_INDEX_SHIPPING_ORDER: string = environment.apiBase+"/types/shipping-order";
export const PATH_GET_INDEX_STATUS_PRODUCT: string = environment.apiBase+"/types/status-product";
export const PATH_GET_INDEX_STORE: string = environment.apiBase+"/types/process";


@Injectable({
  providedIn: 'root'
})
export class TypesService {

  /** @see `mga-api/src/API/Application/Domain/Enums/TypesOrderProducts.ts#TypesOrderProducts.DATE` */
  public static readonly ID_TYPE_ORDER_PRODUCT_DEFAULT = 5;

  /**Types url */
  private getOrderProductTypesUrl = environment.apiBase+'/types/type-order-product';
  private getTypeActionsUrl = environment.apiBase+'/types/actions';

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

  /**
   * Get types of order products to make an orderby
   * @return types to make an orderby
   */
  getOrderProductTypes():Observable<Array<TypeModel.OrderProductType>>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<TypeModel.ResponseOrderProductType>(this.getOrderProductTypesUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  /**
   * Get the type actions enum
   * @return Observable with typeactions
   */
  getTypeActions():Observable<Array<TypeModel.TypeActions>>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<TypeModel.ResponseTypeActions>(this.getTypeActionsUrl, {headers}).pipe(map(response=>{
        return response.data;
      }));
    }));
  }

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  init = (listTypes: TypeModel.TypeLoad) => {
    if (listTypes.all) {
      this.loadType(PATH_GET_INDEX_ACTIONS, 'actions');
      //this.loadType(PATH_GET_INDEX_ACTIVITIES, 'activities');
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
      //if (listTypes.activities) this.loadType(PATH_GET_INDEX_ACTIVITIES, 'activities');
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

  /**
   * @comment lo creé acá ya que los servicios son precisamente para abstraer la lógica del networking de los componentes, no tiene sentido tener que pasar rutas al api
   * @return an observable with the user processes types
   */
   getIndexProcesses():Observable<Array<TypeModel.TypeProcess>>{
    /**Esta es la manera correcta no tiene mucho sentido una promesa dentro de un observable, sin embargo, hay que hacerlo en un interceptor, no tiene sentido hacer esto en cada petición, no lo hice porque hay que coordinar con todo el equipo */
    return from(this.auth.getCurrentToken()).pipe(switchMap((access_token)=>{
      const headers = new HttpHeaders({ Authorization: access_token });
      return this.http.get<TypeModel.ResponseTypeProcess>(PATH_GET_INDEX_PROCESS,{headers}).pipe(map((response)=>{
        return response.data;
      }))
    }));   
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
