import {map} from 'rxjs/operators';
import {ReceptionAvelonModel} from '@suite/services';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpRequestModel} from '../../../models/endpoints/HttpRequest';
import {Observable, BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReceptionsAvelonService {

  receptionsUrl: string = `${environment.apiBase}/reception`;
  getAllProvidersUrl: string = `${environment.apiBase}/avelonProviders/all`;
  postIsProviderAvailableUrl: string = `${environment.apiBase}/avelonProviders`;
  urlReception: string = `${environment.apiBase}/reception/expedition/lines-destiny-impress/blocked`;
  checkExpeditionsByNumberAndProviderUrl: string = `${environment.apiBase}/avelonProviders/check/expedition/provider`;
  postLoadSizesUrl: string = `${environment.apiBase}/reception/sizes/list`;

  private models = new BehaviorSubject([]); 
  private models$ = this.models.asObservable()
  private brands = new BehaviorSubject([]); 
  private brands$ = this.brands.asObservable()
  private sizes = new BehaviorSubject([]); 
  private sizes$ = this.sizes.asObservable()
  private colors = new BehaviorSubject([]); 
  private colors$ = this.colors.asObservable()
  private emit = new BehaviorSubject({}); 
  private emit$ = this.emit.asObservable()
  private emitSize = new BehaviorSubject({}); 
  private emitSize$ = this.emitSize.asObservable();

  constructor(
    private http: HttpClient
  ) {}

  //region API Requests
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

  printReceptionLabel(body: ReceptionAvelonModel.ParamsToPrint) {
    return this.http.post<HttpRequestModel.Response>(`${this.receptionsUrl}/print-reception-label`, body).pipe(map(resp => resp.data));
  }

  eanProductPrint(ean: string, expedition: string, providerId: number) {
    return this.http.post<HttpRequestModel.Response>(`${this.receptionsUrl}/ean-product/print-reception-label`, {ean, expedition, providerId}).pipe(map(resp => resp.data));
  }

  checkExpeditionsByNumberAndProvider(params: ReceptionAvelonModel.ParamsCheckExpeditionsByNumberAndProvider): Observable<ReceptionAvelonModel.ResponseCheckExpeditionsByNumberAndProvider> {
    return this.http.post<ReceptionAvelonModel.ResponseCheckExpeditionsByNumberAndProvider>(this.checkExpeditionsByNumberAndProviderUrl, params);
  }

  postLoadSizesList(params: ReceptionAvelonModel.ParamsLoadSizesList): Observable<ReceptionAvelonModel.ResponseLoadSizesList> {
    return this.http.post<ReceptionAvelonModel.ResponseLoadSizesList>(this.postLoadSizesUrl, params)
  }
  //endregion

  //region Data getter and setter
  setModelsList(data: Array<any>){
    this.models.next(data)
  }
  getModelsList(){
    return this.models$
  }
  
  setBrandsList(data: Array<any>){
    this.brands.next(data)
  }
  getBrandsList(){
    return this.brands$
  }
  setColorsList(data: Array<any>){
    this.colors.next(data)
  }
  getColorsList(){
    return this.colors$
  }
  setSizesList(data: Array<any>){
    this.sizes.next(data)
  }
  getSizesList(){
    return this.sizes$
  }
  setEmitList(data: any){
    this.emit.next(data)
  }
  getEmitList(){
    return this.emit$
  }
  
  setEmitSizes(data: any){
    this.emitSize.next(data)
  }
  getEmitSizes(){
    return this.emitSize$
  }
  //endregion
}
