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

  constructor(
    private events: Events,
    private pickingStoreService: PickingStoreService,
    private scanditProvider: ScanditProvider,
    private pickingProvider: PickingProvider
  ) {}

  async picking() {
    let listProductsToStorePickings = this.pickingProvider.listProductsToStorePickings;
    let lastCodeScanned: string = 'start';
    let processStarted: boolean = false;
    let typePacking: number = 1;
    let referencePacking: string = null;
    let scannerPaused: boolean = false;

    ScanditMatrixSimple.initPickingStores((response: ScanditModel.ResponsePickingStores) => {
      if (!scannerPaused && response.result) {
        if (response.barcode && response.barcode.data && lastCodeScanned != response.barcode.data) {
          let codeScanned = response.barcode.data;

          switch (this.scanditProvider.checkCodeValue(codeScanned)) {
            case this.scanditProvider.codeValue.PALLET:
            case this.scanditProvider.codeValue.JAIL:
              lastCodeScanned = codeScanned;
              if (!processStarted) {
                if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.JAIL) {
                  typePacking = 1;
                } else {
                  typePacking = 2;
                }
                this.pickingStoreService
                  .postCheckPacking({
                    packingReference: codeScanned
                  })
                  .subscribe((res: PickingStoreModel.ResponseCheckPacking) => {
                    if (res.code == 200 || res.code == 201) {
                      referencePacking = codeScanned;
                      processStarted = true;

                      ScanditMatrixSimple.setText(
                        `${this.pickingProvider.literalsJailPallet[typePacking].process_started}${referencePacking}.`,
                        this.scanditProvider.colorsMessage.info.color,
                        this.scanditProvider.colorText.color,
                        18);
                      this.hideTextMessage(2000);

                      ScanditMatrixSimple.setTextPickingStores(true, "Escanea los productos a incluir en el picking");
                    } else {
                      console.error('Error Subscribe::Check Packing Reference::', res);
                      ScanditMatrixSimple.setText(
                        res.message,
                        this.scanditProvider.colorsMessage.error.color,
                        this.scanditProvider.colorText.color,
                        16);
                      this.hideTextMessage(1500);
                    }
                  }, (error) => {
                    console.error('Error Subscribe::Check Packing Reference::', error);
                    ScanditMatrixSimple.setText(
                      error.error.errors,
                      this.scanditProvider.colorsMessage.error.color,
                      this.scanditProvider.colorText.color,
                      16);
                    this.hideTextMessage(1500);
                  });
              } else if (referencePacking != codeScanned) {
                ScanditMatrixSimple.setText(
                  this.pickingProvider.literalsJailPallet[typePacking].wrong_process_finished,
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  18);
                this.hideTextMessage(2000);
              } else {
                const scanUnlockTimeout = setTimeout(() => { scannerPaused = false; }, 10 * 1000);
                try {
                  this.finishPicking();
                } catch (e) {
                  scannerPaused = false;
                  clearTimeout(scanUnlockTimeout);
                  throw e;
                }
              }
              break;
            case this.scanditProvider.codeValue.PRODUCT:
              if (!processStarted) {
                ScanditMatrixSimple.setText(
                  this.pickingProvider.literalsJailPallet[typePacking].scan_before_products,
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  18);
                this.hideTextMessage(2000);
              } else {
                lastCodeScanned = codeScanned;
                if (listProductsToStorePickings.length > 0) {
                  let paramsPickingStoreProcess: PickingStoreModel.SendProcess = {
                    packingReference: referencePacking,
                    productReference: codeScanned,
                    warehouseIds: this.pickingProvider.listStoresIdsToStorePicking
                  };
                  this.pickingStoreService
                    .postPickingStoreProcess(paramsPickingStoreProcess)
                    .subscribe((res: PickingStoreModel.ResponseSendProcess) => {
                      if (res.code == 200 || res.code == 201) {
                        listProductsToStorePickings = res.data.linesRequestPending;
                        ScanditMatrixSimple.setText(
                          `Producto ${codeScanned} escaneado y añadido ${this.pickingProvider.literalsJailPallet[typePacking].toThe}.`,
                          this.scanditProvider.colorsMessage.info.color,
                          this.scanditProvider.colorText.color,
                          18);
                        this.hideTextMessage(2000);
                        if (listProductsToStorePickings.length < 1) {
                          setTimeout(() => {
                            ScanditMatrixSimple.setText(
                              this.pickingProvider.literalsJailPallet[typePacking].scan_to_end,
                              this.scanditProvider.colorsMessage.success.color,
                              this.scanditProvider.colorText.color,
                              16);
                            this.hideTextMessage(1500);
                            ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].scan_packing_to_end);
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
              }
              break;
          }
        } else {
          if (response.action == 'matrix_simple') {
            ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings);
            if (listProductsToStorePickings.length < 1) {
              ScanditMatrixSimple.setText(
                this.pickingProvider.literalsJailPallet[typePacking].scan_to_end,
                this.scanditProvider.colorsMessage.success.color,
                this.scanditProvider.colorText.color,
                16);
              this.hideTextMessage(1500);
              ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].scan_packing_to_end);
            }
          } else if (response.action == 'matrix_simple_finish_picking') {
            this.finishPicking();
          }
        }
      }
    }, 'Picking', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color);
  }

  private loadLineRequestsPending(listProductsToStorePickings: StoresLineRequestsModel.LineRequests[], typePacking: number) {
    this.pickingStoreService
      .getLineRequestsPending()
      .subscribe((res: PickingStoreModel.ResponseLineRequestsPending) => {
        if (res.code == 200 || res.code == 201) {
          listProductsToStorePickings = res.data;
          if (listProductsToStorePickings.length < 1) {
            setTimeout(() => {
              ScanditMatrixSimple.setText(
                this.pickingProvider.literalsJailPallet[typePacking].scan_to_end,
                this.scanditProvider.colorsMessage.success.color,
                this.scanditProvider.colorText.color,
                16);
              this.hideTextMessage(1500);
              ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].scan_packing_to_end);
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
      .postPickingStoreChangeStatus({
        status: 3,
        warehouseIds: this.pickingProvider.listStoresIdsToStorePicking
      })
      .subscribe((res: PickingStoreModel.ResponseChangeStatus) => {
        if (res.code == 200 || res.code == 201) {
          ScanditMatrixSimple.finishPickingStores();
        } else {
          console.error('Error Subscribe::Change status for picking-store::', res);
        }
      }, (error) => {
        console.error('Error Subscribe::Change status for picking-store::', error);
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
