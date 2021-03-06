import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TariffModel } from 'libs/services/src/models/endpoints/Tariff';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SortModel } from "../../../models/endpoints/Sort";
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";

@Injectable({
  providedIn: 'root'
})
export class TariffService {

  /**urls for tariff service */
  private getIndexUrl: string = environment.apiBase + "/tariffs/active";
  private getTariffIfSoftdeleteSGA: string = environment.apiBase + "/tariffs/";
  private isCalculatingSGA: string = environment.apiBase + "/tariffs/iscalculating";
  private isCalculatingSGATariff: string = environment.apiBase + "/tariffs/iscalculatingTariff";
  private putTariffEnabledUrl: string = environment.apiBase + "/tariffs/updateState";
  private syncTariffUrl: string = environment.apiBase + "/tariffs/sync";
  private getNewTariffUrl: string = environment.apiBase + "/tariffs/getNewTariff";
  private getTariffUpdatesUrl: string = environment.apiBase + "/tariffs/get-tariff-updates";
  private updateFilterPriceUrl = environment.apiBase + "/filter/prices/update-filter-price";
  private filterPriceTypesUrl = environment.apiBase + "/tariffs/filter-price-types";

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider
  ) { }

  /**
   * Get all tariff of the system
   * @param page
   * @param limit
   * @param sort
   * @returns observable with the tariff
   */
  getIndex(page: number = 1, limit: number = 1, sort: SortModel.Sort): Observable<TariffModel.ResponseTariffPaginator> {
    let params = {
      pagination: {
        page: page,
        limit: limit,
        sortField: sort ? sort.field : null,
        sortType: sort ? sort.type : null
      }
    };
    return this.http.post<TariffModel.ResponseTariff>(this.getIndexUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

  updateEnabled(list: any) {
    return this.http.put(this.putTariffEnabledUrl, list).pipe(map(response => {
      return response;
    }));
  }

  syncTariff() {
    return this.http.get(this.syncTariffUrl, {}).pipe(map(response => {
      return response;
    }));
  }

  getTariffIfSoftdelete() {
    return this.http.get<{
      data: {
        results: {
          name: string;
          activeFrom: string;
          activeTill: string;
        }[],
        pagination?: any
      }
    }>(this.getTariffIfSoftdeleteSGA, {}).pipe(map(response => {
      return response;
    })).pipe(map(response => {
      return response.data;
    }));
  }

  getIsCalculating() {
    return this.http.get<{
      data: {
        isCalculating: boolean,
        tariff: {
          name: string;
          activeFrom: string;
          activeTill: string;
        }
      }
    }>(this.isCalculatingSGA, {}).pipe(map(response => {
      return response;
    })).pipe(map(response => {
      return response.data;
    }));
  }

  getNewTariff() : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getNewTariffUrl);
  }

  getTariffUpdates(data: any[]) {
    let params = {
      data: data
    };
    return this.http.post<TariffModel.ResponseTariffUpdates>(this.getTariffUpdatesUrl, params).pipe(map(response => {
      return response.data;
    }));
  }
  updateFilterPrice(data: any[]) {
    let params = {
      data: data
    };
    return this.http.post<TariffModel.ResponseTariffUpdates>(this.updateFilterPriceUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

  getFilterPriceTypes() {
    return this.http.get(this.filterPriceTypesUrl);
  }

}
