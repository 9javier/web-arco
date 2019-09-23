import {Component, OnInit} from '@angular/core';
import {ToastController} from "@ionic/angular";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {CarriersService} from "../../../../services/src/lib/endpoint/carriers/carriers.service";
import {CarrierModel} from "../../../../services/src/models/endpoints/Carrier";
import {environment as al_environment} from "../../../../../apps/al/src/environments/environment";
import { IntermediaryService } from '@suite/services';

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  dataToWrite: string = 'RECIPIENTE';
  inputProduct: string = null;
  lastCodeScanned: string = 'start';

  public typeTagsBoolean: boolean = false;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private toastController: ToastController,
    private carriersService: CarriersService,
    private scanditProvider: ScanditProvider,
    private intermediaryService: IntermediaryService
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

      if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.JAIL
        || this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PALLET) {
        this.intermediaryService.presentLoading();
        this.carriersService
          .postSeal({
            reference: dataWrote
          })
          .subscribe((res: CarrierModel.ResponseSeal) => {
            this.intermediaryService.dismissLoading();
            if (res.code == 200) {
              let msgOk = 'El recipiente';
              if (res.data.packingType == 1) {
                msgOk = 'La jaula';
              } else if (res.data.packingType == 2) {
                msgOk = 'El pallet';
              }
              msgOk += ' se ha precintado correctamente.';
              this.presentToast(msgOk, 'primary');
            } else {
              this.presentToast('Ha ocurrido un error al intentar precintar el recipiente.', 'danger');
            }
          }, (error) => {
            this.intermediaryService.dismissLoading();
            let errorMsg = error && error.error && error.error.errors ? error.error.errors : 'Ha ocurrido un error al intentar precintar el recipiente.';
            this.presentToast(errorMsg, 'danger');
          }, () => {
            this.intermediaryService.dismissLoading();
          });
      } else {
        this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
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

}
