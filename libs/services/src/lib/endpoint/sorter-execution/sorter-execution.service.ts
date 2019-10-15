import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ExecutionSorterModel} from "../../../models/endpoints/ExecutionSorter";
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";

@Injectable({
  providedIn: 'root'
})
export class SorterExecutionService {

  private postExecuteColorUrl: string = environment.apiSorter + "/sorter/execution/color";
  private postStopExecuteColorUrl: string = environment.apiSorter + "/sorter/execution/color/stop";
  private postWrongWayUrl: string = environment.apiSorter + "/sorter/execution/incidence";
  private postFullWayUrl: string = environment.apiSorter + "/sorter/execution/way/full";
  private getChangeExecutionTemplateUrl: string = environment.apiSorter + "/sorter/execution/template/";
  private getColorActiveUrl: string = environment.apiSorter + "/sorter/execution/color/active";

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider
  ) { }

  postExecuteColor(params: ExecutionSorterModel.ParamsExecuteColor): Observable<ExecutionSorterModel.ExecuteColor> {
    return this.http.post<ExecutionSorterModel.ResponseExecuteColor>(this.postExecuteColorUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

  postStopExecuteColor(): Observable<ExecutionSorterModel.StopExecuteColor> {
    return this.http.post<ExecutionSorterModel.ResponseStopExecuteColor>(this.postStopExecuteColorUrl, {}).pipe(map(response => {
      return response.data;
    }));
  }

  postWrongWay(params: ExecutionSorterModel.ParamsWrongWay): Observable<ExecutionSorterModel.WrongWay> {
    return this.http.post<ExecutionSorterModel.ResponseWrongWay>(this.postWrongWayUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

  postFullWay(params: ExecutionSorterModel.ParamsFullWay): Observable<ExecutionSorterModel.FullWay> {
    return this.http.post<ExecutionSorterModel.ResponseFullWay>(this.postFullWayUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

  getChangeExecutionTemplate(idTemplate: number): Observable<ExecutionSorterModel.ChangeExecutionTemplate> {
    let url = this.getChangeExecutionTemplateUrl + idTemplate;
    return this.http.get<ExecutionSorterModel.ResponseChangeExecutionTemplate>(url).pipe(map(response => {
      return response.data;
    }));
  }

  getColorActive(): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getColorActiveUrl);
  }
}
