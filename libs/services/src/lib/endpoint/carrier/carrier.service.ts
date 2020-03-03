import { map } from 'rxjs/operators';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import { RequestsProvider } from "../../../providers/requests/requests.provider";
import { HttpRequestModel } from "../../../models/endpoints/HttpRequest";
import { environment } from '../../../environments/environment';
import {ExcellModell} from "../../../models/endpoints/Excell";
import {Injectable} from '@angular/core';
import {IncidenceModel} from "../../../models/endpoints/Incidence";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {AuthenticationService, TypeModel} from "@suite/services";
import {from, Observable} from "rxjs";
import {switchMap} from "rxjs/operators";
import {InventoryModel} from "../../../models/endpoints/Inventory";

@Injectable({
  providedIn: 'root'
})
export class CarrierService {

  /**Private urls for Carrier service */
  private carrierUrl: string = environment.apiBase + "/packing";
  private carrierMeWarehouseUrl: string = environment.apiBase + '/packing/me-warehouses';
  private singleCarrierUrl: string = environment.apiBase + "/packing/{{id}}";
  private warehouseDestination: string = environment.apiBase + "/packing/warehouse/{{id}}";
  private getReference: string = environment.apiBase + "/packing/warehouse/{{reference}}";
  private setWarehouseDestination: string = environment.apiBase + "/packing/warehouse";
  private setWarehouseDestinationMultiple: string = environment.apiBase + "/packing/destiny/warehouses";
  private packingUrl: string = environment.apiBase + "/types/packing";
  private sendPackingToWarehouse = environment.apiBase + "/packing/destiny/{{id}}/warehouse/{{warehouseId}}";
  private getCarriesEmptyPackingUrl = `${environment.apiBase}/packing/carries-empty-packing`
  private getReceptionsUrl = `${environment.apiBase}/packing/reception`
  private sendPackingUrl = environment.apiBase + "/packing/send";
  private postSealsList = environment.apiBase + "/packing/seal-lista";
  private postSealAll = environment.apiBase + "/packing/seal/all"
  private getGetPackingDestinyUrl = environment.apiBase + '/packing/destiny/';
  private postCheckProductsDestinyUrl = environment.apiBase + '/packing/products/destiny/check';
  private postCheckPackingAvailabilityUrl = environment.apiBase + '/packing/availability/check';
  private postVaciarCalle = environment.apiBase + '/packing/empty';
  private getCarrierHistoryURL = environment.apiBase + '/packing/history';
  private getAllWhsonCarries = environment.apiBase + '/packing/getWhs/getWhsOnCarrier';
  private movementHistory = environment.apiBase + '/packing/warehouse/movementHistory';
  private typeMovement = environment.apiBase + '/types/movement-history';
  private sendexcell = environment.apiBase + "/packing/export-to-excel";

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider,
    private auth: AuthenticationService,
  ) {
  }
  /**
   * Get all carriers in server
   * @returns an array of carriers
   */
  getIndex(): Observable<Array<CarrierModel.Carrier>> {
    return this.http.get<CarrierModel.CarrierResponse>(this.carrierUrl).pipe(map(response => {
      return response.data;
    }));
  }

  /*------------------*/
  getAllWhs(): Observable<Array<CarrierModel.Carrier>> {
    return this.http.get<CarrierModel.CarrierResponse>(this.getAllWhsonCarries).pipe(map(response => {
      return response.data;
    }));
  }

  postMovementsHistory(body: {}): Observable<Array<CarrierModel.Carrier>> {
    return this.http.post<CarrierModel.CarrierResponse>(this.movementHistory, body).pipe(map(response => {
      return response.data;
    }));
  }

  getMovementType(): Observable<Array<CarrierModel.Carrier>> {
    return this.http.get<CarrierModel.CarrierResponse>(this.typeMovement).pipe(map(response => {
      return response.data;
    }));
  }

  /*------------------*/

  getSingleCarrier() {
    return this.http.get<CarrierModel.CarrierResponse>(this.carrierUrl).pipe(map(response => {
      return response.data;
    }));

    /*
    const affected = await this.repo.createQueryBuilder()
      .update(Cars)
      .set(cars)
      .where('id = :id', { id: cars.getId() })
      .execute();

    */
  }

  getCarrierMeWarehouse(): Observable<Array<CarrierModel.Carrier>> {
    return this.http.get<CarrierModel.CarrierResponse>(this.carrierMeWarehouseUrl).pipe(map(response => {
      return response.data;
    }));
  }



  postSealList(reference: string[]) {
    let body = { reference };
    return this.http.post(this.postSealsList, body)
  }
  postSeals(sealList) {
    return this.http.post(this.postSealAll, sealList);
  }

  /**
   * @author Gaetano Sabino
   * @description recibe referencia o id Jaula de una Jaula para vaciar Jaula
   * @param id number o string
   * @param process number
   */
  postPackingEmpty(id: number | string, process: string) {
    let body = { packingIdOrReference: id, process };
    return this.requestsProvider.post(this.postVaciarCalle, body)
  }

  getPackingTypes() {
    return this.http.get(this.packingUrl).pipe(map((response) => {
      return (<any>response).data;
    }))
  }

  updateDestination(id, destination) {
    return this.http.put(this.warehouseDestination.replace("{{id}}", String(id)), destination);
  }

  setDestination(carrierId, destination) {
    return this.http.put(this.setWarehouseDestination, { carrierId: carrierId, destinationWarehouseId: destination });
  }

  setDestinationMultiple(CarrierToDestiny) {
    return this.http.post(this.setWarehouseDestinationMultiple, CarrierToDestiny);
  }
  /**
   * Get a carrier by id
   * @param id - the id of carrier to get
   * @returns a carrier
   */
  getSingle(id: any): Observable<CarrierModel.Carrier> {
    return this.http.get<CarrierModel.SingleCarrierResponse>(this.singleCarrierUrl.replace("{{id}}", String(id))).pipe(map(response => {
      return response.data;
    }));
  }

  getByReference(reference: string) {
    return this.http.get<CarrierModel.SingleCarrierResponse>(this.getReference.replace("{{reference}}", String(reference))).pipe(map(response => {
      return response.data;
    }));
  }

  /**
   * Delete a carrier by id
   * @param id - the id of the carrier
   */
  delete(id: number): Observable<any> {
    return this.http.delete(this.singleCarrierUrl.replace("{{id}}", String(id)));
  }

  /**
   * Store one carrier
   * @param carrier
   */
  store(carrier): Observable<CarrierModel.Carrier> {
    return this.http.post<CarrierModel.SingleCarrierResponse>(this.carrierUrl, carrier).pipe(map(response => {
      return response.data;
    }));
  }

  /**
   * Update an carrier
   * @param carrier
   */
  update(id, carrier) {
    return this.http.put<CarrierModel.SingleCarrierResponse>(this.singleCarrierUrl.replace("{{id}}", String(id)), carrier).pipe(map(response => {
      return response.data;
    }));
  }

  /**
  * Send Packing to Warehouse
  */
  sendPackingToWareouse(id: number, warehouseId: number): Observable<CarrierModel.CarrierWarehouseDestiny> {
    return this.http.post<CarrierModel.CarrierWarehouseDestinyResponse>(this.sendPackingToWarehouse.replace("{{id}}", String(id)).replace("{{warehouseId}}", String(warehouseId)), {}).pipe(map(response => {
      return response.data;
    }));
  }

  getCarriesEmptyPacking() {
    return this.http.get(this.getCarriesEmptyPackingUrl).pipe(map((resp: any) => resp.data));
  }

  getReceptions(body) {
    return this.http.post(this.getReceptionsUrl, body).pipe(map((resp: any) => resp.data));
  }
  sendPacking(packingReference: string, warehouseId: number) {
    let request = { packingReference: packingReference, warehouseId: warehouseId }
    return this.http.post<CarrierModel.SingleCarrierResponse>(this.sendPackingUrl, request).pipe(map(response => {
      return response.data;
    }));
  }

  getGetPackingDestiny(packingReference: string): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.getGetPackingDestinyUrl + packingReference);
  }

  postCheckProductsDestiny(params: CarrierModel.ParamsCheckProductsDestiny): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postCheckProductsDestinyUrl, params);
  }

  postCheckPackingAvailability(params: CarrierModel.ParamsCheckPackingAvailability): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postCheckPackingAvailabilityUrl, params);
  }

  carrierHistory(ref: string): Observable<CarrierModel.HistoryModal> {
    let body = JSON.parse(JSON.stringify({ ref }));
    return this.http.post<CarrierModel.HistoryModal>(this.getCarrierHistoryURL, { reference: ref })
      .pipe(
        map(elem => elem.data)
      );
  }

  getFileExcell(parameters: ExcellModell.fileExcell) {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      // let headers:HttpHeaders = new HttpHeaders({Authorization:token});

      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post(this.sendexcell, parameters, { headers, responseType: 'blob' });
    }));
  }

}
