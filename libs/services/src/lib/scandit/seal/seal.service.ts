import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {CarriersService} from "../../endpoint/carriers/carriers.service";
import {CarrierModel} from "../../../models/endpoints/Carrier";
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class SealScanditService {

  private timeoutHideText;

  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private carriersService: CarriersService,
    private scanditProvider: ScanditProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
  }

  async seal() {
    let lastCodeScanned: string = 'start';
    let codeScanned: string = null;
    let timeoutStarted = null;

    ScanditMatrixSimple.init((response: ScanditModel.ResponseSimple) => {
      if (response && response.result) {
        if (response.barcode && response.barcode.data != lastCodeScanned) {
          codeScanned = response.barcode.data;
          lastCodeScanned = codeScanned;

          if (timeoutStarted) {
            clearTimeout(timeoutStarted);
          }
          timeoutStarted = setTimeout(() => lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

          if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.JAIL
            || this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PALLET) {
            // Seal the packing
            this.carriersService
              .postSeal({
                reference: codeScanned
              })
              .subscribe((res: CarrierModel.ResponseSeal) => {
                if (res.code == 200) {
                  let msgOk = 'El recipiente';
                  if (res.data.packingType == 1) {
                    msgOk = 'La jaula';
                  } else if (res.data.packingType == 2) {
                    msgOk = 'El pallet';
                  }
                  msgOk += ' se ha precintado correctamente.';
                  ScanditMatrixSimple.setText(
                    msgOk,
                    this.scanditProvider.colorsMessage.success.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(1500);
                } else {
                  ScanditMatrixSimple.setText(
                    'Ha ocurrido un error al intentar precintar el recipiente.',
                    this.scanditProvider.colorsMessage.error.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(1500);
                }
              }, (error) => {
                ScanditMatrixSimple.setText(
                  'Ha ocurrido un error al intentar precintar el recipiente.',
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  16);
                this.hideTextMessage(1500);
              });
          } else {
            ScanditMatrixSimple.setText(
              'El código escaneado no es válido para la operación que se espera realizar.',
              this.scanditProvider.colorsMessage.error.color,
              this.scanditProvider.colorText.color,
              16);
            this.hideTextMessage(1500);
          }
        } else {
          if (response.action == 'matrix_simple') {
            ScanditMatrixSimple.showFixedTextBottom(true, 'Escanea el recipiente a precintar.');
          }
        }
      }
    }, 'Precintar', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color);
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


