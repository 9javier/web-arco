import {Injectable} from "@angular/core";
import {ShoesPickingModel} from "../../models/endpoints/ShoesPicking";
import {PickingModel} from "../../models/endpoints/Picking";
import {StoresLineRequestsModel} from "../../models/endpoints/StoresLineRequests";
import {PickingStoreModel} from "../../models/endpoints/PickingStore";
import {DeliveryRequestModel} from "../../models/endpoints/DeliveryRequest";
import DeliveryRequest = DeliveryRequestModel.DeliveryRequest;
import {LineRequestModel} from "../../models/endpoints/LineRequest";
import LineRequest = LineRequestModel.LineRequest;
import Filters = PickingStoreModel.Filters;

@Injectable({
  providedIn: 'root'
})
export class PickingProvider {
  private _method: string = "scanner";
  get method(): string {
    return this._method;
  }
  set method(value: string) {
    this._method = value;
  }

  private _colorsMessage: any = {
    error: {color: '#e8413e', name: 'danger'},
    info: {color: '#15789e', name: 'info'},
    success: {color: '#2F9E5A', name: 'success'}
  };
  get colorsMessage(): any {
    return this._colorsMessage;
  }

  private _colorsHeader: any = {
    background: {color: '#222428'},
    color: {color: '#FFFFFF'}
  };
  get colorsHeader(): any {
    return this._colorsHeader;
  }

  private _colorText: any = {color: '#FFFFFF'};
  get colorText(): any {
    return this._colorText;
  }

  private _literalsJailPallet: any = {
    1: {
      not_registered: 'El embalaje escaneado no está registrado en el sistema.',
      process_resumed: 'Para continuar con el proceso de picking escanea el embalaje ',
      process_started: 'Proceso iniciado con el embalaje ',
      process_end_packing: 'Proceso finalizado con el embalaje ',
      process_packing_empty: 'Desasociado del picking el embalaje ',
      scan_before_products: 'Escanea el embalaje a utilizar antes de comenzar el proceso.',
      scan_packing_to_end: 'Escanea de nuevo el embalaje utilizado para finalizar el proceso',
      scan_to_end: 'Todos los productos han sido escaneados. Escanea de nuevo el embalaje utilizado para finalizar el proceso.',
      toThe: "al embalaje",
      wrong_packing: 'La herramienta de distribución escaneada no es la que se le solicitó. Escanea una Jaula para comenzar el proceso de picking.',
      wrong_process_finished: 'El embalaje escaneado es diferente al embalaje con el que inició el proceso.',
      scan_packings_to_end: 'Escanee los embalajes utilizados para finalizar el picking',
      press_scan_packings_to_continue: 'Pulse escanear embalajes para continuar con el traspaso'
    },
    'jail': {
      not_registered: 'El embalaje escaneado no está registrado en el sistema.',
      process_resumed: 'Para continuar con el proceso de picking escanea el embalaje ',
      process_started: 'Proceso iniciado con el embalaje ',
      process_end_packing: 'Proceso finalizado con el embalaje ',
      process_packing_empty: 'Desasociado del picking el embalaje ',
      scan_before_products: 'Escanea el embalaje a utilizar antes de comenzar el proceso.',
      scan_packing_to_end: 'Escanea de nuevo el embalaje utilizado para finalizar el proceso',
      scan_to_end: 'Todos los productos han sido escaneados. Escanea de nuevo el embalaje utilizado para finalizar el proceso.',
      toThe: "al embalaje",
      wrong_packing: 'La herramienta de distribución escaneada no es la que se le solicitó. Escanea una Jaula para comenzar el proceso de picking.',
      wrong_process_finished: 'El embalaje escaneado es diferente al embalaje con el que inició el proceso.',
      scan_packings_to_end: 'Escanee los embalajes utilizados para finalizar el picking',
      press_scan_packings_to_continue: 'Pulse escanear embalajes para continuar con el traspaso'
    },
    2: {
      not_registered: 'El embalaje escaneado no está registrado en el sistema.',
      process_resumed: 'Para continuar con el proceso de picking escanea el embalaje ',
      process_started: 'Proceso iniciado con el embalaje ',
      process_end_packing: 'Proceso finalizado con el embalaje ',
      process_packing_empty: 'Desasociado del picking el embalaje ',
      scan_before_products: 'Escanea el embalaje a utilizar antes de comenzar el proceso.',
      scan_packing_to_end: 'Escanea de nuevo el embalaje utilizado para finalizar el proceso',
      scan_to_end: 'Todos los productos han sido escaneados. Escanea de nuevo el embalaje utilizado para finalizar el proceso.',
      toThe: "al embalaje",
      wrong_packing: 'La herramienta de distribución escaneada no es la que se le solicitó. Escanea un Pallet para comenzar el proceso de picking.',
      wrong_process_finished: 'El embalaje escaneado es diferente al embalaje con el que inició el proceso.',
      scan_packings_to_end: 'Escanee los embalajes utilizados para finalizar el picking',
      press_scan_packings_to_continue: 'Pulse escanear embalajes para continuar con el traspaso'
    },
    'pallet': {
      not_registered: 'El embalaje escaneado no está registrado en el sistema.',
      process_resumed: 'Para continuar con el proceso de picking escanea el embalaje ',
      process_started: 'Proceso iniciado con el embalaje ',
      process_end_packing: 'Proceso finalizado con el embalaje ',
      process_packing_empty: 'Desasociado del picking el embalaje ',
      scan_before_products: 'Escanea el embalaje a utilizar antes de comenzar el proceso.',
      scan_packing_to_end: 'Escanea de nuevo el embalaje utilizado para finalizar el proceso',
      scan_to_end: 'Todos los productos han sido escaneados. Escanea de nuevo el embalaje utilizado para finalizar el proceso.',
      toThe: "al embalaje",
      wrong_packing: 'La herramienta de distribución escaneada no es la que se le solicitó. Escanea un Pallet para comenzar el proceso de picking.',
      wrong_process_finished: 'El embalaje escaneado es diferente al embalaje con el que inició el proceso.',
      scan_packings_to_end: 'Escanee los embalajes utilizados para finalizar el picking',
      press_scan_packings_to_continue: 'Pulse escanear embalajes para continuar con el traspaso'
    }
  };
  get literalsJailPallet(): any {
    return this._literalsJailPallet;
  }

