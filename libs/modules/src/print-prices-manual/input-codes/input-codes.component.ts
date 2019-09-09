import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ToastController} from "@ionic/angular";
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {PriceModel, PriceService} from "@suite/services";
import {PrintModel} from "../../../../services/src/models/endpoints/Print";

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

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private printerService: PrinterService,
    private priceService: PriceService,
    private scanditProvider: ScanditProvider
  ) {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }

  async ngOnInit() {
    this.typeTagsBoolean = this.typeTags != 1;
  }

  keyUpInput(event) {
    let dataWrote = (this.inputProduct || "").trim();

    if (event.keyCode == 13 && dataWrote) {
      if (dataWrote === this.lastCodeScanned) {
        this.inputProduct = null;
        return;
      }
      this.lastCodeScanned = dataWrote;

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
              this.printerService.printTagBarcode([dataWrote])
                .subscribe((res) => {
                  console.log('Printed product tag ... ', res);
                }, (error) => {
                  console.warn('Error to print tag ... ', error);
                });
              break;
            case 2:
              this.priceService
                .postPricesByProductsReferences({ references: [dataWrote] })
                .subscribe((prices) => {
                  let price = prices[0];
                  if (price.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
                    this.presentAlertWarningPriceWithoutTariff(price);
                  } else {
                    this.printerService.printTagPriceUsingPrice(price);
                  }
                });
              break;
            default:
              this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
              break;
          }
          break;
        case this.scanditProvider.codeValue.PRODUCT_MODEL:
          switch (this.typeTags) {
            case 1:
              this.presentToast('Escanea un código de caja para reimprimir la etiqueta de caja del producto.', 'danger');
              break;
            case 2:
              // Query sizes_range for product model
              this.priceService
                .postPricesByModel(dataWrote)
                .subscribe((response) => {
                  if (response && response.length == 1) {
                    let price = response[0];
                    if (price.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
                      this.presentAlertWarningPriceWithoutTariff(price);
                    } else {
                      this.printerService.printTagPriceUsingPrice(price);
                    }
                  } else if (response && response.length > 1) {
                    // Request user select size to print
                    let listItems = response.map((productPrice, iProductPrice) => {
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
                    this.presentAlertSelect(listItems, response);
                  }
                }, (error) => {
                  this.lastCodeScanned = 'start';
                  this.presentToast('Ha ocurrido un error al consultar los precios del artículo escaneado.', 'danger');
                });
              break;
            default:
              this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
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

          this.presentToast(msg, 'danger');
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
          handler: () => {
            console.log('Confirm Cancelar');
          }
        }, {
          text: 'Seleccionar',
          handler: (data) => {
            console.log('Confirm Seleccionar -> ', data);
            // Avoid close alert without selection
            if (typeof data == 'undefined') {
              return false;
            }

            let price = listProductPrices[data];
            if (price.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
              this.presentAlertWarningPriceWithoutTariff(price);
            } else {
              this.printerService.printTagPriceUsingPrice(price);
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
            setTimeout(() => {
              document.getElementById('input-ta').focus();
            },500);
          }
        },
        {
          text: 'Si',
          handler: () => {
            price.typeLabel = PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF;
            this.printerService.printTagPriceUsingPrice(price);
          }
        }
      ]
    });

    await alert.present();
  }

}
