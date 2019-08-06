import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {ProductModel, ProductsService} from "@suite/services";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class ProductInfoScanditService {

  private timeoutHideText;

  constructor(
    private productService: ProductsService,
    private scanditProvider: ScanditProvider
  ) {}

  async init() {
    let lastCodeScanned: string = 'start';
    let codeScanned: string = null;

    ScanditMatrixSimple.initProductInfo((response: ScanditModel.ResponseProductInfo) => {
      console.debug('Test::Response -> ', response);
      if (response && response.result) {
        if (response.barcode && response.barcode.data != lastCodeScanned) {
          codeScanned = response.barcode.data;
          lastCodeScanned = codeScanned;

          if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PRODUCT
            || this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PRODUCT_MODEL) {
            // TODO Request product info to server
            this.productService
              .getExtendedInfo(codeScanned)
              .subscribe((res: ProductModel.ResponseExtendedInfo) => {
                if (res.code == 200) {
                  console.debug('Test::Res -> ', res);
                  ScanditMatrixSimple.showProductExtendedInfo(true, res.data);
                } else {
                  console.error('Error::Subscribe::GetExtendedInfo::', res);
                  ScanditMatrixSimple.showProgressBarProductExtendedInfo(false);
                  ScanditMatrixSimple.setText(
                    'Ha ocurrido un error al intentar consultar la información del producto.',
                    this.scanditProvider.colorsMessage.error.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(1500);
                }
              }, (error) => {
                console.error('Error::Subscribe::GetExtendedInfo::', error);
                ScanditMatrixSimple.showProgressBarProductExtendedInfo(false);
                ScanditMatrixSimple.setText(
                  'Ha ocurrido un error al intentar consultar la información del producto.',
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  16);
                this.hideTextMessage(1500);
              })
          } else {
            ScanditMatrixSimple.showProgressBarProductExtendedInfo(false);
            ScanditMatrixSimple.setText(
              'El código escaneado no es válido para la operación que se espera realizar.',
              this.scanditProvider.colorsMessage.error.color,
              this.scanditProvider.colorText.color,
              16);
            this.hideTextMessage(1500);
          }
        } else if (response.barcode && response.barcode.data == lastCodeScanned) {
          ScanditMatrixSimple.showProgressBarProductExtendedInfo(false);
        } else {
          if (response.action == 'matrix_simple') {
            // Scandit started
          }
        }
      }
    }, 'Info. producto', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color);
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


