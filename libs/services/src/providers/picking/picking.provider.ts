import {Injectable} from "@angular/core";
import {ShoesPickingModel} from "../../models/endpoints/ShoesPicking";
import {PickingModel} from "../../models/endpoints/Picking";
import {StoresLineRequestsModel} from "../../models/endpoints/StoresLineRequests";
import {PickingStoreModel} from "../../models/endpoints/PickingStore";

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
      not_registered: 'La Jaula escaneada no está registrada en el sistema.',
      process_resumed: 'Para continuar con el proceso de picking escanea la Jaula ',
      process_started: 'Proceso iniciado con la Jaula ',
      process_end_packing: 'Proceso finalizado con la Jaula ',
      process_packing_empty: 'Desasociada del picking la Jaula ',
      scan_before_products: 'Escanea la Jaula a utilizar antes de comenzar el proceso.',
      scan_packing_to_end: 'Escanea de nuevo la Jaula utilizada para finalizar el proceso',
      scan_to_end: 'Todos los productos han sido escaneados. Escanea de nuevo la Jaula utilizada para finalizar el proceso.',
      toThe: "a la Jaula",
      wrong_packing: 'La herramienta de distribución escaneada no es la que se le solicitó. Escanea una Jaula para comenzar el proceso de picking.',
      wrong_process_finished: 'La Jaula escaneada es diferente a la Jaula con la que inició el proceso.',
      scan_packings_to_end: 'Escanee las Jaulas utilizadas para finalizar el picking',
    },
    'jail': {
      not_registered: 'La Jaula escaneada no está registrada en el sistema.',
      process_resumed: 'Para continuar con el proceso de picking escanea la Jaula ',
      process_started: 'Proceso iniciado con la Jaula ',
      process_end_packing: 'Proceso finalizado con la Jaula ',
      process_packing_empty: 'Desasociada del picking la Jaula ',
      scan_before_products: 'Escanea la Jaula a utilizar antes de comenzar el proceso.',
      scan_packing_to_end: 'Escanea de nuevo la Jaula utilizada para finalizar el proceso',
      scan_to_end: 'Todos los productos han sido escaneados. Escanea de nuevo la Jaula utilizada para finalizar el proceso.',
      toThe: "a la Jaula",
      wrong_packing: 'La herramienta de distribución escaneada no es la que se le solicitó. Escanea una Jaula para comenzar el proceso de picking.',
      wrong_process_finished: 'La Jaula escaneada es diferente a la Jaula con la que inició el proceso.',
      scan_packings_to_end: 'Escanee las Jaulas utilizadas para finalizar el picking',
    },
    2: {
      not_registered: 'El Pallet escaneado no está registrado en el sistema.',
      process_resumed: 'Para continuar con el proceso de picking escanea el Pallet ',
      process_started: 'Proceso iniciado con el Pallet ',
      process_end_packing: 'Proceso finalizado con el Pallet ',
      process_packing_empty: 'Desasociado del picking el Pallet ',
      scan_before_products: 'Escanea el Pallet a utilizar antes de comenzar el proceso.',
      scan_packing_to_end: 'Escanea de nuevo el Pallet utilizado para finalizar el proceso',
      scan_to_end: 'Todos los productos han sido escaneados. Escanea de nuevo el Pallet utilizado para finalizar el proceso.',
      toThe: "al Pallet",
      wrong_packing: 'La herramienta de distribución escaneada no es la que se le solicitó. Escanea un Pallet para comenzar el proceso de picking.',
      wrong_process_finished: 'El Pallet escaneado es diferente al Pallet con el que inició el proceso.',
      scan_packings_to_end: 'Escanee los pallets utilizados para finalizar el picking',
    },
    'pallet': {
      not_registered: 'El Pallet escaneado no está registrado en el sistema.',
      process_resumed: 'Para continuar con el proceso de picking escanea el Pallet ',
      process_started: 'Proceso iniciado con el Pallet ',
      process_end_packing: 'Proceso finalizado con el Pallet ',
      process_packing_empty: 'Desasociado del picking el Pallet ',
      scan_before_products: 'Escanea el Pallet a utilizar antes de comenzar el proceso.',
      scan_packing_to_end: 'Escanea de nuevo el Pallet utilizado para finalizar el proceso',
      scan_to_end: 'Todos los productos han sido escaneados. Escanea de nuevo el Pallet utilizado para finalizar el proceso.',
      toThe: "al Pallet",
      wrong_packing: 'La herramienta de distribución escaneada no es la que se le solicitó. Escanea un Pallet para comenzar el proceso de picking.',
      wrong_process_finished: 'El Pallet escaneado es diferente al Pallet con el que inició el proceso.',
      scan_packings_to_end: 'Escanee los pallets utilizados para finalizar el picking',
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

  private _listLineRequestsToStorePickings: StoresLineRequestsModel.StoresLineRequests[] = null;
  get listLineRequestsToStorePickings(): StoresLineRequestsModel.StoresLineRequests[] {
    return this._listLineRequestsToStorePickings;
  }
  set listLineRequestsToStorePickings(value: StoresLineRequestsModel.StoresLineRequests[]) {
    this._listLineRequestsToStorePickings = value;
  }

  private _listProductsToStorePickings: StoresLineRequestsModel.LineRequests[] = null;
  get listProductsToStorePickings(): StoresLineRequestsModel.LineRequests[] {
    return this._listProductsToStorePickings;
  }
  set listProductsToStorePickings(value: StoresLineRequestsModel.LineRequests[]) {
    this._listProductsToStorePickings = value;
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

  private _listStoresToPopoverList: Array<PickingModel.WorkwaveOrderWarehouse> = new Array<PickingModel.WorkwaveOrderWarehouse>();
  get listStoresToPopoverList(): Array<PickingModel.WorkwaveOrderWarehouse> {
    return this._listStoresToPopoverList;
  }
  set listStoresToPopoverList(value: Array<PickingModel.WorkwaveOrderWarehouse>) {
    this._listStoresToPopoverList = value;
  }
}
