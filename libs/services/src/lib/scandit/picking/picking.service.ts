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
    let listProductsToStorePickings = this.pickingProvider.listProductsToStorePickings;
    let lastCodeScanned: string = 'start';
    let typePacking: number = 1;
    let scannerPaused: boolean = false;
    let scanMode = 'products';

    const textPickingStoresInit = listProductsToStorePickings.length == 0 ? this.pickingProvider.literalsJailPallet[typePacking].scan_packings_to_end : 'Escanea los productos a incluir en el picking';

    ScanditMatrixSimple.initPickingStores((response: ScanditModel.ResponsePickingStores) => {
      if (!scannerPaused && response.result) {
        if (response.barcode && response.barcode.data && lastCodeScanned != response.barcode.data) {
          let codeScanned = response.barcode.data;
          if(scanMode == 'products'){
            if(this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PRODUCT){
              lastCodeScanned = codeScanned;
              if (listProductsToStorePickings.length > 0) {
                let paramsPickingStoreProcess: PickingStoreModel.SendProcess = {
                  productReference: codeScanned
                };
                this.pickingStoreService
                  .postPickingStoreProcess(paramsPickingStoreProcess)
                  .subscribe((res: PickingStoreModel.ResponseSendProcess) => {
                    if (res.code == 200 || res.code == 201) {
                      listProductsToStorePickings = res.data.linesRequestPending.results;
                      ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings);
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
                      this.loadLineRequestsPending(listProductsToStorePickings, typePacking);
                    }
                  }, (error) => {
                    ScanditMatrixSimple.setText(
                      error.error.errors,
                      this.scanditProvider.colorsMessage.error.color,
                      this.scanditProvider.colorText.color,
                      18);
                    this.hideTextMessage(2000);
                    this.loadLineRequestsPending(listProductsToStorePickings, typePacking);
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
            ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings);
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
            ScanditMatrixSimple.sendPickingStoresProducts([]);
            ScanditMatrixSimple.showButtonPickingStorePacking(false);
            ScanditMatrixSimple.showButtonPickingStoreFinish(true);
            ScanditMatrixSimple.setTextPickingStores(true, `Escanee los embalajes a usar en el picking`);
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
          }
        }
      }
    }, 'Picking', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color, textPickingStoresInit);
  }

  private loadLineRequestsPending(listProductsToStorePickings: StoresLineRequestsModel.LineRequests[], typePacking: number) {
    this.pickingStoreService
      .getLineRequestsPending()
      .subscribe((res: PickingStoreModel.ResponseLineRequestsPending) => {
        if (res.code == 200 || res.code == 201) {
          listProductsToStorePickings = res.data.results;
          ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings);
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
          ScanditMatrixSimple.setTextPickingStores(true, `Escanee nuevamente los embalajes a usar en el picking`);
        }
      }, (error) => {
        ScanditMatrixSimple.setText(
          error.error.errors,
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          18);
        this.hideTextMessage(2000);
        this.packingReferences = [];
        ScanditMatrixSimple.setTextPickingStores(true, `Escanee nuevamente los embalajes a usar en el picking`);
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
