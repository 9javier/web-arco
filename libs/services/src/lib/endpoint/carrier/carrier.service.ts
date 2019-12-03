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
  private carrierUrl:string = environment.apiBase+"/packing";
  private singleCarrierUrl:string = environment.apiBase+"/packing/{{id}}";
  private warehouseDestination:string = environment.apiBase+"/packing/warehouse/{{id}}";
  private setWarehouseDestination:string = environment.apiBase+"/packing/warehouse";
  private packingUrl:string = environment.apiBase+"/types/packing";
  private sendPackingToWarehouse = environment.apiBase+"/packing/destiny/{{id}}/warehouse/{{warehouseId}}";
  private getCarriesEmptyPackingUrl = `${environment.apiBase}/packing/carriesEmptyPacking`
  private getReceptionsUrl = `${environment.apiBase}/packing/reception`
  private sendPackingUrl = environment.apiBase + "/packing/send"
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

  getPackingTypes(){
    return this.http.get(this.packingUrl).pipe(map((response)=>{
      return (<any>response).data;
    }))
  }

  updateDestination(id,destination){
    return this.http.put(this.warehouseDestination.replace("{{id}}",String(id)),destination);
  }

  setDestination(carrierId,destination){
    return this.http.put(this.setWarehouseDestination,{carrierId: carrierId, destinationWarehouseId: destination});
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

   /**
   * Send Packing to Warehouse
   */
  sendPackingToWareouse(id: number, warehouseId: number):Observable<CarrierModel.CarrierWarehouseDestiny>{
    return this.http.post<CarrierModel.CarrierWarehouseDestinyResponse>(this.sendPackingToWarehouse.replace("{{id}}",String(id)).replace("{{warehouseId}}",String(warehouseId)), {}).pipe(map(response=>{
      return response.data;
    }));
  }

  getCarriesEmptyPacking() {
    return this.http.get(this.getCarriesEmptyPackingUrl).pipe(map((resp:any)=>resp.data));
  }

  getReceptions(body) {
    return this.http.post(this.getReceptionsUrl, body).pipe(map((resp:any)=>resp.data));
  }
  sendPacking(packingReference:string, warehouseId: number) {
    let request = {packingReference: packingReference, warehouseId: warehouseId}
    return this.http.post<CarrierModel.SingleCarrierResponse>(this.sendPackingUrl,request).pipe(map(response=>{
      return response.data;
    }));
  }
}
