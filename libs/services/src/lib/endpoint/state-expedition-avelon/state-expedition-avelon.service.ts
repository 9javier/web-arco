import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import { Observable } from 'rxjs';
import { StateExpeditionAvelonModel } from 'libs/services/src/models/endpoints/StateExpeditionAvelon';
import { HttpRequestModel } from 'libs/services/src/models/endpoints/HttpRequest';

@Injectable({
  providedIn: 'root'
})
export class StateExpeditionAvelonService {

  /**Private urls for Satete service */
  private stateExpeditionAvelonUrl:string = environment.apiBase+"/state-expedition-avelon";
  private singleCarrierUrl:string = environment.apiBase+"/state-expedition-avelon/{{id}}";


  constructor(private http:HttpClient) { }

  /**
   * Get all state expedition avalon in server
   * @returns an array of state expedition avalon
   */
  getIndex():Observable<Array<StateExpeditionAvelonModel.StateExpeditionAvelon>>{
    return this.http.get<HttpRequestModel.Response>(this.stateExpeditionAvelonUrl).pipe(map(response => response.data));
  }



  /**
   * Get a State by id
   * @param id - the id of state to get
   * @returns a state
   */
  getSingle(id:number):Observable<CarrierModel.Carrier>{
    return this.http.get<CarrierModel.SingleCarrierResponse>(this.singleCarrierUrl.replace("{{id}}",String(id))).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Delete a state by id
   * @param id - the id of the state
   */
  delete(id:number):Observable<any>{
    return this.http.delete(this.singleCarrierUrl.replace("{{id}}",String(id)));
  }

  /**
   * Store one state
   * @param state
   */
  store(carrier):Observable<CarrierModel.Carrier>{
    return this.http.post<CarrierModel.SingleCarrierResponse>(this.stateExpeditionAvelonUrl,carrier).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Update an state
   * @param state
   */
  update(id,carrier){
    return this.http.put<CarrierModel.SingleCarrierResponse>(this.singleCarrierUrl.replace("{{id}}",String(id)),carrier).pipe(map(response=>{
      return response.data;
    }));
  }
}
