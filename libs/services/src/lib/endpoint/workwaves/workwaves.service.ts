import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";
import {WorkwaveModel} from "../../../models/endpoints/Workwaves";

export const PATH_POST_STORE_WORKWAVE: string = PATH('Workwaves', 'Store');
export const PATH_GET_LIST_TEMPLATES: string = PATH('Workwaves', 'List Templates');
export const PATH_GET_LIST_SCHEDULED: string = PATH('Workwaves', 'Index');
export const PATH_POST_UPDATE_WORKWAVE: string = PATH('Workwaves', 'Update').slice(0, -1);
export const PATH_GET_LIST_EXECUTED: string = PATH('Workwaves', 'List Executed');
export const PATH_DELETE_DESTROY_TASK: string = PATH('Workwaves', 'Destroy Task').slice(0, -1);
export const PATH_DELETE_DESTROY_TEMPLATE: string = PATH('Workwaves', 'Destroy Template').slice(0, -1);

@Injectable({
  providedIn: 'root'
})
export class WorkwavesService {
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  async getListTemplates() : Promise<Observable<HttpResponse<WorkwaveModel.ResponseListTemplates>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.get<WorkwaveModel.ResponseListTemplates>(PATH_GET_LIST_TEMPLATES,
      {
        headers: headers,
        observe: 'response'
      });
  }

  async getListScheduled() : Promise<Observable<HttpResponse<WorkwaveModel.ResponseListScheduled>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.get<WorkwaveModel.ResponseListScheduled>(PATH_GET_LIST_SCHEDULED,
      {
        headers: headers,
        observe: 'response'
      });
  }

  async getListExecuted() : Promise<Observable<HttpResponse<WorkwaveModel.ResponseListExecuted>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.get<WorkwaveModel.ResponseListScheduled>(PATH_GET_LIST_EXECUTED,
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

    return this.http.post<WorkwaveModel.ResponseStore>(PATH_POST_STORE_WORKWAVE,
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

    return this.http.put<WorkwaveModel.ResponseStore>(`${PATH_POST_UPDATE_WORKWAVE}${workwaveId}`,
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

    return this.http.delete<WorkwaveModel.ResponseDestroyTask>(`${PATH_DELETE_DESTROY_TASK}${workwaveId}`,
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

    return this.http.delete<WorkwaveModel.ResponseDestroyTemplate>(`${PATH_DELETE_DESTROY_TEMPLATE}${workwaveId}`,
      {
        headers: headers,
        observe: 'response'
      });
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
