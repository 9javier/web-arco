import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";
import {SorterOutputModel} from "../../../models/endpoints/SorterOutput";

@Injectable({
  providedIn: 'root'
})
export class SorterOutputService {

  private getNewProcessWayUrl: string = environment.apiSorter + "/sorter/process/product/packing/new-way";
  private postAssignPackingToWayUrl: string = environment.apiSorter + "/sorters/assign-packing-way";
  private postScanProductPutInPackingUrl: string = environment.apiSorter + "/sorter/process/product/packing";
  private postPackingFullUrl: string = environment.apiSorter + "/sorters/full-packing";
  private postBlockSorterWayUrl: string = environment.apiSorter + "/sorters/block-way";
  private postEmptyWayUrl: string = environment.apiSorter + "/sorters/empty-way-out";
  private postGetIncidenceWayUrl: string = environment.apiSorter + "/sorter/execution/incidence/way";
  private getGetCurrentProcessWayUrl: string = environment.apiSorter + "/sorter/process/product/packing/get-way";

  constructor(
    private requestsProvider: RequestsProvider
  ) { }

  getNewProcessWay() : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getNewProcessWayUrl);
  }

  postAssignPackingToWay(params: SorterOutputModel.ParamsAssignPackingToWay) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postAssignPackingToWayUrl, params);
  }

  postScanProductPutInPacking(params: SorterOutputModel.ParamsScanProductPutInPacking) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postScanProductPutInPackingUrl, params);
  }

  postPackingFull(params: SorterOutputModel.ParamsPackingFull) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postPackingFullUrl, params);
  }

  postBlockSorterWay(params: SorterOutputModel.ParamsBlockSorterWay) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postBlockSorterWayUrl, params);
  }

  postEmptyWay(params: SorterOutputModel.ParamsEmptyWay) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postEmptyWayUrl, params);
  }

  postGetIncidenceWay(params: SorterOutputModel.ParamsGetIncidenceWay) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postGetIncidenceWayUrl, params);
  }

  getGetCurrentProcessWay() : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getGetCurrentProcessWayUrl);
  }
}
