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
  private postLoadWithProductsUrl = environment.apiBase+'/returns/load-with-products';
  private getOptionsUrl = environment.apiBase+'/returns/options';
  private getFilterOptionsUrl = environment.apiBase+'/returns/filter-options';
  private sendexcellHistoric = environment.apiBase+'/returns/export-to-excel-historic';
  private sendexcell = environment.apiBase+'/returns/export-to-excel';
  private postGetDefectiveProductsUrl = environment.apiBase + '/returns/products/defective';
  private postGetProductsUrl = environment.apiBase + '/returns/products';
  private postGetDefectiveProductsFiltersUrl = environment.apiBase + '/returns/products/defective/filters';
  private postGetProductsFiltersUrl = environment.apiBase + '/returns/products/filters';
  private postAssignDefectiveProductsUrl = environment.apiBase + '/returns/products/defective/assign';
  private postAssignProductsUrl = environment.apiBase + '/returns/products/assign';
  private postSearchAndAssignProductsUrl = environment.apiBase + '/returns/products/search/assign/';
  private postCheckProductsToAssignReturnUrl = environment.apiBase + '/returns/products/availability/check';
  private getGetAssignedProductsGroupedUrl = environment.apiBase + '/returns/products/assigned/grouped/';
  private postGetAvailableProductsGroupedUrl = environment.apiBase + '/returns/products/available/grouped';

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

  postSave(params): Promise<SaveResponse> {
    return this.requestsProvider.post(this.postSaveUrl, params);
  }

  postLoad(params: {returnId: number}): Promise<LoadResponse> {
    return this.requestsProvider.post(this.postLoadUrl, params);
  }

  postLoadWithProducts(params: {returnId: number}): Promise<LoadResponse> {
    return this.requestsProvider.post(this.postLoadWithProductsUrl, params);
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
      return this.http.post(this.sendexcellHistoric, parameters, { headers, responseType: 'blob' });
    }));
  }

  getFileExcell(parameters: SearchParameters) {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      // let headers:HttpHeaders = new HttpHeaders({Authorization:token});

      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post(this.sendexcell, parameters, { headers, responseType: 'blob' });
    }));
  }

  public postGetDefectiveProducts(params: ReturnModel.GetProductsParams): Observable<ReturnModel.GetDefectiveProductsResponse> {
    return this.http.post<ReturnModel.GetDefectiveProductsResponse>(this.postGetDefectiveProductsUrl, params);
  }

  public postGetProducts(params: ReturnModel.GetProductsParams): Observable<ReturnModel.GetProductsResponse> {
    return this.http.post<ReturnModel.GetProductsResponse>(this.postGetProductsUrl, params);
  }

  public postGetDefectiveProductsFilters(params: ReturnModel.GetProductsFiltersParams): Observable<ReturnModel.GetDefectiveProductsFiltersResponse> {
    return this.http.post<ReturnModel.GetDefectiveProductsFiltersResponse>(this.postGetDefectiveProductsFiltersUrl, params);
  }

  public postGetProductsFilters(params: ReturnModel.GetProductsFiltersParams): Observable<ReturnModel.GetProductsFiltersResponse> {
    return this.http.post<ReturnModel.GetProductsFiltersResponse>(this.postGetProductsFiltersUrl, params);
  }

  public postAssignDefectiveProducts(params: ReturnModel.AssignDefectiveProductsParams): Observable<ReturnModel.AssignDefectiveProductsResponse> {
    return this.http.post(this.postAssignDefectiveProductsUrl, params);
  }

  public postAssignProducts(params: ReturnModel.AssignProductsParams): Observable<ReturnModel.AssignProductsResponse> {
    return this.http.post(this.postAssignProductsUrl, params);
  }

  public postSearchAndAssignProducts(requestId: number): Observable<any> {
    return this.http.post(this.postSearchAndAssignProductsUrl + requestId, {});
  }

  public postCheckProductsToAssignReturn(params: ReturnModel.CheckProductsToAssignReturnParams): Observable<ReturnModel.CheckProductsToAssignReturnResponse> {
    return this.http.post<ReturnModel.CheckProductsToAssignReturnResponse>(this.postCheckProductsToAssignReturnUrl, params);
  }

  public getGetAssignedProductsGrouped(returnId: number): Observable<ReturnModel.AssignedProductsGroupedResponse> {
    return this.http.get<ReturnModel.AssignedProductsGroupedResponse>(this.getGetAssignedProductsGroupedUrl + returnId);
  }

  public postGetAvailableProductsGrouped(params: ReturnModel.AvailableProductsGroupedParams): Observable<ReturnModel.AvailableProductsGroupedResponse> {
    return this.http.post<ReturnModel.AvailableProductsGroupedResponse>(this.postGetAvailableProductsGroupedUrl, params);
  }
}
