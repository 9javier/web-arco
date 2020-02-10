import { map } from 'rxjs/operators';
import { ReceptionAvelonModel } from '@suite/services';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';

@Injectable({
  providedIn: 'root'
})
export class ReceptionsAvelonService {
  url: string;
  providersUrl: string;
  checkUrl: string
  urlReception: string
  constructor(
    private http: HttpClient
  ) {
    this.url = `${environment.apiReception}/reception`
    this.providersUrl = `${environment.apiReception}/avelonProviders/all`
    this.checkUrl = `${environment.apiReception}/avelonProviders`,
    this.urlReception =`${environment.apiReception}/reception/expedition/lines-destiny-impress/blocked`

  }

  getReceptions(providerId: number) {
    const body: ReceptionAvelonModel.GetProvider = {
      providerId
    }
    return this.http.post<HttpRequestModel.Response>(`${this.url}/all`, body).pipe(map(resp => resp.data));
  }

  getReceptionsNotifiedProviders(providerId: number) {
    const body: ReceptionAvelonModel.GetProvider = {
      providerId
    }
    return this.http.post<HttpRequestModel.Response>(`${this.url}/all-with-notified`, body).pipe(map(resp => resp.data));
  }

  getAllProviders() {
    return this.http.get<HttpRequestModel.Response>(this.providersUrl).pipe(map(resp => resp.data));
  }

  isProviderAviable(body) {
    return this.http.post<HttpRequestModel.Response>(this.checkUrl, body).pipe(map(resp => resp.data));
  }

  printReceptionLabel(body: ReceptionAvelonModel.Print){
    return this.http.post<HttpRequestModel.Response>(`${this.url}/print-reception-label`, body).pipe(map(resp => resp.data));
  }
  ocrFake(){
    return this.http.get<HttpRequestModel.Response>(`${this.url}/ocr-fake/1`).pipe(map(resp => resp.data));
  }
  ocrBrands(){
    return this.http.get<HttpRequestModel.Response>(`${this.url}/ocr/brands`).pipe(map(resp => resp.data));
  }  

  ocrModels(){
    return this.http.get<HttpRequestModel.Response>(`${this.url}/ocr/models`).pipe(map(resp => resp.data));
  }  

  ocrColors(){
    return this.http.get<HttpRequestModel.Response>(`${this.url}/ocr/colors`).pipe(map(resp => resp.data));
  }  

  ocrSizes(){
    return this.http.get<HttpRequestModel.Response>(`${this.url}/ocr/sizes`).pipe(map(resp => resp.data));
  }  


  eanProduct(ean: string) {
    return this.http.post<HttpRequestModel.Response>(`${this.url}/ean-product`, {ean}).pipe(map(resp => resp.data));
  }
/*
  index2(body) {
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
    return this.http.post<HttpRequestModel.Response>(this.urlReception,body).pipe(
      map(resp => resp.data)
    )
  }*/

}
