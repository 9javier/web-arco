import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";
import {WorkwaveModel} from "../../../models/endpoints/Workwaves";

export const PATH_POST_STORE_WORKWAVE: string = PATH('Workwaves', 'Store');
export const PATH_POST_STORE_WORKWAVE_TASK: string = PATH('Workwaves Tasks', 'Store');
export const PATH_POST_STORE_WORKWAVE_TEMPLATE: string = PATH('Workwaves Templates', 'Store');
export const PATH_GET_LIST_TEMPLATES: string = PATH('Workwaves', 'List Templates');

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

  async postStore(
    type: string,
    workwaves: WorkwaveModel.Workwave[]
  ): Promise<Observable<HttpResponse<WorkwaveModel.ResponseStore>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    for (let workwave of workwaves) {
      this.filterObject(workwave);
    }

    console.debug('Test::Workwaves -> ', workwaves);

    let pathEndpoint = PATH_POST_STORE_WORKWAVE;
    let workwavesPost = {};

    if (type == 'template') {
      pathEndpoint = PATH_POST_STORE_WORKWAVE_TEMPLATE;
      workwavesPost = {
        workwavesTemplates: workwaves
      };
    } else if (type == 'schedule') {
      pathEndpoint = PATH_POST_STORE_WORKWAVE_TASK;
      workwavesPost = {
        workwavesTasks: workwaves
      };
    } else {
      workwavesPost = {
        workwaves: workwaves
      };
    }

    return this.http.post<WorkwaveModel.ResponseStore>(pathEndpoint,
      workwavesPost,
      {
        headers: headers,
        observe: 'response'
      });
  }

  private filterObject(object: any) {
    for (let iWorkwave in object) {
      if (object[iWorkwave] == '' || object[iWorkwave] == null) delete object[iWorkwave];
    }
  }

}
