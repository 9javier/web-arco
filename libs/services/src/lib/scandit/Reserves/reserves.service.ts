import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {PickingProvider} from "../../../providers/picking/picking.provider";
import {PickingStoreService} from "../../endpoint/picking-store/picking-store.service";
import {PickingStoreModel} from "../../../models/endpoints/PickingStore";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {Events} from "@ionic/angular";
import {environment} from "../../../environments/environment";
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";
import {ItemReferencesProvider} from "../../../providers/item-references/item-references.provider";
import ResponsePickingStores = ScanditModel.ResponsePickingStores;
import ParamsFiltered = PickingStoreModel.ParamsFiltered;
import {DeliveryRequestModel} from "../../../models/endpoints/DeliveryRequest";
import DeliveryRequest = DeliveryRequestModel.DeliveryRequest;
import FreeReserveResponse = DeliveryRequestModel.FreeReserveResponse;

declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class ReservesService {

  private readonly timeMillisToResetScannedCode: number = 1000;
  private lastCodeScanned: string;

  constructor(
    private events: Events,
    private pickingStoreService: PickingStoreService,
    private scanditProvider: ScanditProvider,
    private pickingProvider: PickingProvider,
    private itemReferencesProvider: ItemReferencesProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
  }

  async freeReserves() {
    let filtersToGetProducts: ParamsFiltered = {
      orderbys: [],
      sizes: [],
      colors: [],
      models: [],
      brands: []
    };
    let listReservesToFree: DeliveryRequest[] = this.pickingProvider.selectedReserves;
    let listReservesFreed: DeliveryRequest[] = this.pickingProvider.freedReserves;

    this.lastCodeScanned = 'start';
    let typePacking: number = 1;
    let scannerPaused: boolean = false;
    let filtersPicking = this.pickingProvider.requestFilters;

    ScanditMatrixSimple.initPickingStores(
      (response: ResponsePickingStores) => {
        if (response && response.result && response.actionIonic) {
          let params = [];
          try{
            params = JSON.parse(response.params);
          } catch (e) {}
          switch (response.actionIonic){
            case 'lastCodeScannedStart':
              this.lastCodeScanned = 'start';
              break;
            case 'setNotProductPending':
              let typePacking = params[0];
              this.setText('No hay más productos pendientes.', this.scanditProvider.colorsMessage.info.color, 16);
              ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].press_scan_packings_to_continue);
              break;
            case 'loadProducts':
              let listProductsToStorePickings = params[0];
              let listProductsProcessed = params[1];
              let filtersPicking = params[2];
              ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, filtersPicking);
              break;
            case 'hideText':
              ScanditMatrixSimple.showText(false);
              break;
          }
        } else {
          if (!scannerPaused && response.result) {
            if (response.barcode && response.barcode.data && this.lastCodeScanned != response.barcode.data) {
              const codeScanned = response.barcode.data;
              if (this.itemReferencesProvider.checkCodeValue(codeScanned) == this.itemReferencesProvider.codeValue.PRODUCT) {
                this.lastCodeScanned = codeScanned;
                ScanditMatrixSimple.setTimeout("lastCodeScannedStart", this.timeMillisToResetScannedCode, "");
                if (listReservesToFree.length > 0) {
                  ScanditMatrixSimple.showLoadingDialog('Comprobando producto...');
                  this.pickingStoreService.postFreeReserve({productReference: codeScanned}).then((response: FreeReserveResponse) => {
                    ScanditMatrixSimple.hideLoadingDialog();
                    if(response.code == 200){
                      const freedReserve: DeliveryRequest = response.data;
                      //delete freed reserve from pending list of pending
                      for (let index = 0; index < listReservesToFree.length; index++) {
                        if (listReservesToFree[index].id == freedReserve.id && listReservesToFree[index].shippingMode == freedReserve.shippingMode) {
                          freedReserve.model = listReservesToFree[index].model;
                          freedReserve.size = listReservesToFree[index].size;
                          listReservesToFree.splice(index, 1);
                          break;
                        }
                      }
                      //add freed request to list of freed
                      listReservesFreed.push(freedReserve);
                      //other stuff
                      ScanditMatrixSimple.sendPickingStoresProducts(listReservesToFree, listReservesFreed, null);
                      this.setText(`Producto ${codeScanned} escaneado y liberado.`, this.scanditProvider.colorsMessage.info.color, 18);
                      if (listReservesToFree.length < 1) {
                        ScanditMatrixSimple.setTimeout("setNotProductPending", 2 * 1000, JSON.stringify([typePacking]));
                      }
                      this.events.publish('picking-stores:refresh');
                    }else{
                      this.setText(response.errors, this.scanditProvider.colorsMessage.error.color, 18);
                    }
                  }, (error) => {
                    ScanditMatrixSimple.hideLoadingDialog();
                    this.setText(error.error.errors, this.scanditProvider.colorsMessage.error.color, 18);
                  }).catch((error) => {
                    ScanditMatrixSimple.hideLoadingDialog();
                    this.setText(error.error.errors, this.scanditProvider.colorsMessage.error.color, 18);
                  });
                } else {
                  this.setText(this.pickingProvider.literalsJailPallet[typePacking].scan_to_end, this.scanditProvider.colorsMessage.success.color, 16);
                }
              } else {
                this.setText('Escanee un producto válido', this.scanditProvider.colorsMessage.error.color, 18);
              }
            } else {
              switch (response.action) {
                case 'matrix_simple':
                  ScanditMatrixSimple.showLoadingDialog('Cargando productos...');
                  ScanditMatrixSimple.setTimeout("loadProducts", 1000, JSON.stringify([listReservesToFree, listReservesFreed, filtersPicking]));
                  if (listReservesToFree.length < 1) {
                    ScanditMatrixSimple.setText(
                      `No hay más productos pendientes.`,
                      this.scanditProvider.colorsMessage.info.color,
                      this.scanditProvider.colorText.color,
                      16);
                    ScanditMatrixSimple.setTimeout("hideText", 2000, "");
                    ScanditMatrixSimple.hideLoadingDialog();
                    ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].press_scan_packings_to_continue);
                  }
                  break;
                case 'matrix_simple_finish':
                  ScanditMatrixSimple.finishPickingStores();
                  break;
                case 'filters':
                  filtersToGetProducts = {
                    models: response.filters.model.map(filter => {
                      return filter.id;
                    }),
                    brands: response.filters.brand.map(filter => {
                      return filter.id;
                    }),
                    colors: response.filters.color.map(filter => {
                      return filter.id;
                    }),
                    sizes: response.filters.size.map(filter => {
                      return filter.name;
                    }),
                    orderbys: response.filters.sort.map(filter => {
                      return {
                        type: filter.id,
                        order: filter.type_sort.toLowerCase()
                      };
                    })
                  };
                  const appliedFilters = {
                    models: response.filters.model.map(filter => {
                      return filter.id;
                    }),
                    brands: response.filters.brand.map(filter => {
                      return filter.name;
                    }),
                    colors: response.filters.color.map(filter => {
                      return filter.name;
                    }),
                    sizes: response.filters.size.map(filter => {
                      return filter.name;
                    }),
                    order: response.filters.sort.map(filter => {
                      return {
                        type: filter.id,
                        order: filter.type_sort.toLowerCase()
                      };
                    }),
                    types: response.filters.type.map(filter => {
                      return filter.id;
                    })
                  };
                  ScanditMatrixSimple.showLoadingDialog('Cargando productos...');
                  //filter
                  listReservesToFree = this.pickingProvider.selectedReserves.filter(request => {
                    return !(
                      appliedFilters.brands.length > 0 && !appliedFilters.brands.includes(request.model.brand.name) ||
                      appliedFilters.colors.length > 0 && !appliedFilters.colors.includes(request.model.color.name) ||
                      appliedFilters.models.length > 0 && !appliedFilters.models.includes(request.model.id) ||
                      appliedFilters.sizes.length > 0 && !appliedFilters.sizes.includes(request.size.name) ||
                      appliedFilters.types.length > 0 && !appliedFilters.types.includes(1) && !request.hasOwnProperty('shippingMode') ||
                      appliedFilters.types.length > 0 && !appliedFilters.types.includes(2) && request.hasOwnProperty('shippingMode') && request['shippingMode'] == 1 ||
                      appliedFilters.types.length > 0 && !appliedFilters.types.includes(3) && request.hasOwnProperty('shippingMode') && request['shippingMode'] == 3
                    );
                  });
                  listReservesFreed = this.pickingProvider.freedReserves.filter(request => {
                    return !(
                      appliedFilters.brands.length > 0 && !appliedFilters.brands.includes(request.model.brand.name) ||
                      appliedFilters.colors.length > 0 && !appliedFilters.colors.includes(request.model.color.name) ||
                      appliedFilters.models.length > 0 && !appliedFilters.models.includes(request.model.id) ||
                      appliedFilters.sizes.length > 0 && !appliedFilters.sizes.includes(request.size.name) ||
                      appliedFilters.types.length > 0 && !appliedFilters.types.includes(1) && !request.hasOwnProperty('shippingMode') ||
                      appliedFilters.types.length > 0 && !appliedFilters.types.includes(2) && request.hasOwnProperty('shippingMode') && request['shippingMode'] == 1 ||
                      appliedFilters.types.length > 0 && !appliedFilters.types.includes(3) && request.hasOwnProperty('shippingMode') && request['shippingMode'] == 3
                    );
                  });
                  //order
                  for (let i = appliedFilters.order.length - 1; i > -1; i--) {
                    switch (appliedFilters.order[i].type) {
                      case 1:
                        if (appliedFilters.order[i].order == 'desc') {
                          listReservesToFree = listReservesToFree.sort((a, b) => b.model.color.name.localeCompare(a.model.color.name));
                          listReservesFreed = listReservesFreed.sort((a, b) => b.model.color.name.localeCompare(a.model.color.name));
                        } else {
                          listReservesToFree = listReservesToFree.sort((a, b) => a.model.color.name.localeCompare(b.model.color.name));
                          listReservesFreed = listReservesFreed.sort((a, b) => a.model.color.name.localeCompare(b.model.color.name));
                        }
                        break;
                      case 2:
                        if (appliedFilters.order[i].order == 'desc') {
                          listReservesToFree = listReservesToFree.sort((a, b) => b.size.name.localeCompare(a.size.name));
                          listReservesFreed = listReservesFreed.sort((a, b) => b.size.name.localeCompare(a.size.name));
                        } else {
                          listReservesToFree = listReservesToFree.sort((a, b) => a.size.name.localeCompare(b.size.name));
                          listReservesFreed = listReservesFreed.sort((a, b) => a.size.name.localeCompare(b.size.name));
                        }
                        break;
                      case 3:
                        if (appliedFilters.order[i].order == 'desc') {
                          listReservesToFree = listReservesToFree.sort((a, b) => b.model.reference.localeCompare(a.model.reference));
                          listReservesFreed = listReservesFreed.sort((a, b) => b.model.reference.localeCompare(a.model.reference));
                        } else {
                          listReservesToFree = listReservesToFree.sort((a, b) => a.model.reference.localeCompare(b.model.reference));
                          listReservesFreed = listReservesFreed.sort((a, b) => a.model.reference.localeCompare(b.model.reference));
                        }
                        break;
                      case 4:
                        if (appliedFilters.order[i].order == 'desc') {
                          listReservesToFree = listReservesToFree.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
                          listReservesFreed = listReservesFreed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
                        } else {
                          listReservesToFree = listReservesToFree.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
                          listReservesFreed = listReservesFreed.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
                        }
                        break;
                      case 5:
                        if (appliedFilters.order[i].order == 'desc') {
                          listReservesToFree = listReservesToFree.sort((a, b) => b.model.brand.name.localeCompare(a.model.brand.name));
                          listReservesFreed = listReservesFreed.sort((a, b) => b.model.brand.name.localeCompare(a.model.brand.name));
                        } else {
                          listReservesToFree = listReservesToFree.sort((a, b) => a.model.brand.name.localeCompare(b.model.brand.name));
                          listReservesFreed = listReservesFreed.sort((a, b) => a.model.brand.name.localeCompare(b.model.brand.name));
                        }
                        break;
                      case 6:
                        if (appliedFilters.order[i].order == 'desc') {
                          listReservesToFree = listReservesToFree.sort((a, b) => b.model.name.localeCompare(a.model.name));
                          listReservesFreed = listReservesFreed.sort((a, b) => b.model.name.localeCompare(a.model.name));
                        } else {
                          listReservesToFree = listReservesToFree.sort((a, b) => a.model.name.localeCompare(b.model.name));
                          listReservesFreed = listReservesFreed.sort((a, b) => a.model.name.localeCompare(b.model.name));
                        }
                        break;
                    }
                  }
                  ScanditMatrixSimple.hideLoadingDialog();
                  ScanditMatrixSimple.sendPickingStoresProducts(listReservesToFree, listReservesFreed, null);
                  this.events.publish('picking-stores:refresh');
                  break;
              }
            }
          }
        }
      },
      'Liberar Reservas',
      this.scanditProvider.colorsHeader.background.color,
      this.scanditProvider.colorsHeader.color.color,
      'Escanea los productos a liberar',
      environment.urlBase
    );

  }

  private setText(message, color, code){
    ScanditMatrixSimple.setText(
      message,
      color,
      this.scanditProvider.colorText.color,
      code
    );
    ScanditMatrixSimple.setTimeout("hideText", 2000, "");
  }

}
