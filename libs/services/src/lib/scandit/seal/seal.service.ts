import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {CarriersService} from "../../endpoint/carriers/carriers.service";
import {CarrierModel} from "../../../models/endpoints/Carrier";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class SealScanditService {

  private timeoutHideText;

  constructor(
    private carriersService: CarriersService,
    private scanditProvider: ScanditProvider
  ) {}

  async seal() {
    let lastCodeScanned: string = 'start';
    let codeScanned: string = null;

    ScanditMatrixSimple.init((response: ScanditModel.ResponseSimple) => {
      if (response && response.result) {
        if (response.barcode && response.barcode.data != lastCodeScanned) {
          codeScanned = response.barcode.data;
          lastCodeScanned = codeScanned;

          if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.JAIL
            || this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PALLET) {
            // TODO Seal the packing
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


