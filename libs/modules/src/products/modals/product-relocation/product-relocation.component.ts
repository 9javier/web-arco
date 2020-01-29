import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import {
  IntermediaryService,
  InventoryModel,
  InventoryService,
  WarehouseService
} from '@suite/services';
import { PermissionsService } from '../../../../../services/src/lib/endpoint/permissions/permissions.service';
import { PositionsToast } from '../../../../../services/src/models/positionsToast.type';
import { TimesToastType } from '../../../../../services/src/models/timesToastType';

@Component({
  selector: 'suite-product-relocation',
  templateUrl: './product-relocation.component.html',
  styleUrls: ['./product-relocation.component.scss']
})
export class ProductRelocationComponent implements OnInit {
  products: InventoryModel.SearchInContainer[];
  listWarehouses: any[] = [];
  listHalls: any[] = [];
  listRows: any[] = [];

  listHallsOriginal: any = {};
  listRowsOriginal: any = {};
  listColumnsOriginal: any = {};

  rowSelected: number;
  columnSelected: number;
  referenceContainer: string = '';
  listReferences: any = {};
  permision: boolean;
  processInitiated: boolean;
  loading = null;

  warehouseSelected: number;
  listColumns: any[] = [];
  hallSelected: number;
  title = 'Ubicación ';

  constructor(
    private modalController: ModalController,
    private warehouseService: WarehouseService,
    private navParams: NavParams,
    private loadingController: LoadingController,
    private intermediaryService: IntermediaryService,
    private servicePermision: PermissionsService,
    private alertController: AlertController,
    private inventoryService: InventoryService
  ) {
    this.products = this.navParams.get('products');
  }

  ngOnInit() {
    this.listWarehouses = this.warehouseService.listWarehouses;
    this.listHallsOriginal = this.warehouseService.listHalls;
    this.listRowsOriginal = this.warehouseService.listRows;
    this.listColumnsOriginal = this.warehouseService.listColumns;
    this.listReferences = this.warehouseService.listReferences;
    this.warehouseSelected = null;
  }

  async close(status: boolean = false) {
    await this.modalController.dismiss({
      dismissed: status
    });
  }

  async saveDataMovement() {
    if (this.warehouseSelected && typeof this.warehouseSelected === 'number') {
      let countDifferent = 0;
      this.products.forEach(async product => {
        if (product.warehouse.id !== this.warehouseSelected) {
          countDifferent += 1;
        }
      });

      if (countDifferent > 0) {
        await this.alertRelocationProduct(countDifferent);
      } else {
        this.processMovementMessageAndLocate(true);
      }
    }
  }

  private async alertRelocationProduct(countDifferent: number) {
    let alertRequestMovement = await this.alertController.create({
      header: 'Atención',
      message: `Está a punto de mover ${countDifferent} de ${
        this.products.length
      } productos seleccionados entre almacenes y/o tiendas. ¿Quiere generar un escaneo de destino en Avelon para el movimiento?`,
      buttons: [
        'Cancelar',
        {
          text: 'No generar',
          handler: () => {
            this.processMovementMessageAndLocate(true);
          }
        },
        {
          text: 'Generar',
          handler: () => {
            this.processMovementMessageAndLocate(false);
          }
        }
      ]
    });

    await alertRequestMovement.present();
  }

  private processMovementMessageAndLocate(generateAvelonMovement: boolean) {
    if (this.permision) {
      let textToastOk = 'Productos reubicados';
      if (this.referenceContainer) {
        let location =
          Number(this.referenceContainer.substring(1, 4)) +
          ' . ' +
          Number(this.referenceContainer.substring(8, 11)) +
          ' . ' +
          Number(this.referenceContainer.substring(5, 7));
        textToastOk += ' en Ubicación ' + location;
        this.locateProductFunction(textToastOk, generateAvelonMovement);
      } else {
        textToastOk += ' de tienda.';
        this.locateProductFunction(textToastOk, generateAvelonMovement);
      }
    } else {
      this.AlertPermision();
    }
  }

