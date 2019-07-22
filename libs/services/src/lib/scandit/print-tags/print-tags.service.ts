import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {PrinterService} from "../../printer/printer.service";
import {PriceService} from "@suite/services";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class PrintTagsScanditService {

  private typeTags: 1|2 = 1;
  private timeoutHideText;

  private listProductsPrices: any[];

  constructor(
    private printerService: PrinterService,
    private priceService: PriceService,
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

          switch (this.scanditProvider.checkCodeValue(codeScanned)) {
            case this.scanditProvider.codeValue.PRODUCT:
              switch (this.typeTags) {
                case 1:
                  this.printerService.printTagBarcode([codeScanned])
                    .subscribe((res) => {
                      console.log('Printed product tag ... ', res);
                    }, (error) => {
                      console.warn('Error to print tag ... ', error);
                    });
                  break;
                case 2:
                  this.printerService.printTagPrices([codeScanned])
                    .subscribe((res) => {
                      console.log('Printed price tag ... ', res);
                    }, (error) => {
                      console.warn('Error to print tag ... ', error);
                    });
                  break;
              }
              break;
            case this.scanditProvider.codeValue.PRODUCT_MODEL:
              if (this.typeTags == 1) {
                ScanditMatrixSimple.setText(
                  'Escanea un código de caja para reimprimir la etiqueta de caja del producto.',
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  16);
                this.hideTextMessage(1500);
              } else {
                // Query sizes_range for product model
                this.priceService
                  .postPricesByModel(codeScanned)
                  .subscribe((response) => {
                    if (response && response.length == 1) {
                      this.printerService.printTagPriceUsingPrice(response[0]);
                    } else if (response && response.length > 1) {
                      this.listProductsPrices = response;
                      // Request user select size to print
                      ScanditMatrixSimple.showAlertSelectSizeToPrint('Selecciona talla a usar', response);
                    }
                  });
              }
              break;
            default:
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
              break;
          }
        }
        if (response.action == 'change_tag_type') {
          this.typeTags = response.type_tags;
        } else if (response.action == 'select_size') {
          let sizeSelected: number = response.size_selected;
          this.printerService.printTagPriceUsingPrice(this.listProductsPrices[sizeSelected]);
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
