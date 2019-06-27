import {Component, OnInit} from '@angular/core';
import {WarehouseService} from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {InventoryModel, InventoryService} from "@suite/services";
import {AlertController, ToastController} from "@ionic/angular";

@Component({
  selector: 'suite-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  dataToWrite: string = 'CONTENEDOR';
  containerReference: string = null;
  inputPositioning: string = null;
  errorMessage: string = null;
  processInitiated: boolean;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService
  ) {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }

  ngOnInit() {
    this.processInitiated = false;
  }

  keyUpInput(event) {
    let warehouseId = this.warehouseService.idWarehouseMain;
    let dataWrited = this.inputPositioning;

    if (event.keyCode == 13 && dataWrited && !this.processInitiated) {
      this.processInitiated = true;
      if (dataWrited.match(/([A-Z]){1,4}([0-9]){3}A([0-9]){2}C([0-9]){3}$/) || dataWrited.match(/P([0-9]){2}[A-Z]([0-9]){2}$/)) {
        if (dataWrited != this.containerReference) {
          this.containerReference = dataWrited;
          this.dataToWrite = 'PRODUCTO / CONTENEDOR';
          this.inputPositioning = null;
          this.errorMessage = null;

          this.presentToast(`Inicio de posicionamiento en ${dataWrited}`, 2000, 'success');
          this.processInitiated = false;
        }
      } else if (dataWrited.match(/([0]){2}([0-9]){6}([0-9]){2}([0-9]){3}([0-9]){5}$/)) {
        this.storeProductInContainer({
          productReference: dataWrited,
          containerReference: this.containerReference,
          warehouseId: warehouseId
        });

        this.inputPositioning = null;
        this.errorMessage = null;
      } else if (!this.containerReference) {
        this.inputPositioning = null;
        this.errorMessage = '¡Referencia del contenedor errónea!';
        this.processInitiated = false;
      } else {
        this.inputPositioning = null;
        this.errorMessage = '¡Referencia del producto/contenedor errónea!';
        this.processInitiated = false;
      }
    }
  }

  private storeProductInContainer(params) {
    this.inventoryService.postStore(params).then((data: Observable<HttpResponse<InventoryModel.ResponseStore>>) => {
      data.subscribe((res: HttpResponse<InventoryModel.ResponseStore>) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.presentToast(`Producto ${params.productReference} añadido a la ubicación ${params.containerReference}`, 2000, 'success');
            this.processInitiated = false;
          } else if (res.body.code == 428) {
            this.showWarningToForce(params);
          } else {
            let errorMessage = '';
            if (res.body.errors.productReference && res.body.errors.productReference.message) {
              errorMessage = res.body.errors.productReference.message;
            } else {
              errorMessage = res.body.message;
            }
            this.presentToast(errorMessage, 1500, 'danger');
            this.processInitiated = false;
          }
        }, (error) => {
          if (error.error.code == 428) {
            this.showWarningToForce(params);
          } else {
            this.presentToast(error.error.errors, 1500, 'danger');
            this.processInitiated = false;
          }
        }
      );
    }, (error: HttpErrorResponse) => {
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
