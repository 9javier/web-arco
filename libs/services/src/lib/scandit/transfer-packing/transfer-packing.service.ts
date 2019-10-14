import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {SettingsService} from "../../storage/settings/settings.service";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {Events} from "@ionic/angular";
import {CarriersService} from "../../endpoint/carriers/carriers.service";
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";

declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class TransferPackingScanditService {

  private EXIT_FROM_SCANDIT: string = 'exit_from_scandit';
  private timeoutHideText;

  private isProcessStarted: boolean = false;
  private packingReferenceOrigin: string = null;
  private lastCodeScanned: string = 'start';

  private disableTransferProductByProduct: boolean = true;

  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private events: Events,
    private settingsService: SettingsService,
    private carriersService: CarriersService,
    private scanditProvider: ScanditProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
  }

  async transfer() {
    let timeoutStarted = null;

    ScanditMatrixSimple.initSwitchToIonic((res: ScanditModel.ResponseSwitchToIonic) => {
      if (res) {
        if (res.barcode) {
          this.settingsService.saveDeviceSettings({ transferPackingLastMethod: 'scandit' });

          let codeScanned = res.barcode.data;

          if (codeScanned != this.lastCodeScanned) {
            this.lastCodeScanned = codeScanned;

            if (timeoutStarted) {
              clearTimeout(timeoutStarted);
            }
            timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

            if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.JAIL
              || this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PALLET) {
              if (this.isProcessStarted) {
                this.transferAmongPackings(codeScanned);
              } else {
                ScanditMatrixSimple.showLoadingDialog('Iniciando proceso...');
                setTimeout(() => {
                  ScanditMatrixSimple.hideLoadingDialog();
                  this.isProcessStarted = true;
                  this.packingReferenceOrigin = codeScanned;
                  let mainText = this.disableTransferProductByProduct ? 'Escanea el embalaje de destino' : 'Escanea los productos a traspasar';
                  ScanditMatrixSimple.setMainTextSwitchToIonic(true, mainText);
                  ScanditMatrixSimple.setOriginTextSwitchToIonic(true, codeScanned);
                }, 0.5 * 1000);
              }
            } else if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PRODUCT
              || this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PRODUCT_MODEL) {
              if (this.isProcessStarted) {
                if (this.disableTransferProductByProduct) {
                  ScanditMatrixSimple.setText(
                    'Funcionalidad de traspaso de producto por producto no disponible actualmente.',
                    this.scanditProvider.colorsMessage.error.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(1500);
                }
              } else {
                ScanditMatrixSimple.setText(
                  'El código escaneado no es válido para la operación que se espera realizar.',
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  16);
                this.hideTextMessage(1500);
              }
            } else {
              ScanditMatrixSimple.setText(
                'El código escaneado no es válido para la operación que se espera realizar.',
                this.scanditProvider.colorsMessage.error.color,
                this.scanditProvider.colorText.color,
                16);
              this.hideTextMessage(1500);
            }
          }
        } else if (res.action) {
          if (res.action == 'matrix_simple') {
            // Scandit started
            ScanditMatrixSimple.setMainTextSwitchToIonic(true, 'Escanea el embalaje de origen');
          } else if (res.action == 'exit') {
            this.events.publish(this.EXIT_FROM_SCANDIT);
          }
        }
      }
    }, 'Traspaso', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color);
  }

  private transferAmongPackings(destinyPacking) {
    ScanditMatrixSimple.showLoadingDialog('Traspasando productos...');
    this.carriersService
      .postTransferAmongPackings({ origin: this.packingReferenceOrigin, destiny: destinyPacking })
      .then(() => {
        ScanditMatrixSimple.hideLoadingDialog();
        ScanditMatrixSimple.setText(
          'Traspaso de productos entre embalajes realizado.',
          this.scanditProvider.colorsMessage.success.color,
          this.scanditProvider.colorText.color,
          16);
        this.hideTextMessage(1500);
        this.packingReferenceOrigin = null;
        this.isProcessStarted = false;
        this.lastCodeScanned = 'start';
        ScanditMatrixSimple.setMainTextSwitchToIonic(true, 'Escanea el embalaje de origen');
        ScanditMatrixSimple.setOriginTextSwitchToIonic(false, null);
      }, (error) => {
        ScanditMatrixSimple.hideLoadingDialog();
        console.error('Error::Subscribe:carriersService::postTransferAmongPackings::', error);
        ScanditMatrixSimple.setText(
          'Ha ocurrido un error al intentar realizar el traspaso de productos entre embalajes.',
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          16);
      })
      .catch((error) => {
        ScanditMatrixSimple.hideLoadingDialog();
        console.error('Error::Subscribe:carriersService::postTransferAmongPackings::', error);
        ScanditMatrixSimple.setText(
          'Ha ocurrido un error al intentar realizar el traspaso de productos entre embalajes.',
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          16);
      });
  }

  private hideTextMessage(delay: number) {
    if (this.timeoutHideText) {
      clearTimeout(this.timeoutHideText);
    }
    this.timeoutHideText = setTimeout(() => {
      ScanditMatrixSimple.showText(false);
    }, delay);
  }

}


