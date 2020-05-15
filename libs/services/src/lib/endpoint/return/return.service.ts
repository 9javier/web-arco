import {Injectable} from '@angular/core';
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {environment} from "@suite/services";
import {ReturnModel} from "../../../models/endpoints/Return";
import SearchParameters = ReturnModel.SearchParameters;
import SearchResponse = ReturnModel.SearchResponse;
import FilterOptionsResponse = ReturnModel.FilterOptionsResponse;

@Injectable({
  providedIn: 'root'
})
export class ReturnService {

  private postSearchUrl = environment.apiBase+'/returns/search';
  private getFilterOptionsUrl = environment.apiBase+'/returns/filter-options';

  constructor(
    private requestsProvider: RequestsProvider
  ) {}

  postSearch(params: SearchParameters): Promise<SearchResponse> {
    return this.requestsProvider.post(this.postSearchUrl, params);
  }

  getFilterOptions(): Promise<FilterOptionsResponse> {
    return this.requestsProvider.get(this.getFilterOptionsUrl);
  }

}
