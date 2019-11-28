import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ToastController} from "@ionic/angular";
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {PriceModel, PriceService} from "@suite/services";
import {PrintModel} from "../../../../services/src/models/endpoints/Print";
import {environment as al_environment} from "../../../../../apps/al/src/environments/environment";
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {KeyboardService} from "../../../../services/src/lib/keyboard/keyboard.service";

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  dataToWrite: string = 'PRODUCTO';
  inputProduct: string = null;
  lastCodeScanned: string = 'start';

  @Input() typeTags: number = 1;
  public typeTagsBoolean: boolean = false;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private printerService: PrinterService,
    private priceService: PriceService,
    private scanditProvider: ScanditProvider,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    this.focusToInput();
  }

  async ngOnInit() {
    this.typeTagsBoolean = this.typeTags != 1;
  }

  private focusToInput() {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }

  keyUpInput(event) {
    let dataWrote = (this.inputProduct || "").trim();

    if (event.keyCode == 13 && dataWrote) {
      if (dataWrote === this.lastCodeScanned) {
        this.inputProduct = null;
        this.focusToInput();
        return;
      }
      this.lastCodeScanned = dataWrote;

      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      if (!this.typeTagsBoolean) {
        this.typeTags = 1;
      } else {
        this.typeTags = 2;
      }

      this.inputProduct = null;
      switch (this.scanditProvider.checkCodeValue(dataWrote)) {
        case this.scanditProvider.codeValue.PRODUCT:
          switch (this.typeTags) {
            case 1:
              this.audioProvider.playDefaultOk();
              this.printerService.printTagBarcode([dataWrote])
                .subscribe((res) => {
                  console.log('Printed product tag ... ', res);
                }, (error) => {
                  console.warn('Error to print tag ... ', error);
                });
              this.focusToInput();
              break;
            case 2:
              this.priceService
                .postPricesByProductsReferences({ references: [dataWrote] })
                .then((prices) => {
                  if (prices.code == 200 || prices.code == 201) {
                    let pricesData: PriceModel.PriceByModelTariff[] = prices.data;
                    let price = pricesData[0];
                    if (price.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
                      this.presentAlertWarningPriceWithoutTariff(price);
                    } else {
                      this.audioProvider.playDefaultOk();
                      this.printerService.printTagPriceUsingPrice(price);
                      this.focusToInput();
                    }
                  } else if (prices.code == 0) {
                    this.audioProvider.playDefaultError();
                    this.presentToast('Ha ocurrido un problema al intentar conectarse con el servidor. Pruebe de nuevo a realizar la operación.', 'danger');
                    this.focusToInput();
                  } else {
                    this.lastCodeScanned = 'start';
                    this.audioProvider.playDefaultError();
                    this.presentToast('Ha ocurrido un error al consultar los precios del artículo escaneado.', 'danger');
                    this.focusToInput();
                  }
                });
              break;
            default:
              this.audioProvider.playDefaultError();
              this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
              this.focusToInput();
              break;
          }
          break;
        case this.scanditProvider.codeValue.PRODUCT_MODEL:
          switch (this.typeTags) {
            case 1:
              this.audioProvider.playDefaultError();
              this.presentToast('Escanea un código de caja para reimprimir la etiqueta de caja del producto.', 'danger');
              this.focusToInput();
              break;
            case 2:
              // Query sizes_range for product model
              this.priceService
                .postPricesByModel(dataWrote)
                .then((response) => {
                  if (response.code == 200 || response.code == 201) {
                    let responseData = response.data;
                    if (responseData && responseData.length == 1) {
                      this.audioProvider.playDefaultOk();
                      let price = responseData[0];
                      if (price.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
                        this.presentAlertWarningPriceWithoutTariff(price);
                      } else {
                        this.printerService.printTagPriceUsingPrice(price);
                        this.focusToInput();
                      }
                    } else if (responseData && responseData.length > 1) {
                      this.audioProvider.playDefaultOk();
                      // Request user select size to print
                      let listItems = responseData.map((productPrice, iProductPrice) => {
                        let label = productPrice.rangesNumbers.sizeRangeNumberMin;
                        if (productPrice.rangesNumbers.sizeRangeNumberMax != productPrice.rangesNumbers.sizeRangeNumberMin) {
                          label += (' - ' + productPrice.rangesNumbers.sizeRangeNumberMax);
                        }

                        return {
                          name: 'radio'+iProductPrice,
                          type: 'radio',
                          label: label,
                          value: iProductPrice
                        }
                      });
                      this.presentAlertSelect(listItems, responseData);
                    } else {
                      this.lastCodeScanned = 'start';
                      this.audioProvider.playDefaultError();
                      this.presentToast('Ha ocurrido un error al consultar los precios del artículo escaneado.', 'danger');
                      this.focusToInput();
                    }
                  } else if (response.code == 0) {
                    this.lastCodeScanned = 'start';
                    this.audioProvider.playDefaultError();
                    this.presentToast('Ha ocurrido un problema al intentar conectarse con el servidor. Pruebe de nuevo a realizar la operación.', 'danger');
                    this.focusToInput();
                  } else {
                    this.lastCodeScanned = 'start';
                    this.audioProvider.playDefaultError();
                    this.presentToast('Ha ocurrido un error al consultar los precios del artículo escaneado.', 'danger');
                    this.focusToInput();
                  }
                }, (error) => {
                  this.lastCodeScanned = 'start';
                  this.audioProvider.playDefaultError();
                  this.presentToast('Ha ocurrido un error al consultar los precios del artículo escaneado.', 'danger');
                  this.focusToInput();
                })
                .catch((error) => {
                  this.lastCodeScanned = 'start';
                  this.audioProvider.playDefaultError();
                  this.presentToast('Ha ocurrido un error al consultar los precios del artículo escaneado.', 'danger');
                  this.focusToInput();
                });
              break;
            default:
              this.audioProvider.playDefaultError();
              this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
              this.focusToInput();
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

          this.audioProvider.playDefaultError();
          this.presentToast(msg, 'danger');
          this.focusToInput();
          break;
      }
    }
  }

  private async presentToast(msg: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 1500,
      color: color
    });

    toast.present()
      .then(() => {
        setTimeout(() => {
          document.getElementById('input-ta').focus();
        },500);
      });
  }

  private async presentAlertSelect(listItems: any[], listProductPrices: any[]) {
    const alert = await this.alertController.create({
      header: 'Selecciona talla a usar',
      inputs: listItems,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => this.focusToInput()
        }, {
          text: 'Seleccionar',
          handler: (data) => {
            // Avoid close alert without selection
            if (typeof data == 'undefined') {
              return false;
            }

            let price = listProductPrices[data];
            if (price.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
              this.presentAlertWarningPriceWithoutTariff(price);
            } else {
              this.audioProvider.playDefaultOk();
              this.printerService.printTagPriceUsingPrice(price);
              this.focusToInput();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async presentAlertWarningPriceWithoutTariff(price: PriceModel.PriceByModelTariff) {
    const alert = await this.alertController.create({
      header: '¡Precio sin tarifa!',
      message: 'Este artículo no tiene tarifa outlet. ¿Desea imprimir su etiqueta de PVP?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.lastCodeScanned = 'start';
            this.focusToInput();
          }
        },
        {
          text: 'Sí',
          handler: () => {
            price.typeLabel = PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF;
            this.audioProvider.playDefaultOk();
            this.printerService.printTagPriceUsingPrice(price);
            this.focusToInput();
          }
        }
      ]
    });

    await alert.present();
  }

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

}
