import {Injectable} from '@angular/core';
import {InventoryService} from "../../endpoint/inventory/inventory.service";
import {WarehouseService} from "../../endpoint/warehouse/warehouse.service";
import {AuthenticationService} from "../../endpoint/authentication/authentication.service";
import {AlertController, Events} from "@ionic/angular";
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {ReceptionService} from "../../endpoint/process/reception/reception.service";
import {InventoryModel, WarehouseModel} from "@suite/services";
import {ReceptionModel} from "../../../models/endpoints/Reception";
import {ReceptionProvider} from "../../../providers/reception/reception.provider";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class ReceptionScanditService {

  private timeoutHideText;
  private scannerPaused: boolean = false;
  private userWarehouse: WarehouseModel.Warehouse;

  constructor(
    private alertController: AlertController,
    private auth: AuthenticationService,
    private events: Events,
    private inventoryService: InventoryService,
    private warehouseService: WarehouseService,
    private authenticationService: AuthenticationService,
    private receptionService: ReceptionService,
    private scanditProvider: ScanditProvider,
    private receptionProvider: ReceptionProvider
  ) {}

  async reception() {
    this.userWarehouse = await this.authenticationService.getWarehouseCurrentUser();
    let lastCodeScanned: string = 'start';
    this.receptionProvider.resumeProcessStarted = false;

    ScanditMatrixSimple.init((response) => {
      let code = '';

      if (response) {
        if (response.barcode) {
          code = response.barcode.data;

          if (!this.scannerPaused && code != lastCodeScanned) {
            lastCodeScanned = code;
            this.scannerPaused = true;
            switch (this.scanditProvider.checkCodeValue(code)) {
              case this.scanditProvider.codeValue.JAIL:
              case this.scanditProvider.codeValue.PALLET:
                setTimeout(() => {
                  lastCodeScanned = 'start';
                }, 2 * 1000);
                if (this.scanditProvider.checkCodeValue(code) == this.scanditProvider.codeValue.JAIL) {
                  this.receptionProvider.typePacking = 1;
                } else {
                  this.receptionProvider.typePacking = 2;
                }

                if (!this.receptionProvider.processStarted) {
                  // TODO validate packing
                  this.receptionProvider.processStarted = true;
                  this.receptionProvider.referencePacking = code;
                  this.receptionProvider.resumeProcessStarted = true;

                  ScanditMatrixSimple.showFixedTextBottom(true, this.receptionProvider.literalsJailPallet.next_steps);

                  ScanditMatrixSimple.setText(
                    `${this.receptionProvider.literalsJailPallet.reception_started}${code}`,
                    this.scanditProvider.colorsMessage.success.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(1500);
                  setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
                } else {
                  if (code == this.receptionProvider.referencePacking) {
                    if (this.receptionProvider.qtyProductsReceived > 0) {
                      this.setPackingAsReceived(code);
                    } else {
                      this.notifyReceptionAllProducts(code);
                    }
                  } else {
                    let message = '';
                    if (this.receptionProvider.resumeProcessStarted) {
                      message = this.receptionProvider.literalsJailPallet.wrong_packing_finish;
                    } else {
                      message = this.receptionProvider.literalsJailPallet.wrong_packing_resume;
                    }
                    ScanditMatrixSimple.setText(
                      this.receptionProvider.literalsJailPallet.wrong_packing_resume,
                      this.scanditProvider.colorsMessage.error.color,
                      this.scanditProvider.colorText.color,
                      16);
                    this.hideTextMessage(1500);
                    setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
                  }
                }
                break;
              case this.scanditProvider.codeValue.PRODUCT:
                if (!this.receptionProvider.processStarted) {
                  ScanditMatrixSimple.setText(
                    'Escanea primero la jaula o pallet recibido para iniciar el proceso.',
                    this.scanditProvider.colorsMessage.info.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(2000);
                  setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
                } else {
                  this.setProductAsReceived(code);
                }
                break;
              default:
                ScanditMatrixSimple.setText(
                  'Necesita escanear un código de Jaula o Pallet para hacer una recepción.',
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  18);
                this.hideTextMessage(1500);
                setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
            }
          }
        } else if (response.action) {
          switch (response.action) {
            case 'matrix_simple':
              if (this.receptionProvider.processStarted) {
                if (this.receptionProvider.resumeProcessStarted) {
                  ScanditMatrixSimple.showFixedTextBottom(true, this.receptionProvider.literalsJailPallet.next_steps);
                } else {
                  ScanditMatrixSimple.showFixedTextBottom(true, this.receptionProvider.literalsJailPallet.reception_resumed);
                }
              }
              break;
            default:
              break;
          }
        }
      }
    }, 'Recepción', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color);
  }

  private setProductAsReceived(referenceProduct: string) {
    let warehouseId = this.userWarehouse ? this.userWarehouse.id : this.warehouseService.idWarehouseMain;
    let params: any = {
      productReference: referenceProduct,
      warehouseId: warehouseId
    };

    if (this.receptionProvider.alwaysForceReception) {
      params.force = true;
    }
    this.inventoryService.postStore(params).then((data: Observable<HttpResponse<InventoryModel.ResponseStore>>) => {
      data.subscribe((res: HttpResponse<InventoryModel.ResponseStore>) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.receptionProvider.qtyProductsReceived++;
            ScanditMatrixSimple.setText(
              `Producto ${params.productReference} añadido al almacén ${this.userWarehouse.name}`,
              this.scanditProvider.colorsMessage.success.color,
              this.scanditProvider.colorText.color,
              18);
            this.hideTextMessage(1500);
          } else if (res.body.code == 428 && !this.receptionProvider.alwaysForceReception) {
            this.scannerPaused = true;
            ScanditMatrixSimple.showWarningToForce(true, referenceProduct);
          } else {
            let errorMessage = '';
            if (res.body.errors.productReference && res.body.errors.productReference.message) {
              errorMessage = res.body.errors.productReference.message;
            } else {
              errorMessage = res.body.message;
            }
            ScanditMatrixSimple.setText(
              errorMessage,
              this.scanditProvider.colorsMessage.error.color,
              this.scanditProvider.colorText.color,
              18);
            this.hideTextMessage(1500);
          }
        }, (error) => {
          if (error.error.code == 428 && !this.receptionProvider.alwaysForceReception) {
            this.scannerPaused = true;
            ScanditMatrixSimple.showWarningToForce(true, referenceProduct);
          } else {
            ScanditMatrixSimple.setText(
              error.error.errors,
              this.scanditProvider.colorsMessage.error.color,
              this.scanditProvider.colorText.color,
              18);
            this.hideTextMessage(1500);
          }
        }
      );
    }, (error: HttpErrorResponse) => {
      if (error.error.code == 428 && !this.receptionProvider.alwaysForceReception) {
        this.scannerPaused = true;
        ScanditMatrixSimple.showWarningToForce(true, referenceProduct);
      } else {
        ScanditMatrixSimple.setText(
          error.message,
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          18);
        this.hideTextMessage(1500);
      }
    });
  }

  private notifyReceptionAllProducts(packingReference: string) {
    this.presentAlert(
      this.receptionProvider.literalsJailPallet.warning_reception_all,
      this.setPackingAsReceived(packingReference)
    );
  }

  private setPackingAsReceived(packingReference: string) {
    this.receptionService
      .postReceive({
        packingReference: packingReference,
        quantityProducts: this.receptionProvider.qtyProductsReceived
      })
      .subscribe((res: ReceptionModel.ResponseReceive) => {
        if (res.code == 200 || res.code == 201) {
          ScanditMatrixSimple.showFixedTextBottom(false, '');
          this.receptionProvider.referencePacking = null;
          this.receptionProvider.typePacking = 0;
          this.receptionProvider.processStarted = false;

          ScanditMatrixSimple.setText(
            `${this.receptionProvider.literalsJailPallet.reception_finished}${res.data.quantity} productos`,
            this.scanditProvider.colorsMessage.success.color,
            this.scanditProvider.colorText.color,
            16);
          this.hideTextMessage(1500);
          setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
        } else {
          ScanditMatrixSimple.setText(
            res.errors,
            this.scanditProvider.colorsMessage.error.color,
            this.scanditProvider.colorText.color,
            16);
          this.hideTextMessage(2000);
          setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
        }
      }, (error) => {
        ScanditMatrixSimple.setText(
          error.error.errors,
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          16);
        this.hideTextMessage(2000);
        setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
      });
  }

  // TODO integrar alert en android
  private async presentAlert(message: string, callbackOk) {
    const alertWarning = await this.alertController.create({
      header: 'Atención',
      subHeader: message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => this.scannerPaused = false
        },
        {
          text: 'Continuar',
          handler: callbackOk
        }]
    });

    return await alertWarning.present();
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