  private _pickingId: number;
  get pickingId(): number {
    return this._pickingId;
  }
  set pickingId(value: number) {
    this._pickingId = value;
  }

  private _currentReturnPickingId: number;
  get currentReturnPickingId(): number {
    return this._currentReturnPickingId;
  }
  set currentReturnPickingId(value: number) {
    this._currentReturnPickingId = value;
  }

  private _listProducts: ShoesPickingModel.ShoesPicking[];
  get listProducts(): ShoesPickingModel.ShoesPicking[] {
    return this._listProducts;
  }
  set listProducts(value: ShoesPickingModel.ShoesPicking[]) {
    this._listProducts = value;
  }

  private _typePacking: number;
  get typePacking(): number {
    return this._typePacking;
  }
  set typePacking(value: number) {
    this._typePacking = value;
  }

  private _typePicking: number;
  get typePicking(): number {
    return this._typePicking;
  }
  set typePicking(value: number) {
    this._typePicking = value;
  }

  private _packingReference: string = null;
  get packingReference(): string {
    return this._packingReference;
  }
  set packingReference(value: string) {
    this._packingReference = value;
  }

  private _listPickingsHistory: PickingModel.Picking[] = null;
  get listPickingsHistory(): PickingModel.Picking[] {
    return this._listPickingsHistory;
  }
  set listPickingsHistory(value: PickingModel.Picking[]) {
    this._listPickingsHistory = value;
  }

  private _listRejectionReasonsToStorePickings: PickingStoreModel.RejectionReasons[] = null;
  get listRejectionReasonsToStorePickings(): PickingStoreModel.RejectionReasons[] {
    return this._listRejectionReasonsToStorePickings;
  }
  set listRejectionReasonsToStorePickings(value: PickingStoreModel.RejectionReasons[]) {
    this._listRejectionReasonsToStorePickings = value;
  }

