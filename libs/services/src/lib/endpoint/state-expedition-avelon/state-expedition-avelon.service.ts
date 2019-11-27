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

  /**Private urls for Carrier service */
  private stateExpeditionAvelonUrl:string = environment.apiBase+"/state-expedition-avelon";
  private singleCarrierUrl:string = environment.apiBase+"/state-expedition-avelon/{{id}}";


  constructor(private http:HttpClient) { }

  /**
   * Get all state expedition avalon in server
   * @returns an array of state expedition avalon
   */
  getIndex():Observable<Array<StateExpeditionAvelonModel.StateExpeditionAvelon>>{
    return this.http.get<HttpRequestModel.Response>(this.stateExpeditionAvelonUrl).pipe(map(response => response.data));

    /*return this.http.get<StateExpeditionAvelonModel.StateExpeditionAvelon>(this.carrierUrl).pipe(map(response=>{
      return response.data;
    }));*/
  }



  /**
   * Get a carrier by id
   * @param id - the id of carrier to get
   * @returns a carrier
   */
  getSingle(id:number):Observable<CarrierModel.Carrier>{
    return this.http.get<CarrierModel.SingleCarrierResponse>(this.singleCarrierUrl.replace("{{id}}",String(id))).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Delete a carrier by id
   * @param id - the id of the carrier
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
