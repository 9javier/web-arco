import { Component, OnInit } from '@angular/core';
import { WarehouseService } from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import { AuthenticationService, InventoryModel, InventoryService, WarehouseModel, IntermediaryService } from "@suite/services";
import { AlertController, ModalController } from "@ionic/angular";
import { ItemReferencesProvider } from "../../../../services/src/providers/item-references/item-references.provider";
import { environment as al_environment } from "../../../../../apps/al/src/environments/environment";
import { AudioProvider } from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import { KeyboardService } from "../../../../services/src/lib/keyboard/keyboard.service";
import { TimesToastType } from '../../../../services/src/models/timesToastType';
import { PositionsToast } from '../../../../services/src/models/positionsToast.type';
import { ListasProductosComponent } from '../../picking-manual/lista/listas-productos/listas-productos.component';
import { CarrierService } from '../../../../services/src/lib/endpoint/carrier/carrier.service';
import { ListProductsCarrierComponent } from '../../components/list-products-carrier/list-products-carrier.component';

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
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private authenticationService: AuthenticationService,
    private intermediaryService: IntermediaryService,
    private itemReferencesProvider: ItemReferencesProvider,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
    private carrierService: CarrierService,
    private modalCtrl: ModalController
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    }, 500);
  }

  async ngOnInit() {
    console.log('siamo qui');

    this.isStoreUser = await this.authenticationService.isStoreUser();
    if (this.isStoreUser) {
      this.storeUserObj = await this.authenticationService.getStoreCurrentUser();
    }

    this.processInitiated = false;

    if (this.isStoreUser) {
      this.dataToWrite = 'PRODUCTO';
    }
  }

  /**
   * @author Gaetano Sabino
   * @param event
   * @description Crear la modal
   */
  private async modalList(jaula:string){
    let modal = await this.modalCtrl.create({

      component: ListProductsCarrierComponent,
      componentProps: {
        carrierReference:jaula
      }

    })
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data === undefined && data.role === undefined){
        this.focusToInput();
        return;
      }

      if(data.data && data.role === undefined){
        if(this.itemReferencesProvider.checkCodeValue(data.data) === this.itemReferencesProvider.codeValue.PACKING){
          console.log('passo di qui ',this.lastCodeScanned);

          this.focusToInput();
          this.inputPositioning = data.data;
          this.processInitiated = false;
          this.keyUpInput(KeyboardEvent['KeyCode'] = 13,true);
          return;
        }else if(data.role === 'navigate'){
          this.focusToInput();
        }
      }

    })
    modal.present();
  }

  private focusToInput() {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }


  keyUpInput(event?,prova:boolean=false) {
    let warehouseId = this.isStoreUser ? this.storeUserObj.id : this.warehouseService.idWarehouseMain;
    let dataWrited = (this.inputPositioning || "").trim();
    // console.log('chiamo metodo Key',dataWrited,this.processInitiated);

    if (event.keyCode === 13 || prova && dataWrited && !this.processInitiated) {
      // console.log('passo di primo');
      // console.log(dataWrited,this.lastCodeScanned);

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
      if (!this.isStoreUser && (this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.CONTAINER || this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.CONTAINER_OLD)) {
        // console.log('passa qui');

        this.processInitiated = false;
        this.intermediaryService.presentToastSuccess(`Inicio de ubicación en la posición ${dataWrited}`, TimesToastType.DURATION_SUCCESS_TOAST_2000).then(() => {
          setTimeout(() => {
            document.getElementById('input-ta').focus();
          }, 500);
        });
        this.audioProvider.playDefaultOk();
        this.containerReference = dataWrited;
        this.packingReference = null;
        this.dataToWrite = 'PRODUCTO/CONTENEDOR/EMBALAJE';
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
      } else if (!this.isStoreUser && this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.PACKING) {
        // console.log('passa qui por Jaula');
        this.carrierService.getSingle(this.lastCodeScanned).subscribe(data => {
          if(data.packingInventorys.length > 0 && !prova){
            this.modalList(this.lastCodeScanned);
          }else{
            this.processInitiated = false;
            this.intermediaryService.presentToastSuccess(`Inicio de ubicación en el embalaje ${dataWrited}`, TimesToastType.DURATION_SUCCESS_TOAST_2000).then(() => {
              setTimeout(() => {
                document.getElementById('input-ta').focus();
              }, 500);
            });
            this.audioProvider.playDefaultOk();
            this.containerReference = null;
            this.packingReference = dataWrited;
            this.dataToWrite = 'PRODUCTO/CONTENEDOR/EMBALAJE';
            this.inputPositioning = null;
            this.errorMessage = null;
          }
        })
      } else if (!this.isStoreUser && !this.containerReference && !this.packingReference) {
        this.audioProvider.playDefaultError();
        this.inputPositioning = null;
        this.errorMessage = '¡Referencia del contenedor/embalaje errónea!';
        this.processInitiated = false;
      } else {
        this.audioProvider.playDefaultError();
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
    // set params no online 
    params.noOnline = true;
    this.intermediaryService.presentLoading();
    this.inventoryService
      .postStoreOnline(params)
      .then(async (res: InventoryModel.ResponseStore) => {
        this.intermediaryService.dismissLoading();
        if (res.code === 200 || res.code === 201) {
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
          this.processInitiated = false;
          this.intermediaryService.presentToastSuccess(msgSetText, TimesToastType.DURATION_SUCCESS_TOAST_2000).then(() => {
            setTimeout(() => {
              document.getElementById('input-ta').focus();
            }, 500);
          });
          this.audioProvider.playDefaultOk();
        } else if (res.code === 428) {
          this.audioProvider.playDefaultError();
          this.showWarningToForce(params);
        } else if (res.code === 401) {
          if (res.message === 'UserConfirmationRequiredException') {
            this.warningToForce(params, res.errors, false, 'Continuar');
          } else {
            /** Comprobando si tienes permisos para el forzado */
            const permission = await this.inventoryService.checkUserPermissions();
            /** Forzado de empaquetado */
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
            setTimeout(() => {
              document.getElementById('input-ta').focus();
            }, 500);
          });
          this.processInitiated = false;
        }
      }, (error) => {
        this.intermediaryService.dismissLoading();
        this.audioProvider.playDefaultError();
        if (error.error.code === 428) {
          this.showWarningToForce(params);
        } else {
          this.intermediaryService.presentToastError(error.message, PositionsToast.BOTTOM).then(() => {
            setTimeout(() => {
              document.getElementById('input-ta').focus();
            }, 500);
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
              setTimeout(() => {
                document.getElementById('input-ta').focus();
              }, 500);
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
