import {Component, OnInit} from '@angular/core';
import {LoadingController, ToastController} from "@ionic/angular";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {CarriersService} from "../../../../services/src/lib/endpoint/carriers/carriers.service";

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  placeholderDataToWrite: string = 'EMBALAJE';
  codeWrote: string = null;
  lastCodeScanned: string = 'start';
  msgTop: string = 'Escanea el embalaje de destino';

  private isProcessStarted: boolean = false;
  private packingReferenceDestiny: string = null;
  private loading: HTMLIonLoadingElement = null;

  private disableTransferProductByProduct: boolean = true;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private carriersService: CarriersService,
    private scanditProvider: ScanditProvider,
  ) {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },800);
  }

  ngOnInit() {

  }

  keyUpInput(event) {
    let dataWrote = (this.codeWrote || "").trim();

    if (event.keyCode == 13 && dataWrote) {
      this.codeWrote = null;
      if (dataWrote === this.lastCodeScanned) {
        return;
      }
      this.lastCodeScanned = dataWrote;

      if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.JAIL
        || this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PALLET) {
        if (this.isProcessStarted) {
          this.transferAmongPackings(dataWrote);
        } else {
          this.isProcessStarted = true;
          this.packingReferenceDestiny = dataWrote;
          this.msgTop = this.disableTransferProductByProduct ? 'Escanea el embalaje de origen' : 'Escanea los productos a traspasar';
          this.placeholderDataToWrite = this.disableTransferProductByProduct ? 'EMBALAJE' : 'PRODUCTO';
        }
      } else if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PRODUCT
        || this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PRODUCT_MODEL) {
        if (this.isProcessStarted) {
          if (this.disableTransferProductByProduct) {
            this.presentToast('Funcionalidad de traspaso de producto por producto no disponible actualmente.', 'danger');
          }
        } else {
          this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
        }
      } else {
        this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
      }
    }
  }

  private transferAmongPackings(originPacking) {
    this.showLoading('Traspasando productos...').then(() => {
      this.carriersService
        .postTransferAmongPackings({ destiny: this.packingReferenceDestiny, origin: originPacking })
        .subscribe(() => {
          this.hideLoading();
          this.presentToast('Traspaso de productos entre embalajes realizado.', 'success');
          this.packingReferenceDestiny = null;
          this.isProcessStarted = false;
          this.msgTop = "Escanea el embalaje de destino";
          this.placeholderDataToWrite = "EMBALAJE";
          this.lastCodeScanned = null;
        }, (error) => {
          this.hideLoading();
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
