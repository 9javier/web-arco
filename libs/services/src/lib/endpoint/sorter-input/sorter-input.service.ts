import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {InputSorterModel} from "../../../models/endpoints/InputSorter";

@Injectable({
  providedIn: 'root'
})
export class SorterInputService {

  private postProductScanUrl: string = environment.apiBase + "/sorters/scanProduct";

  constructor(
    private http: HttpClient
  ) { }

  postProductScan(params: InputSorterModel.ParamsProductScan): Observable<InputSorterModel.ProductScan> {
    return this.http.post<InputSorterModel.ResponseProductScan>(this.postProductScanUrl, params).pipe(map(response => {
      return response.data;
    }));
  }
}
