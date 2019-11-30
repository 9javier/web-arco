import {Component, OnInit} from '@angular/core';
import {AlertController, ToastController} from "@ionic/angular";
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {PriceService} from "@suite/services";
import {PackingInventoryModel} from "../../../../services/src/models/endpoints/PackingInventory";
import {PackingInventoryService} from "../../../../services/src/lib/endpoint/packing-inventory/packing-inventory.service";
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

  public typeTagsBoolean: boolean = false;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private toastController: ToastController,
    private printerService: PrinterService,
    private priceService: PriceService,
    private scanditProvider: ScanditProvider,
    private packingInventorService: PackingInventoryService,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },800);
  }

  ngOnInit() {

  }

  keyUpInput(event) {
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

      this.inputProduct = null;
      switch (this.scanditProvider.checkCodeValue(dataWrote)) {
        case this.scanditProvider.codeValue.PRODUCT:
          this.getCarrierOfProductAndPrint(dataWrote);
          break;
        default:
          this.audioProvider.playDefaultError();
          this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
          break;
      }
    }
  }

  private getCarrierOfProductAndPrint(dataWrote: string) {
    this.packingInventorService
      .getCarrierOfProduct(dataWrote)
      .then((res: PackingInventoryModel.ResponseGetCarrierOfProduct) => {
        if (res.code == 200) {
          this.audioProvider.playDefaultOk();
          this.printerService.print({text: [res.data.reference], type: 0})
        } else {
          this.audioProvider.playDefaultError();
          console.error('Error::Subscribe::GetCarrierOfProduct::', res);
          let msgError = `Ha ocurrido un error al intentar comprobar el embalaje del producto ${dataWrote}.`;
          if (res.errors && typeof res.errors == 'string') {
            msgError = res.errors;
          } else if (res.message) {
            msgError = res.message;
          }
          this.presentToast(msgError, 'danger');
        }
      }, (error) => {
        this.audioProvider.playDefaultError();
        console.error('Error::Subscribe::GetCarrierOfProduct::', error);
        let msgError = `Ha ocurrido un error al intentar comprobar el embalaje del producto ${dataWrote}.`;
        if (error.error) {
          if (error.error.message) {
            msgError = error.error.message;
          } else if (error.error.errors) {
            msgError = error.error.errors;
          } else if (typeof error.error == 'string') {
            msgError = error.error;
          }
        }
        this.presentToast(msgError, 'danger');
      })
      .catch((error) => {
        this.audioProvider.playDefaultError();
        console.error('Error::Subscribe::GetCarrierOfProduct::', error);
        let msgError = `Ha ocurrido un error al intentar comprobar el embalaje del producto ${dataWrote}.`;
        if (error.error) {
          if (error.error.message) {
            msgError = error.error.message;
          } else if (error.error.errors) {
            msgError = error.error.errors;
          } else if (typeof error.error == 'string') {
            msgError = error.error;
          }
        }
        this.presentToast(msgError, 'danger');
      });
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

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

}
