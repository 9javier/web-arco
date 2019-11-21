import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {  map } from 'rxjs/operators';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditsService {

  constructor(
    private http:HttpClient
  ) { }

  getAll():Observable<any>{
    return this.http.get(environment.apiBase+ '/sorter/audit/actives').pipe();
  }

  getAllPendintPacking():Observable<any>{
    return this.http.get(environment.apiBase+ '/sorter/audit/packings/pending').pipe();
  }

  create(data : any):Observable<any>{
    return this.http.post(environment.apiBase+ '/sorter/audit',data).pipe();
  }

  getProducts(data : any):Observable<any>{
    return this.http.post(environment.apiBase+ '/sorter/audit/packing/products',data).pipe();
  }

  addProduct(data : any):Observable<any>{
    return this.http.post(environment.apiBase+ '/sorter/audit/audit-packing-product',data).pipe();
  }

  getById(id:any):Observable<any>{
    return this.http.get(environment.apiBase+ '/sorter/audit/'+id).pipe();
  }

}