  async AlertPermision() {
    let alert = await this.alertController.create({
      header:'Operación no permitida',
      message:'No tiene los permisos necesarios para realizar la acción',
      buttons:[{
        text:'Aceptar',
        handler:()=>{
          this.close();
        }
      }]
    });
    await alert.present();
  }

  private locateProductFunction(
    textToastOk: string,
    generateAvelonMovement: boolean
  ) {
    if (!this.loading) {
      this.showLoading('Ubicando productos...').then(() => {
        this.products.forEach((product, index) => {
          let inventoryProcess: InventoryModel.Inventory = {
            productReference: product.productShoeUnit.reference,
            warehouseId: this.warehouseSelected
          };

          if (this.referenceContainer) {
            inventoryProcess.containerReference = this.referenceContainer;
          }

          this.storeProductInContainer(
            inventoryProcess,
            textToastOk,
            index,
            generateAvelonMovement
          );
        });
      });
    }
  }

  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true
    });
    return await this.loading.present();
  }

  private storeProductInContainer(
    params,
    textToastOk,
    index: number,
    generateAvelonMovement?: boolean
  ) {
    if (typeof generateAvelonMovement !== 'undefined') {
      params.avoidAvelonMovement = generateAvelonMovement;
    }

    this.inventoryService.postStore(params).then(
      async (res: InventoryModel.ResponseStore) => {
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
        if (res.code === 200 || res.code === 201) {
          await this.intermediaryService.presentToastSuccess(textToastOk || ('Producto ' + params.productReference + ' ubicado en ' + this.title), TimesToastType.DURATION_SUCCESS_TOAST_3750);
          this.products[index].container = res.data.destinationContainer;
          this.products[index].warehouse = res.data.destinationWarehouse;
          this.products[index].productShoeUnit = res.data.productShoeUnit;
          this.warehouseSelected = null;
          this.hallSelected = null;
          this.rowSelected = null;
          this.columnSelected = null;
          await this.close(true);
        } else if (res.code === 428) {
          await this.showWarningToForce(params, index, textToastOk);
        } else if (res.code === 401) {
          if (res.message === 'UserConfirmationRequiredException') {
            await this.warningToForce(params, index, textToastOk, res.errors, false, 'Continuar');
          } else {
            /** Comprobando si tienes permisos para el forzado */
            const permission = await this.inventoryService.checkUserPermissions();
            /** Forzado de empaquetado */
            if (permission.data) {
              await this.warningToForce(params, index, textToastOk, res.errors);
            } else {
              await this.presentAlert(res.errors);
              this.processInitiated = false;
            }
          }
        } else {
          let errorMessage = res.message;
          if (res.errors) {
            if (typeof res.errors === 'string') {
              errorMessage = res.errors;
            } else {
              if (
                res.errors.productReference &&
                res.errors.productReference.message
              ) {
                errorMessage = res.errors.productReference.message;
              }
            }
          }
          await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
        }

      },
      async error => {
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
        if (error.error.code === 428) {
          await this.showWarningToForce(params, index, textToastOk);
        } else {
          this.intermediaryService.presentToastError(error.message, PositionsToast.BOTTOM);
        }
      }
    );
  }

  private async warningToForce(params, index, textToastOk, subHeader, checkPermissionToForce: boolean = true, btnOkMessage: string = 'Forzar') {
    const alertWarning = await this.alertController.create({
      header: 'Atención',
      subHeader,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            this.intermediaryService.presentToastError('El producto no se ha ubicado.', PositionsToast.BOTTOM);
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
                this.storeProductInContainer(params, textToastOk, index);
                this.processInitiated = false;
              } else {
                this.alertController.dismiss();
                this.presentAlert('Su usuario no tiene los permisos suficientes para realizar este forzado de ubicación.');
                this.processInitiated = false;
              }
            } else {
              params.force = true;
              this.storeProductInContainer(params, textToastOk, index);
              this.processInitiated = false;
            }
          }
        }]
    });
    return await alertWarning.present();
  }

  async showWarningToForce(inventoryProcess, index, textToastOk) {
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: 'No se esperaba la entrada del producto que acaba de escanear. ¿Desea forzar la entrada del producto igualmente?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.intermediaryService.presentToastError(`No se ha registrado la ubicación del producto ${ inventoryProcess.productReference } en el contenedor`, PositionsToast.BOTTOM);
          }
        },
        {
          text: 'Forzar',
          handler: () => {
            inventoryProcess.force = true;
            this.storeProductInContainer(inventoryProcess, textToastOk, index);
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlert(subHeader) {
    const alert = await this.alertController.create({
      header: 'Atencion',
      subHeader,
      buttons: ['OK']
    });
    await alert.present();
  }

  checkFieldIsEnabled(source) {
    switch (source) {
      case 2:
        return this.listHallsOriginal[this.warehouseSelected];
      case 3:
        return (
          this.listRowsOriginal[this.warehouseSelected] &&
          this.listRowsOriginal[this.warehouseSelected][this.hallSelected]
        );
      case 4:
        return (
          this.listColumnsOriginal[this.warehouseSelected] &&
          this.listColumnsOriginal[this.warehouseSelected][this.hallSelected] &&
          this.listColumnsOriginal[this.warehouseSelected][this.hallSelected][
            this.rowSelected
          ]
        );
    }
  }

  changeSelect(source) {
    switch (source) {
      case 1:
        this.hallSelected = null;
        this.rowSelected = null;
        this.columnSelected = null;
        this.listHalls = this.listHallsOriginal[this.warehouseSelected];
        if (this.listHalls && this.listHalls.length > 0) {
          if (this.listHalls[0].containers) {
            this.hallSelected = this.listHalls[0].id;
          } else {
            this.hallSelected = this.listHalls.find(hall => hall.containers).id;
          }
          this.listRows = this.listRowsOriginal[this.warehouseSelected][
            this.hallSelected
          ];
          this.rowSelected = this.listRows[0].row;
          this.listColumns = this.listColumnsOriginal[this.warehouseSelected][
            this.hallSelected
          ][this.rowSelected];
          this.columnSelected = this.listColumns[0].column;
          this.referenceContainer = this.listReferences[this.warehouseSelected][
            this.hallSelected
          ][this.rowSelected][this.columnSelected];
        } else {
          this.referenceContainer = null;
        }
        break;
      case 2:
        this.listRows = this.listRowsOriginal[this.warehouseSelected][
          this.hallSelected
        ];
        if (this.listRows && this.listRows.length > 0) {
          this.rowSelected = this.listRows[0].row;
          this.listColumns = this.listColumnsOriginal[this.warehouseSelected][
            this.hallSelected
          ][this.rowSelected];
          this.columnSelected = this.listColumns[0].column;
          this.referenceContainer = this.listReferences[this.warehouseSelected][
            this.hallSelected
          ][this.rowSelected][this.columnSelected];
        } else {
          this.referenceContainer = null;
        }
        break;
      case 3:
        this.listColumns = this.listColumnsOriginal[this.warehouseSelected][
          this.hallSelected
        ][this.rowSelected];
        if (this.listColumns && this.listColumns.length > 0) {
          this.columnSelected = this.listColumns[0].column;
          this.referenceContainer = this.listReferences[this.warehouseSelected][
            this.hallSelected
          ][this.rowSelected][this.columnSelected];
        } else {
          this.referenceContainer = null;
        }
        break;
      case 4:
        this.referenceContainer = this.listReferences[this.warehouseSelected][
          this.hallSelected
        ][this.rowSelected][this.columnSelected];
        break;
    }
  }

  resetDataMovement() {
    this.warehouseSelected = null;
    this.hallSelected = null;
    this.rowSelected = null;
    this.columnSelected = null;
  }
}
