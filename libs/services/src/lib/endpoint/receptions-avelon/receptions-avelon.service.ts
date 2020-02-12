import {map} from 'rxjs/operators';
import {ReceptionAvelonModel} from '@suite/services';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpRequestModel} from '../../../models/endpoints/HttpRequest';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReceptionsAvelonService {

  receptionsUrl: string = `${environment.apiBase}/reception`;
  getAllProvidersUrl: string = `${environment.apiBase}/avelonProviders/all`;
  postIsProviderAvailableUrl: string = `${environment.apiBase}/avelonProviders`;
  urlReception: string = `${environment.apiBase}/reception/expedition/lines-destiny-impress/blocked`;
  checkExpeditionsByNumberAndProviderUrl: string = `${environment.apiBase}/avelonProviders/check/expedition/provider`;

  constructor(
    private http: HttpClient
  ) {}

  getReceptions(providerId: number) {
    const body: ReceptionAvelonModel.GetProvider = {
      providerId
    };
    return this.http.post<HttpRequestModel.Response>(`${this.receptionsUrl}/all`, body).pipe(map(resp => resp.data));
  }

  getReceptionsNotifiedProviders(providerId: number) {
    const body: ReceptionAvelonModel.GetProvider = {
      providerId
    };
    return this.http.post<HttpRequestModel.Response>(`${this.receptionsUrl}/all-with-notified`, body).pipe(map(resp => resp.data));
  }

  getAllProviders() {
    return this.http.get<HttpRequestModel.Response>(this.getAllProvidersUrl).pipe(map(resp => resp.data));
  }

  isProviderAvailable(body) {
    return this.http.post<HttpRequestModel.Response>(this.postIsProviderAvailableUrl, body).pipe(map(resp => resp.data));
  }

  printReceptionLabel(body: ReceptionAvelonModel.Print) {
    return this.http.post<HttpRequestModel.Response>(`${this.receptionsUrl}/print-reception-label`, body).pipe(map(resp => resp.data));
  }

  ocrFake() {
    return this.http.get<HttpRequestModel.Response>(`${this.receptionsUrl}/ocr-fake/1`).pipe(map(resp => resp.data));
  }

  ocrBrands() {
    return this.http.get<HttpRequestModel.Response>(`${this.receptionsUrl}/ocr/brands`).pipe(map(resp => resp.data));
  }

  ocrModels() {
    return this.http.get<HttpRequestModel.Response>(`${this.receptionsUrl}/ocr/models`).pipe(map(resp => resp.data));
  }

  ocrColors() {
    return this.http.get<HttpRequestModel.Response>(`${this.receptionsUrl}/ocr/colors`).pipe(map(resp => resp.data));
  }

  ocrSizes() {
    return this.http.get<HttpRequestModel.Response>(`${this.receptionsUrl}/ocr/sizes`).pipe(map(resp => resp.data));
  }

  eanProduct(ean: string) {
    return this.http.post<HttpRequestModel.Response>(`${this.receptionsUrl}/ean-product`, {ean}).pipe(map(resp => resp.data));
  }

  eanProductPrint(ean: string, expedition: string, providerId: number) {
    return this.http.post<HttpRequestModel.Response>(`${this.receptionsUrl}/ean-product/print-reception-label`, {ean, expedition, providerId}).pipe(map(resp => resp.data));
  }

  checkExpeditionsByNumberAndProvider(params: ReceptionAvelonModel.ParamsCheckExpeditionsByNumberAndProvider): Observable<ReceptionAvelonModel.ResponseCheckExpeditionsByNumberAndProvider> {
    return this.http.post<ReceptionAvelonModel.ResponseCheckExpeditionsByNumberAndProvider>(this.checkExpeditionsByNumberAndProviderUrl, params);
  }
}
