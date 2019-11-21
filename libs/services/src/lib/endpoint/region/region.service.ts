import { Injectable } from '@angular/core';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RegionsModel } from '@suite/services';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  private baseUrl= `${environment.apiBase}/regions`
  constructor(private http: HttpClient) { }

  list(): Observable<Array<RegionsModel.Regions>> {
    return this.http.get<HttpRequestModel.Response>(this.baseUrl).pipe(map(response => response.data));
  }
  detail(id: number): Observable<RegionsModel.Regions> {
    return this.http.get<HttpRequestModel.Response>(`${this.baseUrl}/${id}`).pipe(map(response => response.data));
  }

  store(region: RegionsModel.Regions): Observable<RegionsModel.Regions> {
    return this.http.post<HttpRequestModel.Response>(this.baseUrl, region).pipe(map(response => response.data));
  }

  update(id: number, region: RegionsModel.Regions): Observable<number> {
    return this.http.put<HttpRequestModel.Response>(`${this.baseUrl}/${id}`,region).pipe(map(response => response.code));
  }

  delete(id: number): Observable<number> {
    return this.http.delete<HttpRequestModel.Response>(`${this.baseUrl}/${id}`).pipe(map(response => response.code));
  }


}
