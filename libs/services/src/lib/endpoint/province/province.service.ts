import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ProvinceModel } from '@suite/services';
@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  private baseUrl= `${environment.apiBase}/provinces`
  constructor(private http: HttpClient) { }

  list(): Observable<Array<ProvinceModel.Province>> {
    return this.http.get<HttpRequestModel.Response>(this.baseUrl).pipe(map(response => response.data));
  }

  detail(id: number): Observable<ProvinceModel.Province> {
    return this.http.get<HttpRequestModel.Response>(`${this.baseUrl}/${id}`).pipe(map(response => response.data));
  }
}
