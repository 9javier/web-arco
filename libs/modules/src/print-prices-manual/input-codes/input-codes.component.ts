import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ToastController} from "@ionic/angular";
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {PriceService} from "@suite/services";

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
              this.printerService.printTagPrices([dataWrote])
                .subscribe((res) => {
                  console.log('Printed price tag ... ', res);
                }, (error) => {
                  console.warn('Error to print tag ... ', error);
                });
              break;
          }
          break;
        case this.scanditProvider.codeValue.PRODUCT_MODEL:
          // Query sizes_range for product model
          this.priceService
            .postPricesByModel(dataWrote)
            .subscribe((response) => {
              console.debug('Test::Response -> ', response);
              if (response && response.length == 1) {
                switch (this.typeTags) {
                  case 2:
                    this.printerService.printTagPriceUsingPrice(response[0]);
                    break;
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
            });
          break;
        default:
          let typeCode = 'caja';
          if (this.typeTags == 2) {
            typeCode = 'precio';
          }
          this.presentToast(`Escanea un código de caja o precio para reimprimir la etiqueta de ${typeCode} del producto.`, 'danger');
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

            this.printerService.printTagPriceUsingPrice(listProductPrices[data]);
          }
        }
      ]
    });

    await alert.present();
  }

}
