import { HttpRequestModel } from 'libs/services/src/models/endpoints/HttpRequest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { PredistributionModel } from '../../../models/endpoints/Predistribution';
import { ModelModel, ProductModel, SizeModel, WarehouseModel } from '@suite/services';
import Warehouse = WarehouseModel.Warehouse;
import Product = ProductModel.Product;
import { BrandModel } from '../../../models/endpoints/Brand';
import { SeasonModel } from '../../../models/endpoints/Season';
import Model = ModelModel.Model;
import Size = SizeModel.Size;
import Brand = BrandModel.Brand;
import Season = SeasonModel.Season;
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {RequestsProvider} from "../../../providers/requests/requests.provider";

@Injectable({
  providedIn: 'root'
})
export class PredistributionsService {
  private baseUrl: string;
  private indexUrl: string;
  private index2Url: string;
  private entitiesUrl: string;
  private entitiesBlockedUrl: string;
  private updateBlockReservedUrl: string;
  private updateBlockReservedUrl2: string;
  private newDirectPickingUrl: string;

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider
  ) {
    this.baseUrl = environment.apiSorter;
    this.indexUrl = `${this.baseUrl}/reception/expedition/lines-destiny-impress`;
    this.entitiesUrl = `${this.baseUrl}/reception/expedition/lines-destiny-impress/entites`;
    this.updateBlockReservedUrl = `${this.baseUrl}/reception/expedition/update-block-reserved`;
    this.updateBlockReservedUrl2 = `${this.baseUrl}/handler/test/BlockProduct`;
    this.index2Url = `${this.baseUrl}/reception/expedition/lines-destiny-impress/blocked`;
    this.entitiesBlockedUrl = `${this.baseUrl}/reception/expedition/lines-destiny-impress/filters-blocked`;
    this.newDirectPickingUrl = `${this.baseUrl}/workwaves/confirm/matchLineRequest-res`;
  }

  index(body: PredistributionModel.IndexRequest): Observable<PredistributionModel.DataSource> {
    return this.http.post<HttpRequestModel.Response>(this.indexUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  entities() {
    const body = {
      references: [],
      warehouses: [],
      date_service: [],
      brands: [],
      providers: [],
      models: [],
      colors: [],
      category: [],
      family: [],
      lifestyle: []
    };

    return this.http.post<HttpRequestModel.Response>(this.entitiesUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  updateBlockReserved(data:PredistributionModel.BlockReservedRequest[]){
    return this.http.post<HttpRequestModel.Response>(this.updateBlockReservedUrl, data).pipe(
      map(resp => resp.data)
    )
  }

  updateBlockReserved2(data:PredistributionModel.BlockReservedRequest[]){
    return this.http.post<HttpRequestModel.Response>(this.updateBlockReservedUrl2, data).pipe(
      map(resp => resp.data)
    )
  }

  index2(body: PredistributionModel.IndexRequest): Observable<PredistributionModel.DataSource> {
    return this.http.post<HttpRequestModel.Response>(this.index2Url,body).pipe(
      map(resp => resp.data)
    )
  }

  entitiesBlocked() {
    const body = {
      references: [],
      warehouses: [],
      date_service: [],
      brands: [],
      providers: [],
      models: [],
      colors: [],
      category: [],
      family: [],
      lifestyle: []
    };

    return this.http.post<HttpRequestModel.Response>(this.entitiesBlockedUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  newDirectPicking(parameters: PredistributionModel.PickingRequest): Promise<HttpRequestModel.Response>{
    return this.requestsProvider.post(this.newDirectPickingUrl, parameters);
  }

}
