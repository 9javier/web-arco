import {Injectable} from '@angular/core';
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {environment} from "@suite/services";
import {ReturnModel} from "../../../models/endpoints/Return";
import SearchParameters = ReturnModel.SearchParameters;
import SearchResponse = ReturnModel.SearchResponse;
import FilterOptionsResponse = ReturnModel.FilterOptionsResponse;
import Return = ReturnModel.Return;
import SaveResponse = ReturnModel.SaveResponse;
import LoadResponse = ReturnModel.LoadResponse;
import OptionsResponse = ReturnModel.OptionsResponse;
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReturnService {

  private postSearchUrl = environment.apiBase+'/returns/search';
  private postSaveUrl = environment.apiBase+'/returns/save';
  private postLoadUrl = environment.apiBase+'/returns/load';
  private getOptionsUrl = environment.apiBase+'/returns/options';
  private getFilterOptionsUrl = environment.apiBase+'/returns/filter-options';
  private postGetDefectiveProductsUrl = environment.apiBase + '/returns/products/defective';
  private postGetProductsUrl = environment.apiBase + '/returns/products';
  private postAssignDefectiveProductsUrl = environment.apiBase + '/returns/products/defective/assign';
  private postAssignProductsUrl = environment.apiBase + '/returns/products/assign';

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider
  ) {}

  postSearch(params: SearchParameters): Promise<SearchResponse> {
    return this.requestsProvider.post(this.postSearchUrl, params);
  }

  postSave(params): Promise<SaveResponse> {
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

  public postGetDefectiveProducts(params: ReturnModel.GetProductsParams): Observable<ReturnModel.GetDefectiveProductsResponse> {
    return this.http.post<ReturnModel.GetDefectiveProductsResponse>(this.postGetDefectiveProductsUrl, params);
  }

  public postGetProducts(params: ReturnModel.GetProductsParams): Observable<ReturnModel.GetProductsResponse> {
    return this.http.post<ReturnModel.GetProductsResponse>(this.postGetProductsUrl, params);
  }

  public postAssignDefectiveProducts(params: ReturnModel.AssignDefectiveProductsParams): Observable<ReturnModel.AssignDefectiveProductsResponse> {
    return this.http.post(this.postAssignDefectiveProductsUrl, params);
  }

  public postAssignProducts(params: ReturnModel.AssignProductsParams): Observable<ReturnModel.AssignProductsResponse> {
    return this.http.post(this.postAssignProductsUrl, params);
  }
}
