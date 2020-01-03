import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { InventoryModel, InventoryService, WarehouseService } from '@suite/services';
import { PermissionsService } from '../../../../../services/src/lib/endpoint/permissions/permissions.service';

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
    private toastController: ToastController,
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
      header: '¡Usted no tiene los Permisos para gererar esta operacion!',
      message: 'Pedir permissos',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.close();
          }
        }
      ]
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
          await this.presentToast(
            textToastOk ||
              'Producto ' +
                params.productReference +
                ' ubicado en ' +
                this.title,
            'success'
          );
          this.products[index].container = res.data.destinationContainer;
          this.products[index].warehouse = res.data.destinationWarehouse;
          this.products[index].productShoeUnit = res.data.productShoeUnit;
          this.warehouseSelected = null;
          this.hallSelected = null;
          this.rowSelected = null;
          this.columnSelected = null;
        } else if (res.code === 428) {
          await this.showWarningToForce(params, index, textToastOk);
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
          await this.presentToast(errorMessage, 'danger');
        }

        await this.close(true);
      },
      async error => {
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
        if (error.error.code === 428) {
          await this.showWarningToForce(params, index, textToastOk);
        } else {
          await this.presentToast(error.message, 'danger');
        }
      }
    );
  }

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3750,
      color: color || 'primary'
    });
    toast.present();
  }

  async showWarningToForce(inventoryProcess, index, textToastOk) {
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader:
        'No se esperaba la entrada del producto que acaba de escanear. ¿Desea forzar la entrada del producto igualmente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.presentToast(
              `No se ha registrado la ubicación del producto ${
                inventoryProcess.productReference
              } en el contenedor`,
              'danger'
            );
          }
        },
        {
          text: 'Forzar',
          handler: () => {
            inventoryProcess.force = true;
            this.storeProductInContainer(inventoryProcess, index, textToastOk);
          }
        }
      ]
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
