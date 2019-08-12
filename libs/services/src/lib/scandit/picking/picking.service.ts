import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {PickingProvider} from "../../../providers/picking/picking.provider";
import {PickingStoreService} from "../../endpoint/picking-store/picking-store.service";
import {PickingStoreModel} from "../../../models/endpoints/PickingStore";
import {StoresLineRequestsModel} from "../../../models/endpoints/StoresLineRequests";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {Events} from "@ionic/angular";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class PickingScanditService {

  private timeoutHideText;
  private packingReferences: string[] = [];

  constructor(
    private events: Events,
    private pickingStoreService: PickingStoreService,
    private scanditProvider: ScanditProvider,
    private pickingProvider: PickingProvider
  ) {}

  async picking() {
    let filtersToGetProducts: PickingStoreModel.ParamsFiltered = {
      orderbys: [],
      sizes: [],
      colors: [],
      models: [],
      brands: []
    };
    let listProductsToStorePickings = this.pickingProvider.listProductsToStorePickings;
    let listProductsProcessed = this.pickingProvider.listProductsProcessedToStorePickings;
    let lastCodeScanned: string = 'start';
    let typePacking: number = 1;
    let scannerPaused: boolean = false;
    let scanMode = 'products';
    let filtersPicking = this.pickingProvider.listFiltersPicking;

    const textPickingStoresInit = listProductsToStorePickings.length == 0 ? this.pickingProvider.literalsJailPallet[typePacking].scan_packings_to_end : 'Escanea los productos a incluir';

    ScanditMatrixSimple.initPickingStores((response: ScanditModel.ResponsePickingStores) => {
      if (!scannerPaused && response.result) {
        if (response.barcode && response.barcode.data && lastCodeScanned != response.barcode.data) {
          let codeScanned = response.barcode.data;
          if(scanMode == 'products'){
            if(this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PRODUCT){
              lastCodeScanned = codeScanned;
              if (listProductsToStorePickings.length > 0) {
                let paramsPickingStoreProcess: PickingStoreModel.SendProcess = {
                  productReference: codeScanned,
                  filters: filtersToGetProducts
                };
                this.pickingStoreService
                  .postPickingStoreProcess(paramsPickingStoreProcess)
                  .subscribe((res: PickingStoreModel.ResponseSendProcess) => {
                    if (res.code == 200 || res.code == 201) {
                      listProductsToStorePickings = res.data.linesRequestFiltered.pending;
                      listProductsProcessed = res.data.linesRequestFiltered.processed;
                      ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
                      ScanditMatrixSimple.setText(
                        `Producto ${codeScanned} escaneado y añadido al picking.`,
                        this.scanditProvider.colorsMessage.info.color,
                        this.scanditProvider.colorText.color,
                        18);
                      this.hideTextMessage(2000);
                      if (listProductsToStorePickings.length < 1) {
                        setTimeout(() => {
                          ScanditMatrixSimple.setText(
                            `No hay más productos pendientes de añadir al picking.`,
                            this.scanditProvider.colorsMessage.info.color,
                            this.scanditProvider.colorText.color,
                            16);
                          this.hideTextMessage(1500);
                          ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].scan_packings_to_end);
                        }, 2 * 1000);
                      }
                      this.refreshListPickingsStores();
                    } else {
                      ScanditMatrixSimple.setText(
                        res.message,
                        this.scanditProvider.colorsMessage.error.color,
                        this.scanditProvider.colorText.color,
                        18);
                      this.hideTextMessage(2000);
                      this.loadLineRequestsPending(listProductsToStorePickings, listProductsProcessed, filtersToGetProducts, typePacking);
                    }
                  }, (error) => {
                    ScanditMatrixSimple.setText(
                      error.error.errors,
                      this.scanditProvider.colorsMessage.error.color,
                      this.scanditProvider.colorText.color,
                      18);
                    this.hideTextMessage(2000);
                    this.loadLineRequestsPending(listProductsToStorePickings, listProductsProcessed, filtersToGetProducts, typePacking);
                  });
              } else {
                ScanditMatrixSimple.setText(
                  this.pickingProvider.literalsJailPallet[typePacking].scan_to_end,
                  this.scanditProvider.colorsMessage.success.color,
                  this.scanditProvider.colorText.color,
                  16);
                this.hideTextMessage(1500);
              }
            } else {
              ScanditMatrixSimple.setText(
                `Escanee un producto válido`,
                this.scanditProvider.colorsMessage.error.color,
                this.scanditProvider.colorText.color,
                18);
              this.hideTextMessage(2000);
            }
          } else if (scanMode == 'carriers') {
            if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.JAIL
              || this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PALLET) {
              this.packingReferences.push(codeScanned);
              ScanditMatrixSimple.setText(
                `Escaneado embalaje ${codeScanned} para añadir al picking`,
                this.scanditProvider.colorsMessage.info.color,
                this.scanditProvider.colorText.color,
                18);
              this.hideTextMessage(1500);
            } else {
              ScanditMatrixSimple.setText(
                `Escanee un embalaje válido`,
                this.scanditProvider.colorsMessage.error.color,
                this.scanditProvider.colorText.color,
                18);
              this.hideTextMessage(2000);
            }
          }

        } else {
          if (response.action == 'matrix_simple') {
            setTimeout(() => {
              ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, filtersPicking);
            }, 1 * 1000);
            if (listProductsToStorePickings.length < 1) {
              ScanditMatrixSimple.setText(
                `No hay más productos pendientes de añadir al picking.`,
                this.scanditProvider.colorsMessage.info.color,
                this.scanditProvider.colorText.color,
                16);
              this.hideTextMessage(1500);
              ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].scan_packings_to_end);
            }
          } else if (response.action == 'matrix_simple_scan_packings') {
            ScanditMatrixSimple.showButtonPickingStorePacking(false);
            ScanditMatrixSimple.showButtonPickingStoreFinish(true);
            ScanditMatrixSimple.setTextPickingStores(true, `Escanee los embalajes a usar`);
            scanMode = 'carriers';
            this.packingReferences = [];
          } else if (response.action == 'matrix_simple_finish_picking') {
            if(this.packingReferences.length == 0){
              ScanditMatrixSimple.setText(
                `Añada al menos un embalaje al picking`,
                this.scanditProvider.colorsMessage.error.color,
                this.scanditProvider.colorText.color,
                18);
              this.hideTextMessage(2000);
            } else {
              this.finishPicking();
            }
          } else if (response.action == 'filters') {
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
            this.pickingStoreService
              .postLineRequestFiltered(filtersToGetProducts)
              .subscribe((res: PickingStoreModel.ResponseLineRequestsFiltered) => {
                if (res.code == 200) {
                  listProductsToStorePickings = res.data.pending;
                  listProductsProcessed = res.data.processed;
                  ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
                  this.refreshListPickingsStores();
                }
              });
          }
        }
      }
    }, 'Picking', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color, textPickingStoresInit);
  }

  private loadLineRequestsPending(listProductsToStorePickings: StoresLineRequestsModel.LineRequests[], listProductsProcessed: StoresLineRequestsModel.LineRequests[], filtersToGetProducts: PickingStoreModel.ParamsFiltered, typePacking: number) {
    this.pickingStoreService
      .postLineRequestFiltered(filtersToGetProducts)
      .subscribe((res: PickingStoreModel.ResponseLineRequestsFiltered) => {
        if (res.code == 200 || res.code == 201) {
          listProductsToStorePickings = res.data.pending;
          listProductsProcessed = res.data.processed;
          ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
          if (listProductsToStorePickings.length < 1) {
            setTimeout(() => {
              ScanditMatrixSimple.setText(
                `No hay más productos pendientes de añadir al picking.`,
                this.scanditProvider.colorsMessage.info.color,
                this.scanditProvider.colorText.color,
                16);
              this.hideTextMessage(1500);
              ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].scan_packings_to_end);
            }, 2 * 1000);
          }
          this.refreshListPickingsStores();
        }
      });
  }

  private finishPicking() {
    ScanditMatrixSimple.setText(
      'Finalizando proceso...',
      this.scanditProvider.colorsMessage.info.color,
      this.scanditProvider.colorText.color,
      18);
    this.pickingStoreService
      .postPackings({
        packingReferences: this.packingReferences
      })
      .subscribe((res: PickingStoreModel.ResponsePostPacking) => {
        if (res.code == 200 || res.code == 201) {
          ScanditMatrixSimple.finishPickingStores();
          this.refreshListPickingsStores();
        } else {
          ScanditMatrixSimple.setText(
            res.message,
            this.scanditProvider.colorsMessage.error.color,
            this.scanditProvider.colorText.color,
            18);
          this.hideTextMessage(2000);
          this.packingReferences = [];
          ScanditMatrixSimple.setTextPickingStores(true, `Escanee de nuevo los embalajes a usar`);
        }
      }, (error) => {
        ScanditMatrixSimple.setText(
          error.error.errors,
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          18);
        this.hideTextMessage(2000);
        this.packingReferences = [];
        ScanditMatrixSimple.setTextPickingStores(true, `Escanee de nuevo los embalajes a usar`);
      });
  }

  private refreshListPickingsStores() {
    this.events.publish('picking-stores:refresh');
  }

  private hideTextMessage(delay: number){
    if(this.timeoutHideText){
      clearTimeout(this.timeoutHideText);
    }
    this.timeoutHideText = setTimeout(() => {
      ScanditMatrixSimple.showText(false);
    }, delay);
  }

}
