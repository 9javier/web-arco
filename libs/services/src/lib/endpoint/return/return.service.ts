import {Injectable} from '@angular/core';
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {environment} from "@suite/services";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {ReturnModel} from "../../../models/endpoints/Return";
import SearchParameters = ReturnModel.SearchParameters;
import SearchResponse = ReturnModel.SearchResponse;
import FilterOptionsResponse = ReturnModel.FilterOptionsResponse;
import Return = ReturnModel.Return;
import SaveResponse = ReturnModel.SaveResponse;
import LoadResponse = ReturnModel.LoadResponse;
import OptionsResponse = ReturnModel.OptionsResponse;
import {AuthenticationService} from "@suite/services";
import {from, Observable} from "rxjs";
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ReturnService {

  private postSearchHistoricFalseUrl = environment.apiBase+'/returns/search/false';
  private postSearchHistoricTrueUrl = environment.apiBase+'/returns/search';
  private postSaveUrl = environment.apiBase+'/returns/save';
  private postLoadUrl = environment.apiBase+'/returns/load';
  private getOptionsUrl = environment.apiBase+'/returns/options';
  private getFilterOptionsUrl = environment.apiBase+'/returns/filter-options';
  private sendexcell = environment.apiBase+'/returns/export-to-excel-historic';

  constructor(
    private requestsProvider: RequestsProvider,
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  postSearchHistoricFalse(params: SearchParameters): Promise<SearchResponse> {
    return this.requestsProvider.post(this.postSearchHistoricFalseUrl, params);
  }

  postSearchHistoricTrue(params: SearchParameters): Promise<SearchResponse> {
    return this.requestsProvider.post(this.postSearchHistoricTrueUrl, params);
  }

  postSave(params: {return: Return}): Promise<SaveResponse> {
    return this.requestsProvider.post(this.postSaveUrl, params);
  }

  postLoad(params: {returnId: number}): Promise<LoadResponse> {
    return this.requestsProvider.post(this.postLoadUrl, params);
  }

  getFilterOptions(): Promise<FilterOptionsResponse> {
    return this.requestsProvider.get(this.getFilterOptionsUrl);
  }

  getOptions(): Promise<OptionsResponse> {
    return this.requestsProvider.get(this.getOptionsUrl);
  }

  getFileExcellHistoric(parameters: SearchParameters) {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {

      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post(this.sendexcell, parameters, { headers, responseType: 'blob' });
    }));
  }
}
