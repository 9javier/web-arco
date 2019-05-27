import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";
import {WorkwaveModel} from "../../../models/endpoints/Workwaves";

export const PATH_POST_STORE_WORKWAVE: string = PATH('Workwaves', 'Store');
export const PATH_GET_LIST_TEMPLATES: string = PATH('Workwaves', 'List Templates');
export const PATH_GET_LIST_SCHEDULED: string = PATH('Workwaves', 'Index');

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

  private filterWorkwave(object: any) {
    object.type = parseInt(object.type);
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
