import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrierService {

  /**Private urls for Carrier service */
  private carrierUrl:string = environment.apiBase+"/carriers";
  private singleCarrierUrl:string = environment.apiBase+"/carriers/{{id}}";

  constructor(private http:HttpClient) { }

  /**
   * Get all carriers in server
   * @returns an array of carriers
   */
  getIndex():Observable<Array<CarrierModel.Carrier>>{
    return this.http.get<CarrierModel.CarrierResponse>(this.carrierUrl).pipe(map(response=>{
      return response.data;
    }));
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
   * Store one carrier
   * @param carrier 
   */
  store(carrier):Observable<CarrierModel.Carrier>{
    return this.http.post<CarrierModel.SingleCarrierResponse>(this.carrierUrl,carrier).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * Update an carrier
   * @param carrier 
   */
  update(id,carrier){
    return this.http.put<CarrierModel.SingleCarrierResponse>(this.singleCarrierUrl.replace("{{id}}",String(id)),carrier).pipe(map(response=>{
      return response.data;
    }));
  }
}
