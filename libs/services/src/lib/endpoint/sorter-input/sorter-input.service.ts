import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {InputSorterModel} from "../../../models/endpoints/InputSorter";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";
import {RequestsProvider} from "../../../providers/requests/requests.provider";

@Injectable({
  providedIn: 'root'
})
export class SorterInputService {

  private postProductScanUrl: string = environment.apiSorter + "/sorters/scanProduct";
  private postCheckProductInWayUrl: string = environment.apiSorter + "/sorter/execution/way/product/check";
  private postRackScanUrl: string = environment.apiSorter + "/sorter/process/product/rack";
  private postCheckWayIsFreeUrl: string = environment.apiSorter + "/sorter/execution/way/check-free";

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider
  ) { }

  postProductScan(params: InputSorterModel.ParamsProductScan): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postProductScanUrl, params);
  }

  postCheckProductInWay(params: InputSorterModel.ParamsCheckProductInWay): Observable<InputSorterModel.CheckProductInWay> {
    return this.http.post<InputSorterModel.ResponseCheckProductInWay>(this.postCheckProductInWayUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

  postRackScan(params: InputSorterModel.ParamsRackScan): Observable<InputSorterModel.RackScan> {
    return this.http.post<InputSorterModel.ResponseRackScan>(this.postRackScanUrl, params).pipe(map(response => {
      return response.data;
    }));
  }

  postCheckWayIsFree(params: InputSorterModel.ParamsCheckWayIsFree): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postCheckWayIsFreeUrl, params);
  }
}
