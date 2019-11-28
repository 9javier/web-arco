import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ToastController, ModalController } from "@ionic/angular";
import { PrinterService } from "../../../../services/src/lib/printer/printer.service";
import { ScanditProvider } from "../../../../services/src/providers/scandit/scandit.provider";
import { PriceModel, PriceService } from "@suite/services";
import { PrintModel } from "../../../../services/src/models/endpoints/Print";
import { environment as al_environment } from "../../../../../apps/al/src/environments/environment";
import { AudioProvider } from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import { range } from 'rxjs';

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  dataToWrite: string = 'PRODUCTO';
  inputProduct: string = null;
  lastCodeScanned: string = 'start';
  stampe: number = 1;

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
    // private modalController: ModalController,
    // private alerta: AlertController
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    }, 500);
  }

  async ngOnInit() {
    this.typeTagsBoolean = this.typeTags != 1;

  }

  mas() {
    this.stampe = this.stampe + 1;
  }

  menos() {
    if (this.stampe === 1) {
      return;
    } else {
      this.stampe = this.stampe - 1;
    }
  }
  async enviar_Veces(res,prezzo:number |null = null) {
    let dataImprim;
    console.log(prezzo);
    
    if(prezzo){
      dataImprim = {res,prezzo}
    }else{
      dataImprim = res;
    }
    range(0, this.stampe).subscribe(data => {
      console.log('Printed product tag ... ', dataImprim);
    })
  }
  // TODO Alert Prezzo con Codigo
  async presentModal(codice) {
    const alert = await this.alertController.create({
      header: 'Codigo Desconocido',
      subHeader: 'Nueva Impression',
      message:"¿Deseas imprimir el nuevo codigo y nuevo precio?",
      // message: 'Imprimir Codigo y precio ',
      // animated:true,
      inputs:[
        {
          name:'Codice',
          placeholder:'Codice',
          value:codice
          
        },
        {
          name:'Tickets',
          value:this.stampe,
          type:'number'
        },
        {
          name:'prezzo',
          type:'number',
          value:0,
          placeholder:'Prezzo'
        }
      ],
      buttons: [
        {text:'Impimir', handler: (data) => {
          console.log('imprimire',data);
          this.enviar_Veces(codice,data.prezzo)
        }},{
          text:'Cancellar',
          role:'cancel',
          cssClass:'secondary',
          handler:()=>{
            console.log('Cancelliamo procedimento');
            
          }
        }
      ]
    });

    await alert.present();
  }

  keyUpInput(event) {
    // console.log(event);

    let dataWrote = (this.inputProduct || "").trim();

    if (event.keyCode == 13 && dataWrote) {
      if (dataWrote === this.lastCodeScanned) {
        this.inputProduct = null;
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
                  // console.log('Printed product tag ... ', res);
                  this.enviar_Veces(res);
                }, (error) => {
                  console.warn('Error to print tag ... ', error);
                });
              break;
            case 2:
              this.priceService
                .postPricesByProductsReferences({ references: [dataWrote] })
                .then((prices) => {
                  let pricesData: PriceModel.PriceByModelTariff[] = prices.data;
                  let price = pricesData[0];
                  if (price.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
                    this.presentAlertWarningPriceWithoutTariff(price);
                  } else {
                    this.audioProvider.playDefaultOk();
                    this.printerService.printTagPriceUsingPrice(price);
                  }
                });
              break;
            default:
              console.log(1);

              this.audioProvider.playDefaultError();
              this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
              break;
          }
          break;
        case this.scanditProvider.codeValue.PRODUCT_MODEL:
          switch (this.typeTags) {
            case 1:
              console.log(2);

              this.audioProvider.playDefaultError();
              this.presentToast('Escanea un código de caja para reimprimir la etiqueta de caja del producto.', 'danger');
              break;
            case 2:
              // Query sizes_range for product model
              this.priceService
                .postPricesByModel(dataWrote)
                .then((response) => {
                  let responseData = response.data;
                  if (responseData && responseData.length == 1) {
                    this.audioProvider.playDefaultOk();
                    let price = responseData[0];
                    if (price.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
                      this.presentAlertWarningPriceWithoutTariff(price);
                    } else {
                      this.printerService.printTagPriceUsingPrice(price);
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
                        name: 'radio' + iProductPrice,
                        type: 'radio',
                        label: label,
                        value: iProductPrice
                      }
                    });
                    this.presentAlertSelect(listItems, responseData);
                  } else {
                    console.log('Error codiec');
                    // console.log(dataWrote);
                    
                    // TODO CREAMO IL MODAL PER CHIEDERE IL PREZZO
                    this.presentModal(dataWrote)

                    this.lastCodeScanned = 'start';
                    // this.audioProvider.playDefaultError();
                    this.presentToast('Ha ocurrido un error al consultar los precios del artículo escaneado.', 'danger');
                  }
                }, (error) => {
                  this.lastCodeScanned = 'start';
                  this.audioProvider.playDefaultError();
                  this.presentToast('Ha ocurrido un error al consultar los precios del artículo escaneado.', 'danger');
                })
                .catch((error) => {
                  this.lastCodeScanned = 'start';
                  this.audioProvider.playDefaultError();
                  this.presentToast('Ha ocurrido un error al consultar los precios del artículo escaneado.', 'danger');
                });
              break;
            default:
              console.log(4);

              this.audioProvider.playDefaultError();
              this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
              break;
          }
          break;
        default:
          console.log(5);

          let msg = 'El código escaneado no es válido para la operación que se espera realizar.';
          if (this.typeTags == 1) {
            msg = 'El código escaneado es erróneo. Escanea un código de caja para poder imprimir la etiqueta de caja.';
          } else if (this.typeTags == 2) {
            msg = 'El código escaneado es erróneo. Escanea un código de caja o de exposición para poder imprimir la etiqueta de precio.';
          }

          this.audioProvider.playDefaultError();
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
        }, 500);
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
          handler: () => { }
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
            }, 500);
          }
        },
        {
          text: 'Sí',
          handler: () => {
            price.typeLabel = PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF;
            this.audioProvider.playDefaultOk();
            this.printerService.printTagPriceUsingPrice(price);
          }
        }
      ]
    });

    await alert.present();
  }

}
