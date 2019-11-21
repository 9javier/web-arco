import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";
import {WorkwaveModel} from "../../../models/endpoints/Workwaves";

import { environment } from '../../../environments/environment';
import {map} from "rxjs/operators";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import { BehaviorSubject } from 'rxjs';

export const PATH_POST_STORE_WORKWAVE: string = PATH('Workwaves', 'Store');
export const PATH_GET_LIST_TEMPLATES: string = PATH('Workwaves', 'List Templates');
export const PATH_GET_LIST_SCHEDULED: string = PATH('Workwaves', 'Index');
export const PATH_POST_UPDATE_WORKWAVE: string = PATH('Workwaves', 'Update').slice(0, -1);
export const PATH_GET_LIST_EXECUTED: string = PATH('Workwaves', 'List Executed');
export const PATH_DELETE_DESTROY_TASK: string = PATH('Workwaves', 'Destroy Task').slice(0, -1);
export const PATH_DELETE_DESTROY_TEMPLATE: string = PATH('Workwaves', 'Destroy Template').slice(0, -1);

export class WorkwaveWeeklyPlan {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;

  public static getDefault(){
    return this.fromString("0123456")
  }

  public static fromString(weeklyPlanString: string){
    const workwaveWeeklyPlan = new WorkwaveWeeklyPlan();
    workwaveWeeklyPlan.sunday = weeklyPlanString.indexOf("0") !== -1;
    workwaveWeeklyPlan.monday = weeklyPlanString.indexOf("1") !== -1;
    workwaveWeeklyPlan.tuesday = weeklyPlanString.indexOf("2") !== -1;
    workwaveWeeklyPlan.wednesday = weeklyPlanString.indexOf("3") !== -1;
    workwaveWeeklyPlan.thursday = weeklyPlanString.indexOf("4") !== -1;
    workwaveWeeklyPlan.friday = weeklyPlanString.indexOf("5") !== -1;
    workwaveWeeklyPlan.saturday = weeklyPlanString.indexOf("6") !== -1;
    return workwaveWeeklyPlan;
  }

  public toString() {
    return "" +
      (this.sunday ? "0" : "") +
      (this.monday ? "1" : "") +
      (this.tuesday ? "2" : "") +
      (this.wednesday ? "3" : "") +
      (this.thursday ? "4" : "") +
      (this.friday ? "5" : "") +
      (this.saturday ? "6" : "");
  }
}

@Injectable({
  providedIn: 'root'
})
export class WorkwavesService {

  buttonAvailability = new BehaviorSubject<any>({status:false});
  requestUser = new BehaviorSubject<any>(
    {
      data:{
        table:{
          listSelected:[],
          listThreshold:{}
        },
        user:[]
      },
      table:false,
      user: false,
      init:false
    }
  );
  orderAssignment = new BehaviorSubject<any>(
    {
      data:{
        store : {
          groupsWarehousePickingId: '',
          thresholdConsolidated: '',
        },
        typesShippingOrders:[]
      },
      store:false,
      type:false
    }
  );


  /**Urls for the workwaves service */
  private postStoreUrl:string = environment.apiBase+"/workwaves";
  private getListTemplatesUrl:string = environment.apiBase+"/workwaves/templates";
  private getListScheduledUrl:string = environment.apiBase+"/workwaves";
  private putUpdateWorkwaveUrl:string = environment.apiBase+"/workwaves/{{id}}";
  private getListExecutedUrl:string = environment.apiBase+"/workwaves/executed";
  private deleteDestroyTaskUrl:string = environment.apiBase+"/workwaves/tasks/{{id}}";
  private deleteDestroyTemplateUrl:string = environment.apiBase+"/workwaves/templates/{{id}}";

  private postMatchLineRequestUrl: string = environment.apiBase + "/workwaves/matchlinerequest/";
  private postAssignUserToMatchLineRequestUrl: string = environment.apiBase + "/workwaves/assign/matchlinerequest/";
  private postConfirmMatchLineRequestUrl: string = environment.apiBase + "/workwaves/confirm/matchlinerequest/";
  private postDeleteMatchLineRequestUrl: string = environment.apiBase + "/workwaves/matchlinerequest/delete";

  private postMatchLineRequestOnlineStoreUrl: string = environment.apiBase + "/workwaves/matchlinerequest-ot";
  private postAssignUserToMatchLineOnlineStoreRequestUrl: string = environment.apiBase + "/workwaves/assign/matchlinerequest-ot";
  private postConfirmMatchLineRequestOnlineStoreUrl: string = environment.apiBase + "/workwaves/confirm/matchlinerequest-ot";
  private postChangeStatusProductOnlineStoreUrl: string = environment.apiBase + "/workwaves/change/status-assigned-defective";

