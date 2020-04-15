import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LabelsPrintService {

  /**urls of the service */
  private getIndexUrl = environment.apiBase+"/labels/status";

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
}
