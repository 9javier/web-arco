import { Injectable } from '@angular/core';
import { environment } from '../../..';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';
import { map } from 'rxjs/operators';
import { PostalCodeModel } from '@suite/services';
@Injectable({
  providedIn: 'root'
})
export class PostalCodeService {
  private baseUrl= `${environment.apiBase}/postal-codes`
  constructor(private http: HttpClient) { }

  list(): Observable<Array<PostalCodeModel.PostalCode>> {
    return this.http.get<HttpRequestModel.Response>(this.baseUrl).pipe(map(response => response.data));
  }

  detail(id: number): Observable<PostalCodeModel.PostalCode> {
    return this.http.get<HttpRequestModel.Response>(`${this.baseUrl}/${id}`).pipe(map(response => response.data));
  }
}
