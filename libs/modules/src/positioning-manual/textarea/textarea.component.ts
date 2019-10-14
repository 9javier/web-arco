import {Component, OnInit} from '@angular/core';
import {WarehouseService} from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {AuthenticationService, InventoryModel, InventoryService, WarehouseModel, IntermediaryService} from "@suite/services";
import {AlertController, ToastController} from "@ionic/angular";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {environment as al_environment} from "../../../../../apps/al/src/environments/environment";

@Component({
  selector: 'suite-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  dataToWrite: string = 'CONTENEDOR / EMBALAJE';
  containerReference: string = null;
  packingReference: string = null;
  inputPositioning: string = null;
  errorMessage: string = null;
  processInitiated: boolean;
  lastCodeScanned: string = 'start';

  private isStoreUser: boolean = false;
  private storeUserObj: WarehouseModel.Warehouse = null;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private authenticationService: AuthenticationService,
    private intermediaryService: IntermediaryService,
    private scanditProvider: ScanditProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }

  async ngOnInit() {
    this.isStoreUser = await this.authenticationService.isStoreUser();
    if (this.isStoreUser) {
      this.storeUserObj = await this.authenticationService.getStoreCurrentUser();
    }

    this.processInitiated = false;

    if (this.isStoreUser) {
      this.dataToWrite = 'PRODUCTO';
    }
  }

  keyUpInput(event) {
    let warehouseId = this.isStoreUser ? this.storeUserObj.id : this.warehouseService.idWarehouseMain;
    let dataWrited = (this.inputPositioning || "").trim();

    if (event.keyCode == 13 && dataWrited && !this.processInitiated) {

      if (dataWrited === this.lastCodeScanned) {
        this.inputPositioning = null;
        return;
      }
      this.lastCodeScanned = dataWrited;

      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      this.processInitiated = true;
      if (!this.isStoreUser && (dataWrited.match(/([A-Z]){1,4}([0-9]){3}A([0-9]){2}C([0-9]){3}$/) || dataWrited.match(/P([0-9]){2}[A-Z]([0-9]){2}$/))) {
        this.presentToast(`Inicio de ubicación en la posición ${dataWrited}`, 2000, 'success');
        this.containerReference = dataWrited;
        this.packingReference = null;
        this.dataToWrite = 'PRODUCTO / CONTENEDOR / EMBALAJE';
        this.inputPositioning = null;
        this.errorMessage = null;
        this.processInitiated = false;
      } else if (dataWrited.match(/([0]){2}([0-9]){6}([0-9]){2}([0-9]){3}([0-9]){5}$/)) {
        let params: any = {
          productReference: dataWrited,
          warehouseId: warehouseId
        };

        if (!this.isStoreUser && this.containerReference) {
          params.containerReference = this.containerReference;
        } else if (!this.isStoreUser && this.packingReference) {
          params.packingReference = this.packingReference;
        }

        this.storeProductInContainer(params);

        this.inputPositioning = null;
        this.errorMessage = null;
      } else if (!this.isStoreUser && (this.scanditProvider.checkCodeValue(dataWrited) == this.scanditProvider.codeValue.PALLET || this.scanditProvider.checkCodeValue(dataWrited) == this.scanditProvider.codeValue.JAIL)) {
        this.presentToast(`Inicio de ubicación en el embalaje ${dataWrited}`, 2000, 'success');
        this.containerReference = null;
        this.packingReference = dataWrited;
        this.dataToWrite = 'PRODUCTO / CONTENEDOR / EMBALAJE';
        this.inputPositioning = null;
        this.errorMessage = null;
        this.processInitiated = false;
      } else if (!this.isStoreUser && !this.containerReference && !this.packingReference) {
        this.inputPositioning = null;
        this.errorMessage = '¡Referencia del contenedor/embalaje errónea!';
        this.processInitiated = false;
      } else {
        this.inputPositioning = null;
        if (this.isStoreUser) {
          this.errorMessage = '¡Referencia del producto errónea!';
        } else {
          this.errorMessage = '¡Referencia del producto/contenedor/embalaje errónea!';
        }
        this.processInitiated = false;
      }
    }
  }

  private storeProductInContainer(params) {
    this.intermediaryService.presentLoading();
    this.inventoryService
      .postStore(params)
      .then((res: InventoryModel.ResponseStore) => {
        this.intermediaryService.dismissLoading();
        if (res.code == 200 || res.code == 201) {
          let msgSetText = '';
          if (this.isStoreUser) {
            msgSetText = `Producto ${params.productReference} añadido a la tienda ${this.storeUserObj.name}`;
          } else {
            if (params.packingReference) {
              msgSetText = `Producto ${params.productReference} añadido al embalaje ${params.packingReference}`;
            } else {
              msgSetText = `Producto ${params.productReference} añadido a la ubicación ${params.containerReference}`;
            }
          }
          this.presentToast(msgSetText, 2000, 'success');
          this.processInitiated = false;
        } else if (res.code == 428) {
          this.showWarningToForce(params);
        } else {
          let errorMessage = '';
          if (res.errors.productReference && res.errors.productReference.message) {
            errorMessage = res.errors.productReference.message;
          } else {
            errorMessage = res.message;
          }
          this.presentToast(errorMessage, 1500, 'danger');
          this.processInitiated = false;
        }
      }, (error) => {
        this.intermediaryService.dismissLoading();
        if (error.error.code == 428) {
          this.showWarningToForce(params);
        } else {
          this.presentToast(error.message, 1500, 'danger');
          this.processInitiated = false;
        }
      });
  }

  private async showWarningToForce(params) {
    const alertWarning = await this.alertController.create({
      header: 'Atención',
      subHeader: 'No se esperaba la entrada del producto que acaba de escanear. ¿Desea forzar la entrada del producto igualmente?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            this.processInitiated = false;
          }
        },
        {
          text: 'Forzar',
          handler: () => {
            params.force = true;
            this.storeProductInContainer(params);
            this.processInitiated = false;
          }
        }]
    });

    return await alertWarning.present();
  }

  private async presentToast(msg: string, duration: number = 2000, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: duration,
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
