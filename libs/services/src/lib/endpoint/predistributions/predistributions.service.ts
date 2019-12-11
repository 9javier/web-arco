import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class PredistributionsService {

  constructor() { }

  // async getIndex(): Promise<Observable<HttpResponse<PredistributionModel.ResponseIndex>>> {
  //   const currentToken = await this.auth.getCurrentToken();
  //   const headers = new HttpHeaders({ Authorization: currentToken });
  //   return this.http.get<PredistributionModel.ResponseIndex>(this.getIndexUrl, {
  //     headers: headers,
  //     observe: 'response'
  //   });
  // }

  async getIndex() {
    const warehouse: Warehouse = {
      id: 1,
      name: 'Tienda 1'
    };

    const model: Model = {
      id: 1,
      reference: ''
    };

    const size: Size = {
      id: 1,
      reference: '',
      number: 1,
      name: ''
    };

    const brand: Brand = {
      createdAt: '',
      updatedAt: '',
      id: 1,
      avelonId: 1,
      datasetHash: '',
      name: '',
      supplierName: ''
    };

    const season: Season = {
      createdAt: '',
      updatedAt: '',
      id: 1,
      datasetHash: '',
      name: '',
      avelonId: '',
    };

    const article: Product = {
        id: 1,
        reference: 'Articulo 1',
        initialWarehouse: warehouse,
        model: model,
        size: size,
        brand: brand,
        season: season,

    };

    const date_service = '12, Dec, 2019';

    const mock: ({ reserved: boolean; id: number; date_service: string; warehouse: Warehouse; distribution: boolean; article: Product })[] = [
      { id: 1, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 2, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 3, warehouse, article, date_service, distribution: true, reserved: false },
      { id: 4, warehouse, article, date_service, distribution: true, reserved: false },
      { id: 5, warehouse, article, date_service, distribution: true, reserved: false },
      { id: 6, warehouse, article, date_service, distribution: false, reserved: true },
      { id: 7, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 8, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 9, warehouse, article, date_service, distribution: true, reserved: false },
      { id: 10, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 11, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 12, warehouse, article, date_service, distribution: false, reserved: true },
      { id: 13, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 14, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 15, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 16, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 17, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 18, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 19, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 20, warehouse, article, date_service, distribution: false, reserved: false },
      { id: 21, warehouse, article, date_service, distribution: false, reserved: false },
    ];

    return mock;
  }
}
