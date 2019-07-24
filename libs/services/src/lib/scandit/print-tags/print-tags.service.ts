import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {PrinterService} from "../../printer/printer.service";
import {PriceService} from "@suite/services";
import {PackingInventoryService} from "../../endpoint/packing-inventory/packing-inventory.service";
import {PackingInventoryModel} from "../../../models/endpoints/PackingInventory";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class PrintTagsScanditService {

  /*
   * 1 - Reference Tag
   * 2 - Price Tag
   * 3 - Packing Tag
   */
  private typeTags: 1|2|3 = 1;
  private timeoutHideText;

  private listProductsPrices: any[];

  constructor(
    private printerService: PrinterService,
    private priceService: PriceService,
    private packingInventorService: PackingInventoryService,
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

  printTagsPackings() {
    this.typeTags = 3;
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
                case 3:
                  // Check packing of product
                  this.getCarrierOfProductAndPrint(codeScanned);
                  break;
                default:
                  ScanditMatrixSimple.setText(
                    'El código escaneado no es válido para la operación que se espera realizar.',
                    this.scanditProvider.colorsMessage.error.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(1500);
                  break;
              }
              break;
            case this.scanditProvider.codeValue.PRODUCT_MODEL:
              switch (this.typeTags) {
                case 1:
                  ScanditMatrixSimple.setText(
                    'Escanea un código de caja para reimprimir la etiqueta de caja del producto.',
                    this.scanditProvider.colorsMessage.error.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(1500);
                  break;
                case 2:
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
                    }, (error) => {
                      // Reset last-code-scanned to can scan another time the same code
                      lastCodeScanned = 'start';
                      ScanditMatrixSimple.setText(
                        'Ha ocurrido un error al consultar los precios del artículo escaneado.',
                        this.scanditProvider.colorsMessage.error.color,
                        this.scanditProvider.colorText.color,
                        16);
                      this.hideTextMessage(1500);
                    });
                  break;
                default:
                  ScanditMatrixSimple.setText(
                    'El código escaneado no es válido para la operación que se espera realizar.',
                    this.scanditProvider.colorsMessage.error.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(1500);
                  break;
              }
              break;
            default:
              let msg = 'El código escaneado no es válido para la operación que se espera realizar.';
              if (this.typeTags == 1) {
                msg = 'El código escaneado es erróneo. Escanea un código de caja para poder imprimir la etiqueta de caja.';
              } else if (this.typeTags == 2) {
                msg = 'El código escaneado es erróneo. Escanea un código de caja o de exposición para poder imprimir la etiqueta de precio.';
              }
              ScanditMatrixSimple.setText(
                msg,
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

  private getCarrierOfProductAndPrint(codeScanned: string) {
    this.packingInventorService
      .getCarrierOfProduct(codeScanned)
      .subscribe((res: PackingInventoryModel.ResponseGetCarrierOfProduct) => {
        if (res.code == 200) {
          this.printerService.print({text: [res.data.reference], type: 0})
        } else {
          console.error('Error::Subscribe::GetCarrierOfProduct::', res);
          let msgError = `Ha ocurrido un error al intentar comprobar el recipiente del producto ${codeScanned}.`;
          if (res.message) {
            msgError = res.message;
          } else if (res.errors && typeof res.errors == 'string') {
            msgError = res.errors;
          }
          ScanditMatrixSimple.setText(
            msgError,
            this.scanditProvider.colorsMessage.error.color,
            this.scanditProvider.colorText.color,
            16);
          this.hideTextMessage(1500);
        }
      }, (error) => {
        console.error('Error::Subscribe::GetCarrierOfProduct::', error);
        let msgError = `Ha ocurrido un error al intentar comprobar el recipiente del producto ${codeScanned}.`;
        if (error.error) {
          if (error.error.message) {
            msgError = error.error.message;
          } else if (error.error.errors) {
            msgError = error.error.errors;
          } else if (typeof error.error == 'string') {
            msgError = error.error;
          }
        }
        ScanditMatrixSimple.setText(
          msgError,
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          16);
        this.hideTextMessage(1500);
      });
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
