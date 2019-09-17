import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {PrinterService} from "../../printer/printer.service";
import {AuthenticationService, PriceModel, PriceService, ProductModel, ProductsService, WarehouseModel} from "@suite/services";
import {PackingInventoryService} from "../../endpoint/packing-inventory/packing-inventory.service";
import {PackingInventoryModel} from "../../../models/endpoints/PackingInventory";
import {PrintModel} from "../../../models/endpoints/Print";
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";

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
  private typeTags: 1|2|3|4 = 1;
  private timeoutHideText;

  private listProductsPrices: any[];
  private productRelabel: ProductModel.SizesAndModel;
  private lastCodeScanned: string = 'start';
  private lastProductReferenceScanned: string = 'start';
  private scannedPaused: boolean = false;

  private productToPrintPvpLabel: PriceModel.PriceByModelTariff = null;

  private isStoreUser: boolean = false;
  private storeUserObj: WarehouseModel.Warehouse = null;

  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private printerService: PrinterService,
    private priceService: PriceService,
    private packingInventorService: PackingInventoryService,
    private productsService: ProductsService,
    private authService: AuthenticationService,
    private scanditProvider: ScanditProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
  }

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

  printRelabelProducts() {
    this.typeTags = 4;
    this.initPrintTags();
  }

  private async initPrintTags() {
    this.isStoreUser = await this.authService.isStoreUser();
    if (this.isStoreUser) {
      this.storeUserObj = await this.authService.getStoreCurrentUser();
    }

    this.lastCodeScanned = 'start';
    let codeScanned: string = null;
    let timeoutStarted = null;

    ScanditMatrixSimple.initPrintTags(async (response: ScanditModel.ResponsePrintTags) => {
      if (response && response.result) {
        if (response.barcode && response.barcode.data != this.lastCodeScanned && !this.scannedPaused) {

          codeScanned = response.barcode.data;
          this.lastCodeScanned = codeScanned;
          this.lastProductReferenceScanned = codeScanned;

          if (timeoutStarted) {
            clearTimeout(timeoutStarted);
          }
          timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

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
                  ScanditMatrixSimple.showLoadingDialog('Consultando precio del producto...');
                  this.priceService
                    .postPricesByProductsReferences({ references: [codeScanned] })
                    .subscribe((prices) => {
                      ScanditMatrixSimple.hideLoadingDialog();
                      let price = prices[0];
                      if (price.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
                        this.scannedPaused = true;
                        this.productToPrintPvpLabel = price;
                        ScanditMatrixSimple.showWarning(true, 'Este artículo no tiene tarifa outlet. ¿Desea imprimir su etiqueta de PVP?', 'print_pvp_label', 'Sí', 'No');
                      } else {
                        this.printerService.printTagPriceUsingPrice(price);
                      }
                    }, () => ScanditMatrixSimple.hideLoadingDialog());
                  break;
                case 3:
                  // Check packing of product
                  this.getCarrierOfProductAndPrint(codeScanned);
                  break;
                case 4:
                  if (this.isStoreUser) {
                    this.postRelabelProduct(this.lastProductReferenceScanned);
                  } else {
                    this.printerService.printTagBarcode([codeScanned])
                      .subscribe((res) => {
                        console.log('Printed product tag ... ', res);
                      }, (error) => {
                        console.warn('Error to print tag ... ', error);
                      });
                  }
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
                  ScanditMatrixSimple.showLoadingDialog('Consultando precio del producto...');
                  this.priceService
                    .postPricesByModel(codeScanned)
                    .subscribe((response) => {
                      ScanditMatrixSimple.hideLoadingDialog();
                      if (response && response.length == 1) {
                        let price = response[0];
                        if (price.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
                          this.scannedPaused = true;
                          this.productToPrintPvpLabel = price;
                          ScanditMatrixSimple.showWarning(true, 'Este artículo no tiene tarifa outlet. ¿Desea imprimir su etiqueta de PVP?', 'print_pvp_label', 'Sí', 'No');
                        } else {
                          this.printerService.printTagPriceUsingPrice(price);
                        }
                        this.printerService.printTagPriceUsingPrice(response[0]);
                      } else if (response && response.length > 1) {
                        this.listProductsPrices = response;
                        // Request user select size to print
                        ScanditMatrixSimple.showAlertSelectSizeToPrint('Selecciona talla a usar', response);
                      }
                    }, (error) => {
                      ScanditMatrixSimple.hideLoadingDialog();
                      // Reset last-code-scanned to can scan another time the same code
                      this.lastCodeScanned = 'start';
                      ScanditMatrixSimple.setText(
                        'Ha ocurrido un error al consultar los precios del artículo escaneado.',
                        this.scanditProvider.colorsMessage.error.color,
                        this.scanditProvider.colorText.color,
                        16);
                      this.hideTextMessage(1500);
                    });
                  break;
                case 4:
                  this.getSizeListByReference(codeScanned);
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
              } else if (this.typeTags == 4) {
                msg = 'El código escaneado es erróneo. Escanea un código de caja o de exposición para poder reetiquetar el producto.';
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
          if (this.typeTags == 2) {
            let price = this.listProductsPrices[sizeSelected];
            if (price.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
              this.scannedPaused = true;
              this.productToPrintPvpLabel = price;
              ScanditMatrixSimple.showWarning(true, 'Este artículo no tiene tarifa outlet. ¿Desea imprimir su etiqueta de PVP?', 'print_pvp_label', 'Sí', 'No');
            } else {
              this.printerService.printTagPriceUsingPrice(price);
            }
          } else if (this.typeTags == 4) {
            let modelId = this.productRelabel.model.id;
            let sizeId = this.productRelabel.sizes[sizeSelected].id;
            this.postRelabelProduct(this.lastProductReferenceScanned, modelId, sizeId);
          }
        } else if (response.action == 'print_pvp_label') {
          this.scannedPaused = false;
          if (response.response) {
            this.productToPrintPvpLabel.typeLabel = PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF;
            this.printerService.printTagPriceUsingPrice(this.productToPrintPvpLabel);
          } else {
            this.lastCodeScanned = 'start';
            this.productToPrintPvpLabel = null;
          }
        }
      }
    }, 'Imprimir etiquetas', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color, this.typeTags);
  }

  private getSizeListByReference(code: string) {
    ScanditMatrixSimple.showLoadingDialog('Consultando información del producto...');
    this.productsService
      .getInfo(code)
      .subscribe((res: ProductModel.ResponseInfo) => {
        ScanditMatrixSimple.hideLoadingDialog();
        if (res.code == 200) {
          let responseSizeAndModel: ProductModel.SizesAndModel = <ProductModel.SizesAndModel>res.data;
          if (responseSizeAndModel.model && responseSizeAndModel.sizes) {
            if (responseSizeAndModel.sizes.length == 1) {
              this.postRelabelProduct(code, responseSizeAndModel.model.id, responseSizeAndModel.sizes[0].id);
            } else {
              let responseSizeAndModel: ProductModel.SizesAndModel = <ProductModel.SizesAndModel>res.data;
              this.productRelabel = responseSizeAndModel;

              let listItems = responseSizeAndModel.sizes.map((size) => {
                return {
                  rangesNumbers: {
                    sizeRangeNumberMax: size.name,
                    sizeRangeNumberMin: size.name
                  }
                }
              });
              ScanditMatrixSimple.showAlertSelectSizeToPrint('Selecciona talla a usar', listItems);
            }
          }
        } else {
          ScanditMatrixSimple.setText(
            'No se ha podido consultar la información del producto escaneado.',
            this.scanditProvider.colorsMessage.error.color,
            this.scanditProvider.colorText.color,
            16);
          this.hideTextMessage(1500);
        }
      }, (error) => {
        ScanditMatrixSimple.hideLoadingDialog();
        console.error('Error::Subscribe::GetInfo -> ', error);
        ScanditMatrixSimple.setText(
          'No se ha podido consultar la información del producto escaneado.',
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          16);
        this.hideTextMessage(1500);
      });
  }

  private async postRelabelProduct(productReference: string, modelId?: number, sizeId?: number) {
    let paramsRelabel: ProductModel.ParamsRelabel = {
      productReference
    };

    if (this.isStoreUser) {
      paramsRelabel.warehouseId = this.storeUserObj.id;
    }

    if (modelId) {
      paramsRelabel.modelId = modelId;
    }

    if (sizeId) {
      paramsRelabel.sizeId = sizeId;
    }

    ScanditMatrixSimple.showLoadingDialog('Generando nueva etiqueta...');
    this.productsService
      .postRelabel(paramsRelabel)
      .subscribe((res: ProductModel.ResponseRelabel) => {
        ScanditMatrixSimple.hideLoadingDialog();
        if (res.code == 200) {
          // Do product print
          this.printerService.printTagBarcodeUsingProduct(res.data);
        } else {
          ScanditMatrixSimple.setText(
            'Ha ocurrido un error al intentar consultar la información de la talla.',
            this.scanditProvider.colorsMessage.error.color,
            this.scanditProvider.colorText.color,
            16);
          this.hideTextMessage(1500);
        }
      }, (error) => {
        ScanditMatrixSimple.hideLoadingDialog();
        console.error('Error::Subscribe::Relabel -> ', error);
        ScanditMatrixSimple.setText(
          'Ha ocurrido un error al intentar consultar la información de la talla.',
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          16);
        this.hideTextMessage(1500);
      });
  }

  private getCarrierOfProductAndPrint(codeScanned: string) {
    ScanditMatrixSimple.showLoadingDialog('Comprobando embalaje del producto...');
    this.packingInventorService
      .getCarrierOfProduct(codeScanned)
      .subscribe((res: PackingInventoryModel.ResponseGetCarrierOfProduct) => {
        ScanditMatrixSimple.hideLoadingDialog();
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
        ScanditMatrixSimple.hideLoadingDialog();
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
