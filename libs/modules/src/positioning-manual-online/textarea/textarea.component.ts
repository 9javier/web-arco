import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import { AuthenticationService, InventoryModel, InventoryService, WarehouseModel, IntermediaryService } from "@suite/services";
import { AlertController } from "@ionic/angular";
import { ItemReferencesProvider } from "../../../../services/src/providers/item-references/item-references.provider";
import { environment as al_environment } from "../../../../../apps/al/src/environments/environment";
import { AudioProvider } from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import { KeyboardService } from "../../../../services/src/lib/keyboard/keyboard.service";
import { TimesToastType } from '../../../../services/src/models/timesToastType';
import { PositionsToast } from '../../../../services/src/models/positionsToast.type';
import { LoadingMessageComponent } from "../../components/loading-message/loading-message.component";

@Component({
  selector: 'suite-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  @ViewChild(LoadingMessageComponent) loadingMessageComponent: LoadingMessageComponent;

  dataToWrite: string = 'CONTENEDOR';
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

  public isScannerBlocked: boolean = false;

  constructor(
    private alertController: AlertController,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private authenticationService: AuthenticationService,
    private intermediaryService: IntermediaryService,
    private itemReferencesProvider: ItemReferencesProvider,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    this.focusToInput();
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

  private focusToInput(playSound: boolean = false, typeSound: 'ok' | 'error' = 'ok') {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
      if (playSound) {
        if (typeSound == 'ok') {
          this.audioProvider.playDefaultOk();
        } else {
          this.audioProvider.playDefaultError();
        }
      }
    }, 500);
  }

  keyUpInput(event?, prova: boolean = false) {
    let warehouseId = this.isStoreUser ? this.storeUserObj.id : this.warehouseService.idWarehouseMain;
    let dataWrited = (this.inputPositioning || "").trim();

    if ((event.keyCode === 13 || prova && dataWrited && !this.processInitiated) && !this.isScannerBlocked) {
      this.isScannerBlocked = true;
      document.getElementById('input-ta').blur();

      if (dataWrited === this.lastCodeScanned) {
        this.inputPositioning = null;
        this.isScannerBlocked = false;
        this.focusToInput();
        return;
      }
      this.lastCodeScanned = dataWrited;

      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      this.processInitiated = true;
      if (!this.isStoreUser && (this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.CONTAINER || this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.CONTAINER_OLD)) {
        this.processInitiated = false;
        this.intermediaryService.presentToastSuccess(`Inicio de ubicación en la posición ${dataWrited}`, TimesToastType.DURATION_SUCCESS_TOAST_2000, PositionsToast.BOTTOM).then(() => {
          this.isScannerBlocked = false;
          this.focusToInput(true, 'ok');
        });
        this.containerReference = dataWrited;
        this.packingReference = null;
        this.dataToWrite = 'PRODUCTO/CONTENEDOR';
        this.inputPositioning = null;
        this.errorMessage = null;
      } else if (this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.PRODUCT) {
        let params: any = {
          productReference: dataWrited,
          warehouseId: warehouseId,
          force: false
        };

        if (!this.isStoreUser && this.containerReference) {
          params.containerReference = this.containerReference;
        } else if (!this.isStoreUser && this.packingReference) {
          params.packingReference = this.packingReference;
        }
        this.inputPositioning = null;

        this.storeProductInContainer(params);

        this.errorMessage = null;
      } else if (false && !this.isStoreUser && this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.PACKING) {
        this.inputPositioning = null;
        this.errorMessage = '¡No es posible ubicar no aptos online en embalajes!';
        this.processInitiated = false;
        this.isScannerBlocked = false;
        this.focusToInput(true, 'error');
      } else if (!this.isStoreUser && !this.containerReference && !this.packingReference) {
        this.inputPositioning = null;
        this.errorMessage = '¡Referencia del contenedor errónea!';
        this.processInitiated = false;
        this.isScannerBlocked = false;
        this.focusToInput(true, 'error');
      } else {
        this.inputPositioning = null;
        if (this.isStoreUser) {
          this.errorMessage = '¡Referencia del producto errónea!';
        } else {
          this.errorMessage = '¡Referencia del producto/contenedor errónea!';
        }
        this.processInitiated = false;
        this.isScannerBlocked = false;
        this.focusToInput(true, 'error');
      }
    } else if (event.keyCode === 13 && this.isScannerBlocked) {
      this.inputPositioning = null;
      this.focusToInput();
    }
  }

  private storeProductInContainer(params) {
    this.loadingMessageComponent.show(true, `Ubicando ${params.productReference || ''}`);

    params.noOnline = true;
    this.inventoryService
      .postStore(params)
      .then(async (res: InventoryModel.ResponseStore) => {
        if (res.code === 200 || res.code === 201) {
          let msgSetText = `Producto ${params.productReference} ubicado y marcado como 'No apto online'`;
          this.processInitiated = false;
          this.intermediaryService.presentToastSuccess(msgSetText, TimesToastType.DURATION_SUCCESS_TOAST_2000, PositionsToast.BOTTOM).then(() => {
            this.loadingMessageComponent.show(false);
            this.isScannerBlocked = false;
            this.focusToInput(true, 'ok');
          });
        } else if (res.code === 428) {
          this.loadingMessageComponent.show(false);
          this.audioProvider.playDefaultError();
          this.showWarningToForce(params);
        } else if (res.code === 401) {
          if (res.message === 'UserConfirmationRequiredException') {
            this.loadingMessageComponent.show(false);
            this.warningToForce(params, res.errors, false, 'Continuar');
          } else {
            /** Comprobando si tienes permisos para el forzado */
            const permission = await this.inventoryService.checkUserPermissions();
            /** Forzado de empaquetado */
            this.loadingMessageComponent.show(false);
            if (permission.data) {
              this.warningToForce(params, res.errors);
            } else {
              this.presentAlert(res.errors);
              this.processInitiated = false;
            }
          }
        } else {
          let errorMessage = res.message;
          if (res.errors) {
            if (typeof res.errors === 'string') {
              errorMessage = res.errors;
            } else {
              if (res.errors.productReference && res.errors.productReference.message) {
                errorMessage = res.errors.productReference.message;
              }
            }
          }
          this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM).then(() => {
            this.loadingMessageComponent.show(false);
            this.isScannerBlocked = false;
            this.focusToInput(true, 'error');
          });
          this.processInitiated = false;
        }
      }, (error) => {
        if (error.error.code === 428) {
          this.loadingMessageComponent.show(false);
          this.audioProvider.playDefaultError();
          this.showWarningToForce(params);
        } else {
          this.intermediaryService.presentToastError(error.message, PositionsToast.BOTTOM).then(() => {
            this.loadingMessageComponent.show(false);
            this.isScannerBlocked = false;
            this.focusToInput(true, 'error');
          });
          this.processInitiated = false;
        }
      });
  }

  private async warningToForce(params, subHeader, checkPermissionToForce: boolean = true, btnOkMessage: string = 'Forzar') {
    const alertWarning = await this.alertController.create({
      header: 'Atención',
      subHeader,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            this.intermediaryService.presentToastError('El producto no se ha ubicado.', PositionsToast.BOTTOM).then(() => {
              this.isScannerBlocked = false;
              this.focusToInput(true, 'error');
            });

            this.processInitiated = false;
          }
        },
        {
          text: btnOkMessage,
          handler: async () => {
            if (checkPermissionToForce) {
              // Consultando si el usuario tiene permisos para forzar
              const permissions = await this.inventoryService.checkUserPermissions();
              if (permissions.data) {
                params.force = true;
                params.avoidAvelonMovement = false;
                this.storeProductInContainer(params);
                this.processInitiated = false;
              } else {
                this.alertController.dismiss();
                this.presentAlert('Su usuario no tiene los permisos suficientes para realizar este forzado de ubicación.');
                this.processInitiated = false;
              }
            } else {
              params.force = true;
              this.storeProductInContainer(params);
              this.processInitiated = false;
            }
          }
        }]
    });

    return await alertWarning.present();
  }

  async presentAlert(subHeader) {
    const alert = await this.alertController.create({
      header: 'Atencion',
      subHeader,
      buttons: ['OK']
    });

    await alert.present();
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

  public onFocus(event) {
    if (event && event.target && event.target.id) {
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

}
