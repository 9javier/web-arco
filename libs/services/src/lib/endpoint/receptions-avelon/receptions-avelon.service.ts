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
  constructor(
    private http: HttpClient
  ) {
    this.url = `${environment.apiSorter}/reception`
    this.providersUrl = `${environment.apiSorter}/avelonProviders/all`
    this.checkUrl = `${environment.apiSorter}/avelonProviders`

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

  eanProduct(ean: string) {
    return this.http.post<HttpRequestModel.Response>(`${this.url}/ean-product`, {ean}).pipe(map(resp => resp.data));
  }

}
