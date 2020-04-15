import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  //private numScanSubject= new BehaviorSubject([]);
    numScan: any;
  private emitData = new BehaviorSubject({});
  private getData$ = this.emitData.asObservable();
  private emitNumAllScanner = new BehaviorSubject({});
  private emitScannerAlert = new BehaviorSubject({});
  private getNumAllScanner$ = this.emitNumAllScanner.asObservable();
  private getScannerAlert$ = this.emitScannerAlert.asObservable();

  /**urls of the service */
  private getIndexUrl = environment.apiBase+"/labels";
  private getStatusLabelsUrl = environment.apiBase+"/opl-expedition/";
  private postPrintLabelStoreUrl = environment.apiBase+"/opl-expedition/tracking-package/code";
  private getExpeditionListAlertsUrl = environment.apiBase+"/opl-expedition/alerts";
  private getPrintLabelByIdsUrl = environment.apiBase+"/opl-expedition/container/";
  private getTransportStatusUrl = environment.apiBase+"/opl-expedition/generate-tag/";
  private postServicePrintPackUrl = environment.apiBase+"/opl-expedition/service-print-pack/";



  constructor(private http:HttpClient) { }

  /**
   * Get all labels from server
   * @returns observable with array of labels
   * @todo model of data, but first need know the model
   */
  getIndex():Observable<any>{
    return this.http.get(this.getIndexUrl).pipe(map((response:any)=>{
      return response.data
    }));
  }
  getIndexLabels():Observable<any>{
    return this.http.get(this.getStatusLabelsUrl).pipe(map((response:any)=>{
      return response.data
    }));
  }
  getExpeditionByBarcode(body):Observable<any>{
    return this.http.post(this.getPrintLabelByIdsUrl,body).pipe(map((response:any)=>{
      return response.data
    }));
  }

  getTransportStatus(body):Observable<any>{
    return this.http.post(this.getTransportStatusUrl,body).pipe(map((response:any)=>{
      return response.data
    }));
  }

  getListAlertsExpedition():Observable<any>{
    return this.http.get(this.getExpeditionListAlertsUrl).pipe(map((response:any)=>{
      return response.data
    }));
  }

  postPrintLabels(body):Observable<any>{
    return this.http.post(this.postPrintLabelStoreUrl,body).pipe(map((response:any)=>{
      return response.data;
    }));
  }

  postServicePrintPack(body):Observable<any>{
    return this.http.post(this.postServicePrintPackUrl,body).pipe(map((response:any)=>{
      return response.data
    }));
  }

   refreshScanner() {
    this.emitData.next(this.numScan);
  }
  numScanner(numScan) {
    this.numScan = numScan;
    this.refreshScanner();
  }

  

  getData() {
    return this.getData$;
  }

  setNumAllScanner(num){
    this.emitNumAllScanner.next(num);
  }

  getNumAllScanner() {
    return this.getNumAllScanner$;
  }

  setScannerAlert(id){
    this.emitScannerAlert.next(id);
  }

  getScannerAlert(): Observable<any>{
    return this.getScannerAlert$;
  }
}
