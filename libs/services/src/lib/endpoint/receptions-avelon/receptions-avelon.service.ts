import { map } from 'rxjs/operators';
import { ReceptionAvelonModel } from '@suite/services';
import { of } from 'rxjs';
import { reception } from './mock';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';

@Injectable({
  providedIn: 'root'
})
export class ReceptionsAvelonService {
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this.url = `${environment.apiSorter}/reception/all`
  }

  getReceptions() {
    return this.http.get<HttpRequestModel.Response>(this.url).pipe(map(resp => resp.data));
  }
}
