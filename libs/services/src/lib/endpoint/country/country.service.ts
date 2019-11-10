import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';
import { map } from 'rxjs/operators';
import { CountryModel } from '@suite/services';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private baseUrl= `${environment.apiBase}/countries`
  constructor(private http: HttpClient) { }

  list(): Observable<Array<CountryModel.Country>> {
    return this.http.get<HttpRequestModel.Response>(this.baseUrl).pipe(map(response => response.data));
  }

  detail(id: number): Observable<CountryModel.Country> {
    return this.http.get<HttpRequestModel.Response>(`${this.baseUrl}/${id}`).pipe(map(response => response.data));
  }

}
