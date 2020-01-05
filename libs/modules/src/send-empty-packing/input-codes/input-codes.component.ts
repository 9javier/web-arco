import { Value } from './../../../../../config/postman/sga_localhost_environment';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ToastController, ModalController } from "@ionic/angular";
import { PrinterService } from "../../../../services/src/lib/printer/printer.service";
import { ScanditProvider } from "../../../../services/src/providers/scandit/scandit.provider";
import { PriceModel, PriceService } from "@suite/services";
import { PrintModel } from "../../../../services/src/models/endpoints/Print";
import { environment as al_environment } from "../../../../../apps/al/src/environments/environment";
import { AudioProvider } from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import { range } from 'rxjs';
import { KeyboardService } from "../../../../services/src/lib/keyboard/keyboard.service";
import { CarrierService, IntermediaryService, WarehousesService, WarehouseModel } from '@suite/services';
import { MatSelectChange } from '@angular/material';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  dataToWrite: string = 'JAULA';
  inputProduct: string = null;
  lastCodeScanned: string = 'start';
  stampe: number = 1;

  @Input() typeTags: number = 1;
  public typeTagsBoolean: boolean = true;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  finestampa$: boolean;

  warehouses:Array<WarehouseModel.Warehouse> = [];

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private printerService: PrinterService,
    private priceService: PriceService,
    private scanditProvider: ScanditProvider,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
    private warehousesService:WarehousesService,
    private modalController:ModalController,
    private carrierService:CarrierService,
    private intermediaryService:IntermediaryService,

  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    this.focusToInput();
    this.warehousesService.getListAllWarehouses().then((warehouses: WarehouseModel.ResponseListAllWarehouses) => {
      this.warehouses = warehouses.data;
    })
  }

  async ngOnInit() {
    this.stampe = 1;
    this.typeTagsBoolean = this.typeTags != 1;
    this.printerService.stampe$.subscribe(() => {
      this.stampe = 1;
    })
  }

  private focusToInput() {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    }, 500);
  }

  async ngOnDestroy() {
    this.stampe = 1;
  }
  submit() {
    let dataWrote = (this.inputProduct || "").trim();
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
    // validate if existe joule o packing ref
    if(this.warehouse == undefined) {
      this.audioProvider.playDefaultError();
      this.presentToast('Debe seleccionar el almacen de destino.', 'danger');
      this.focusToInput();
      return;
    }
      //send Empty jaule
    this.intermediaryService.presentLoading();
    // let value = this.warehouse.id;
    this.carrierService.sendPacking(dataWrote, this.warehouse.id).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Envío de embalaje con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error de envío de embalaje");
    });
    return;
  }

  keyUpInput(event) {
    let dataWrote = (this.inputProduct || "").trim();
    // console.log({dataWrote});

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
      // validate if existe joule o packing ref
      if(this.warehouse == undefined) {
        this.audioProvider.playDefaultError();
        this.presentToast('Debe seleccionar el almacen de destino.', 'danger');
        this.focusToInput();
        return;
      }
      //send Empty jaule
      this.intermediaryService.presentLoading();
     // let value = this.warehouse.id;
      this.carrierService.sendPacking(dataWrote, this.warehouse.id).subscribe(()=>{
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess("Envío de embalaje con éxito");
        this.close();
      },()=>{
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError("Error de envío de embalaje");
      });
      return;
    }
  }
  private changePackingDestiny() {
    let value = this.warehouse.id;
    this.carrierService.sendPacking(this.warehouse.id, value).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Envío de embalaje con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error de envío de embalaje");
    });
  }

  toggleChange() {
    this.typeTagsBoolean = !this.typeTagsBoolean;
    let buttons = document.getElementsByClassName('bottons-mas-menos')[0] as HTMLElement;
    if (this.typeTagsBoolean) {
      buttons.style.display = 'block';
    } else {
      buttons.style.display = 'none';
    }
  }

  private convertArrayFromPrint(data: any, outputArray?: Boolean): Array<any> {
    let dataJoin = []
    let out;
    if (this.stampe == 1) {
      if (outputArray) {
        dataJoin.push(data);
        out = dataJoin;
      } else {
        out = data;
      }

    } else
      if (this.stampe > 1) {
        for (let i = 0; i < this.stampe; i++) {
          dataJoin.push(data);
        }
        out = dataJoin;
      }
    return out;
  }

  private async showToastWrongReference(type: number, lastCodeScanned: Boolean = true) {

    lastCodeScanned ? this.lastCodeScanned = 'start' : null;
    let msg = 'El código escaneado no es válido para la operación que se espera realizar.';
    if (type == 1) {
      msg = 'El código escaneado es erróneo. Escanea un código de caja para poder imprimir la etiqueta de caja.';
    } else if (type == 2) {
      msg = 'El código escaneado es erróneo. Escanea un código de caja o de exposición para poder imprimir la etiqueta de precio.';
    }
    this.audioProvider.playDefaultError();
    this.presentToast(msg, 'danger');
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
              this.printerService.printTagPriceUsingPrice(this.convertArrayFromPrint(price, true));
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
            this.printerService.printTagPriceUsingPrice(this.convertArrayFromPrint(price, true));
            this.focusToInput();
          }
        }
      ]
    });

    await alert.present();
  }

  public onFocus(event) {
    if (event && event.target && event.target.id) {
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

  selectedWarehouse;
  warehouse;
  selectWarehouse(event: MatSelectChange) {
    this.selectedWarehouse = event.value;
    this.warehouses.forEach(warehouse => {if(warehouse.id == this.selectedWarehouse) this.warehouse = warehouse});
  }
  close(){
    this.modalController.dismiss();
  }
}