  private _lastWorkwaveEdited: any = null;
  private _lastWorkwaveRebuildEdited: any = null;
  private _lastWorkwaveHistoryQueried: any = null;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}

  async getListTemplates() : Promise<Observable<HttpResponse<WorkwaveModel.ResponseListTemplates>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.get<WorkwaveModel.ResponseListTemplates>(this.getListTemplatesUrl,
      {
        headers: headers,
        observe: 'response'
      });
  }

  async getListScheduled() : Promise<Observable<HttpResponse<WorkwaveModel.ResponseListScheduled>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.get<WorkwaveModel.ResponseListScheduled>(this.getListScheduledUrl,
      {
        headers: headers,
        observe: 'response'
      });
  }

  async getListExecuted() : Promise<Observable<HttpResponse<WorkwaveModel.ResponseListExecuted>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.get<WorkwaveModel.ResponseListScheduled>(this.getListExecutedUrl,
      {
        headers: headers,
        observe: 'response'
      });
  }

  async postStore(
    workwave: any
  ): Promise<Observable<HttpResponse<WorkwaveModel.ResponseStore>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    workwave = JSON.parse(JSON.stringify(workwave));

    this.filterWorkwave(workwave);

    return this.http.post<WorkwaveModel.ResponseStore>(this.postStoreUrl,
      workwave,
      {
        headers: headers,
        observe: 'response'
      });
  }

  async putUpdate(
    workwave: any,
    workwaveId: number
  ): Promise<Observable<HttpResponse<WorkwaveModel.ResponseStore>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    workwave = JSON.parse(JSON.stringify(workwave));

    this.filterWorkwave(workwave);

    return this.http.put<WorkwaveModel.ResponseStore>(
      this.putUpdateWorkwaveUrl.replace("{{id}}",String(workwaveId)),
      workwave,
      {
        headers: headers,
        observe: 'response'
      });
  }

  async deleteDestroyTask(
    workwaveId: number
  ): Promise<Observable<HttpResponse<WorkwaveModel.ResponseDestroyTask>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.delete<WorkwaveModel.ResponseDestroyTask>(
      this.deleteDestroyTaskUrl.replace("{{id}}",String(workwaveId)),
      {
        headers: headers,
        observe: 'response'
      });
  }

  async deleteDestroyTemplate(
    workwaveId: number
  ): Promise<Observable<HttpResponse<WorkwaveModel.ResponseDestroyTemplate>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.delete<WorkwaveModel.ResponseDestroyTemplate>(
      this.deleteDestroyTemplateUrl.replace("{{id}}",String(workwaveId)),
      {
        headers: headers,
        observe: 'response'
      });
  }

  postMatchLineRequest(params: WorkwaveModel.ParamsMatchLineRequest): Observable<Array<WorkwaveModel.MatchLineRequest>> {
    return this.http.post<WorkwaveModel.ResponseMatchLineRequest>(this.postMatchLineRequestUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

  postMatchLineRequestOnlineStore(params: WorkwaveModel.ParamsMatchLineRequestOnlineStore) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postMatchLineRequestOnlineStoreUrl, params);
  }

  postAssignUserToMatchLineRequest(params: WorkwaveModel.ParamsAssignUserToMatchLineRequest): Observable<WorkwaveModel.UsersAndAssignationsQuantities> {
    return this.http.post<WorkwaveModel.ResponseAssignUserToMatchLineRequest>(this.postAssignUserToMatchLineRequestUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

  postAssignUserToMatchLineOnlineStoreRequest(params: WorkwaveModel.ParamsAssignUserToMatchLineRequestOnlineStore) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postAssignUserToMatchLineOnlineStoreRequestUrl, params);
  }

  postConfirmMatchLineRequest(params: WorkwaveModel.ParamsConfirmMatchLineRequest): Observable<WorkwaveModel.DataConfirmMatchLineRequest> {
    return this.http.post<WorkwaveModel.ResponseConfirmMatchLineRequest>(this.postConfirmMatchLineRequestUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

  postConfirmMatchLineRequestOnlineStore(params: WorkwaveModel.ParamsConfirmMatchLineRequestOnlineStore) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postConfirmMatchLineRequestOnlineStoreUrl, params);
  }

  postChangeStatusProductOnlineStore(params: WorkwaveModel.ParamsChangeStatusProductOnlineStore) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postChangeStatusProductOnlineStoreUrl, params);
  }

  postDeletePickings(params: WorkwaveModel.ParamsDeletePickings): Observable<WorkwaveModel.DeletedPickings> {
    return this.http.post<WorkwaveModel.ResponseDeletePickings>(this.postDeleteMatchLineRequestUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

  get lastWorkwaveEdited(): any {
    return this._lastWorkwaveEdited;
  }

  set lastWorkwaveEdited(value: any) {
    this._lastWorkwaveEdited = value;
  }

  get lastWorkwaveRebuildEdited(): any {
    return this._lastWorkwaveRebuildEdited;
  }

  set lastWorkwaveRebuildEdited(value: any) {
    this._lastWorkwaveRebuildEdited = value;
  }

  get lastWorkwaveHistoryQueried(): any {
    return this._lastWorkwaveHistoryQueried;
  }

  set lastWorkwaveHistoryQueried(value: any) {
    this._lastWorkwaveHistoryQueried = value;
  }

  private filterWorkwave(object: any) {
    object.type = parseInt(object.type);
    if (object.previousType) {
      object.previousType = parseInt(object.previousType);
    }
    for (let warehouse of object.warehouses) {
      delete warehouse.name;
      delete warehouse.checked;
      delete warehouse.replace;
      delete warehouse.allocate;
      warehouse.thresholdConsolidated = parseInt(warehouse.thresholdConsolidated);
      warehouse.thresholdShippingStore = parseInt(warehouse.thresholdShippingStore);
      warehouse.typeGeneration = parseInt(warehouse.typeGeneration);
      warehouse.typePacking = parseInt(warehouse.typePacking);
      warehouse.typeShippingOrder = parseInt(warehouse.typeShippingOrder);
    }
  }

}
