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
import { DefectiveRegistryModel } from '../../../models/endpoints/DefectiveRegistry';

@Injectable({
  providedIn: 'root'
})
export class DefectiveRegistryService {
  private baseUrl: string;
  private indexUrl: string;
  private entitiesFiltersUrl: string;
  private getHistoricalUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiSorter;
    this.indexUrl = `${this.baseUrl}/defects/registry/all`;
    this.entitiesFiltersUrl = `${this.baseUrl}/defects/registry/filters`;
    this.getHistoricalUrl = `${this.baseUrl}/defects/registry/product-historial`;
  }

  index(body: DefectiveRegistryModel.IndexRequest): Observable<DefectiveRegistryModel.DataSource> {
    return this.http.post<HttpRequestModel.Response>(this.indexUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  getFiltersEntities() {
    const body = {
      storeDetection: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      numberObservations:[],
      barCode: [],
      photo: [],
      warehouse: [],
      factoryReturn: [],
    };

    return this.http.post<HttpRequestModel.Response>(this.entitiesFiltersUrl,body).pipe(
      map(resp => resp.data)
    )
  }

  getHistorical(body):Observable<any>{
    return this.http.post(this.getHistoricalUrl, body).pipe(map((response:any)=>{
      return response.data;
    }));
  }

}
