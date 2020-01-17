import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import { Observable } from 'rxjs';
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarrierService {

  /**Private urls for Carrier service */
  private carrierUrl:string = environment.apiBase+"/packing";
  private carrierMeWarehouseUrl: string = environment.apiBase + '/packing/meWarehouses';
  private singleCarrierUrl:string = environment.apiBase+"/packing/{{id}}";
  private warehouseDestination:string = environment.apiBase+"/packing/warehouse/{{id}}";
  private setWarehouseDestination:string = environment.apiBase+"/packing/warehouse";
  private packingUrl:string = environment.apiBase+"/types/packing";
  private sendPackingToWarehouse = environment.apiBase+"/packing/destiny/{{id}}/warehouse/{{warehouseId}}";
  private getCarriesEmptyPackingUrl = `${environment.apiBase}/packing/carriesEmptyPacking`
  private getReceptionsUrl = `${environment.apiBase}/packing/reception`
  private sendPackingUrl = environment.apiBase + "/packing/send";
  private postSealsList = environment.apiBase+"/packing/seal-lista";
  private getGetPackingDestinyUrl = environment.apiBase + '/packing/destiny/';
  private postCheckProductsDestinyUrl = environment.apiBase + '/packing/products/destiny/check';
  private postVaciarCalle = environment.apiBase+'/packing/carrierProductIncidence';

  constructor(
    private http:HttpClient,
    private requestsProvider: RequestsProvider
  ) { }

  /**
   * Get all carriers in server
   * @returns an array of carriers
   */
  getIndex():Observable<Array<CarrierModel.Carrier>>{
    return this.http.get<CarrierModel.CarrierResponse>(this.carrierUrl).pipe(map(response=>{
      return response.data;
    }));
  }
  

  getCarrierMeWarehouse():Observable<Array<CarrierModel.Carrier>>{
    return this.http.get<CarrierModel.CarrierResponse>(this.carrierMeWarehouseUrl).pipe(map(response=>{
      return response.data;
    }));
  }


  postSealList(reference:string[]){
    let body={reference};
    return this.http.post(this.postSealsList,body)
  }

  // TODO Nuove Service Calle Vacia
  /**
   * @author Gaetano Sabino
   * @description recibe referencia o id Jaula de una Jaula para vaciar Jaula 
   * @param id number o string
   */
  postPackingEmpty(id:number | string){
    let body = {reference:id}
    return this.requestsProvider.post(this.postVaciarCalle,body)
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
  getSingle(id:any):Observable<CarrierModel.Carrier>{
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

  getGetPackingDestiny(packingReference: string) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getGetPackingDestinyUrl + packingReference);
  }

  postCheckProductsDestiny(params: CarrierModel.ParamsCheckProductsDestiny) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postCheckProductsDestinyUrl, params);
  }
}
