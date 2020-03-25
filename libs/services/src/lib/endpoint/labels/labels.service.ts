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
  private getNumAllScanner$ = this.emitNumAllScanner.asObservable();

  /**urls of the service */
  private getIndexUrl = environment.apiBase+"/labels";
  private getStatusLabelsUrl = environment.apiBase+"/labels/status";
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
}
