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

@Injectable({
  providedIn: 'root'
})
export class PredistributionsService {
  private baseUrl: string;
  private indexUrl: string;
  private index2Url: string;
  private entitiesUrl: string;
  private entities2Url: string;
  private updateBlockReservedUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiSorter;
    this.indexUrl = `${this.baseUrl}/reception/expedition/lines-destiny-impress`;
    this.entitiesUrl = `${this.baseUrl}/reception/expedition/lines-destiny-impress/entites`;
    this.updateBlockReservedUrl = `${this.baseUrl}/reception/expedition/update-block-reserved`;

    this.index2Url = `${this.baseUrl}/reception/expedition/lines-destiny-impress`;
    this.entities2Url = `${this.baseUrl}/reception/expedition/lines-destiny-impress/entites`;

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
      providers: [],
      brands: [],
      colors: [],
      sizes: [],
      models: []
    }
    return this.http.post<HttpRequestModel.Response>(this.entitiesUrl,body).pipe(
      map(resp => resp.data)
    )
  }


  updateBlockReserved(data:PredistributionModel.BlockReservedRequest[]){
    return this.http.post<HttpRequestModel.Response>(this.updateBlockReservedUrl, data).pipe(
      map(resp => resp.data)
    )
  }


  index2(body: PredistributionModel.IndexRequest): Observable<PredistributionModel.DataSource> {
    return this.http.post<HttpRequestModel.Response>(this.index2Url,body).pipe(
      map(resp => resp.data)
    )
  }
  
  entities2() {
    const body = {
      references: [],
      warehouses: [],
      providers: [],
      brands: [],
      colors: [],
      sizes: [],
      models: []
    }
    return this.http.post<HttpRequestModel.Response>(this.entitiesUrl,body).pipe(
      map(resp => resp.data)
    )
  }

}