  private _listProductsToStorePickings: StoresLineRequestsModel.LineRequests[] = null;
  get listProductsToStorePickings(): StoresLineRequestsModel.LineRequests[] {
    return this._listProductsToStorePickings;
  }
  set listProductsToStorePickings(value: StoresLineRequestsModel.LineRequests[]) {
    this._listProductsToStorePickings = value;
  }

  private _selectedPendingRequests: Array<LineRequest | DeliveryRequest> = null;
  get selectedPendingRequests(): Array<LineRequest | DeliveryRequest> {
    return this._selectedPendingRequests;
  }
  set selectedPendingRequests(value: Array<LineRequest | DeliveryRequest>) {
    this._selectedPendingRequests = value;
  }

  private _selectedProcessedRequests: Array<LineRequest | DeliveryRequest> = null;
  get selectedProcessedRequests(): Array<LineRequest | DeliveryRequest> {
    return this._selectedProcessedRequests;
  }
  set selectedProcessedRequests(value: Array<LineRequest | DeliveryRequest>) {
    this._selectedProcessedRequests = value;
  }

  private _requestFilters: Filters = null;
  get requestFilters(): Filters {
    return this._requestFilters;
  }
  set requestFilters(value: Filters) {
    this._requestFilters = value;
  }

  private _listProductsProcessedToStorePickings: StoresLineRequestsModel.LineRequests[] = null;
  get listProductsProcessedToStorePickings(): StoresLineRequestsModel.LineRequests[] {
    return this._listProductsProcessedToStorePickings;
  }
  set listProductsProcessedToStorePickings(value: StoresLineRequestsModel.LineRequests[]) {
    this._listProductsProcessedToStorePickings = value;
  }

  private _listFiltersPicking: PickingStoreModel.Filters = null;
  get listFiltersPicking(): PickingStoreModel.Filters {
    return this._listFiltersPicking;
  }
  set listFiltersPicking(value: PickingStoreModel.Filters) {
    this._listFiltersPicking = value;
  }

  private _listStoresIdsToStorePicking: number[] = null;
  get listStoresIdsToStorePicking(): number[] {
    return this._listStoresIdsToStorePicking;
  }
  set listStoresIdsToStorePicking(value: number[]) {
    this._listStoresIdsToStorePicking = value;
  }

  private _listRequestsIdsToStorePicking: number[] = null;
  get listRequestsIdsToStorePicking(): number[] {
    return this._listRequestsIdsToStorePicking;
  }
  set listRequestsIdsToStorePicking(value: number[]) {
    this._listRequestsIdsToStorePicking = value;
  }

  private _listProductsFromPickingHistory: ShoesPickingModel.ShoesPicking[];
  get listProductsFromPickingHistory(): ShoesPickingModel.ShoesPicking[] {
    return this._listProductsFromPickingHistory;
  }
  set listProductsFromPickingHistory(value: ShoesPickingModel.ShoesPicking[]) {
    this._listProductsFromPickingHistory = value;
  }

  // Custom method to return status literal using status-id
  private _listStatus: any = {
    1: 'Creado',
    2: 'En curso',
    3: 'Finalizado',
    4: 'Pendiente de asignar'
  };
  getPickingStatusText(status: number): string {
    return this._listStatus[status];
  }

  private _pickingSelectedToStart: PickingModel.Picking = null;
  get pickingSelectedToStart(): PickingModel.Picking {
    return this._pickingSelectedToStart;
  }
  set pickingSelectedToStart(value: PickingModel.Picking) {
    this._pickingSelectedToStart = value;
  }

  private _listStoresToPopoverList: Array<{name: string, reference: string}> = new Array<{name: string, reference: string}>();
  get listStoresToPopoverList(): Array<{name: string, reference: string}> {
    return this._listStoresToPopoverList;
  }
  set listStoresToPopoverList(value: Array<{name: string, reference: string}>) {
    this._listStoresToPopoverList = value;
  }
}
