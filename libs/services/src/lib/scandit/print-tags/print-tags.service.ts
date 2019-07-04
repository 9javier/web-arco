import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {PrinterService} from "../../printer/printer.service";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class PrintTagsScanditService {

  private typeTags: 1|2 = 1;
  private timeoutHideText;

  constructor(
    private printerService: PrinterService,
    private scanditProvider: ScanditProvider
  ) {}

  printTagsReferences() {
    this.typeTags = 1;
    this.initPrintTags();
  }

  printTagsPrices() {
    this.typeTags = 2;
    this.initPrintTags();
  }

  private initPrintTags() {
    let scannedPaused: boolean = false;
    let lastCodeScanned: string = 'start';
    let codeScanned: string = null;
    ScanditMatrixSimple.initPrintTags((response: ScanditModel.ResponsePrintTags) => {
      if (response && response.result) {
        // Lock scan same code two times
        if (response.barcode && response.barcode.data != lastCodeScanned) {

        // Lock scan in less than two seconds
        /*if (!scannedPaused) {
          scannedPaused = true;
          setTimeout(() => scannedPaused = false, 2 * 1000);*/

          codeScanned = response.barcode.data;
          lastCodeScanned = codeScanned;

          if (codeScanned.length == 18) {
            switch (this.typeTags) {
              case 1:
                this.printerService.printTagBarcode([codeScanned]);
                break;
              case 2:
                break;
            }
          } else {
            let typeCode = 'caja';
            if (this.typeTags == 2) {
              typeCode = 'precio';
            }
            ScanditMatrixSimple.setText(
              `Escanea un código de caja para imprimir la etiqueta de ${typeCode} del producto.`,
              this.scanditProvider.colorsMessage.error.color,
              this.scanditProvider.colorText.color,
              16);
            this.hideTextMessage(1500);
          }
        }
        if (response.action == 'change_tag_type') {
          this.typeTags = response.type_tags;
        }
      }
    }, 'Imprimir etiquetas', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color, this.typeTags);
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
