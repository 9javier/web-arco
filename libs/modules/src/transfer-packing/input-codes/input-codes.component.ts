import {Component, OnInit} from '@angular/core';
import {LoadingController, ToastController} from "@ionic/angular";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {CarriersService} from "../../../../services/src/lib/endpoint/carriers/carriers.service";
import {SettingsService} from "../../../../services/src/lib/storage/settings/settings.service";
import {environment as al_environment} from "../../../../../apps/al/src/environments/environment";
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {CarrierModel} from "../../../../services/src/models/endpoints/Carrier";

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  placeholderDataToWrite: string = 'EMBALAJE';
  codeWrote: string = null;
  lastCodeScanned: string = 'start';
  msgTop: string = 'Escanea el embalaje de origen';

  private isProcessStarted: boolean = false;
  public packingReferenceOrigin: string = null;
  private loading: HTMLIonLoadingElement = null;

  private disableTransferProductByProduct: boolean = true;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private settingsService: SettingsService,
    private carriersService: CarriersService,
    private scanditProvider: ScanditProvider,
    private audioProvider: AudioProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },800);
  }

  ngOnInit() {

  }

  keyUpInput(event) {
    let dataWrote = (this.codeWrote || "").trim();

    if (event.keyCode == 13 && dataWrote) {
      this.settingsService.saveDeviceSettings({ transferPackingLastMethod: 'laser' });

      this.codeWrote = null;
      if (dataWrote === this.lastCodeScanned) {
        return;
      }
      this.lastCodeScanned = dataWrote;

      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.JAIL
        || this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PALLET
        || this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.BAG) {
        if (this.isProcessStarted) {
          this.transferAmongPackings(dataWrote);
        } else {
          this.audioProvider.playDefaultOk();
          this.isProcessStarted = true;
          this.packingReferenceOrigin = dataWrote;
          this.msgTop = this.disableTransferProductByProduct ? 'Escanea el embalaje de destino' : 'Escanea los productos a traspasar';
          this.placeholderDataToWrite = this.disableTransferProductByProduct ? 'EMBALAJE' : 'PRODUCTO';
        }
      } else if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PRODUCT
        || this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PRODUCT_MODEL) {
        if (this.isProcessStarted) {
          if (this.disableTransferProductByProduct) {
            this.audioProvider.playDefaultError();
            this.presentToast('Funcionalidad de traspaso de producto por producto no disponible actualmente.', 'danger');
          }
        } else {
          this.audioProvider.playDefaultError();
          this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
        }
      } else {
        this.audioProvider.playDefaultError();
        this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
      }
    }
  }

  private transferAmongPackings(destinyPacking) {
    this.showLoading('Traspasando productos...').then(() => {
      this.carriersService
        .postTransferAmongPackings({ origin: this.packingReferenceOrigin, destiny: destinyPacking })
        .then((res: CarrierModel.ResponseTransferAmongPackings) => {
          if (res.code == 200 || res.code == 201) {
            this.hideLoading();
            this.audioProvider.playDefaultOk();
            this.presentToast('Traspaso de productos entre embalajes realizado.', 'success');
            this.packingReferenceOrigin = null;
            this.isProcessStarted = false;
            this.msgTop = "Escanea el embalaje de origen";
            this.placeholderDataToWrite = "EMBALAJE";
            this.lastCodeScanned = null;
          } else {
            this.hideLoading();
            this.audioProvider.playDefaultError();
            this.presentToast('Ha ocurrido un error al intentar realizar el traspaso de productos entre embalajes.', 'danger');
          }
        }, (error) => {
          this.hideLoading();
          this.audioProvider.playDefaultError();
          console.error('Error::Subscribe:carriersService::postTransferAmongPackings::', error);
          this.presentToast('Ha ocurrido un error al intentar realizar el traspaso de productos entre embalajes.', 'danger');
        })
        .catch((error) => {
          this.hideLoading();
          this.audioProvider.playDefaultError();
          console.error('Error::Subscribe:carriersService::postTransferAmongPackings::', error);
          this.presentToast('Ha ocurrido un error al intentar realizar el traspaso de productos entre embalajes.', 'danger');
        });
    });
  }

  private async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }

  private hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
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
