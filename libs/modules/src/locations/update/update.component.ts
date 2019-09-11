import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AlertController, LoadingController, ModalController, NavParams, ToastController} from "@ionic/angular";
import {InventoryService} from "../../../../services/src/lib/endpoint/inventory/inventory.service";
import {InventoryModel} from "../../../../services/src/models/endpoints/Inventory";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {WarehouseService} from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import {DateTimeParserService} from "../../../../services/src/lib/date-time-parser/date-time-parser.service";
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class UpdateComponent implements OnInit {
  title = 'Ubicación ';
  apiEndpoint = 'Wharehouse Maps';
  redirectTo = '/locations';

  container = null;
  warehouseId: number;

  listProducts: any[] = [];
  listHistory: any[] = [];

  loading = null;

  listWarehouses: any[] = [];
  listHalls: any[] = [];
  listHallsOriginal: any = {};
  listRows: any[] = [];
  listRowsOriginal: any = {};
  listColumns: any[] = [];
  listColumnsOriginal: any = {};
  listReferences: any = {};
  warehouseSelected: number;
  hallSelected: number;
  rowSelected: number;
  columnSelected: number;
  referenceContainer: string = '';

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private alertController: AlertController,
    private inventoryService: InventoryService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private warehouseService: WarehouseService,
    private dateTimeParserService: DateTimeParserService,
    private printerService: PrinterService
  ) {}

  ngOnInit() {
    this.container = this.navParams.data.container;
    this.warehouseId = this.navParams.data.warehouseId;
    this.title += this.container.reference;

    this.listWarehouses = this.warehouseService.listWarehouses;
    this.listHallsOriginal = this.warehouseService.listHalls;
    this.listRowsOriginal = this.warehouseService.listRows;
    this.listColumnsOriginal = this.warehouseService.listColumns;
    this.listReferences = this.warehouseService.listReferences;

    this.warehouseSelected = null;

    this.loadProducts();
    this.loadProductsHistory();
  }

  goToList() {
    this.modalController.dismiss();
  }

  loadProducts() {
    this.inventoryService
      .productsByContainer(this.container.id)
      .then((data: Observable<HttpResponse<InventoryModel.ResponseProductsContainer>>) => {
        data.subscribe((res: HttpResponse<InventoryModel.ResponseProductsContainer>) => {
          this.listProducts = res.body.data
            .map(product => {
              return {
                id: product.productShoeUnit.id,
                reference: product.productShoeUnit.reference,
                status: product.status,
                name: 'Producto - ' + product.productShoeUnit.reference,
                warehouseId: product.warehouse.id,
                rackId: product.rack.id,
                containerId: product.container.id,
                hall: product.rack.hall,
                row: product.container.row,
                column: product.container.column,
              }
            });
          if (this.listProducts && this.listProducts.length) {
            this.warehouseSelected = this.listProducts[0].warehouseId;
            this.changeSelect(1);
            this.hallSelected = this.listProducts[0].rackId;
            this.changeSelect(2);
            this.rowSelected = this.listProducts[0].row;
            this.changeSelect(3);
            this.columnSelected = this.listProducts[0].column;
            this.changeSelect(4);
          }
        });
      });
  }

  loadProductsHistory() {
    this.inventoryService
      .productsHistoryByContainer(this.container.id)
      .then((data: Observable<HttpResponse<InventoryModel.ResponseProductsContainer>>) => {
        data.subscribe((res: HttpResponse<InventoryModel.ResponseProductsContainer>) => {
          this.listHistory = res.body.data
            .map(productHistory => {
              return {
                id: productHistory.productShoeUnit.id,
                reference: productHistory.productShoeUnit.reference,
                name: 'Producto - ' + productHistory.productShoeUnit.reference,
                status: productHistory.status,
                date_add: productHistory.createdAt,
                date_upd: productHistory.updatedAt,
                origin_warehouse: productHistory.originWarehouse,
                origin_rack: productHistory.originRack,
                origin_container: productHistory.originContainer,
                destination_warehouse: productHistory.destinationWarehouse,
                destination_rack: productHistory.destinationRack,
                destination_container: productHistory.destinationContainer,
                user: productHistory.logUser,
                errors: 'Ninguno'
              }
            });
        });
      });
  }

  scanProduct() {

  }

  async printBarcode() {
    if(this.container && this.container.reference){
      await this.printerService.print({text: [this.container.reference], type: 0});
    } else {
      // Reference not found
    }
  }

  async addProduct() {
    const alert = await this.alertController.create({
      header: 'Nueva entrada',
      inputs: [
        {
          name: 'productReference',
          type: 'text',
          placeholder: 'Referencia'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel');
          }
        }, {
          text: 'Vale',
          handler: (result) => {
            let productReference = result.productReference;
            if (UpdateComponent.validateProductReference(productReference)) {
              this.locateProductFunction(this.container.reference, productReference, this.warehouseId, null, null);
            } else {
              document.getElementsByClassName('alert-input sc-ion-alert-md')[0].className += " alert-add-product wrong-reference";
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3750,
      color: color || "primary"
    });
    toast.present();
  }

  static validateProductReference(reference: string) : boolean {
    return !(typeof reference == 'undefined' || !reference || reference == '' || reference.length != 18);
  }

  private changeSelect(source) {
    switch (source) {
      case 1:
        this.listHalls = this.listHallsOriginal[this.warehouseSelected];
        if (this.listHalls && this.listHalls.length > 0) {
          this.hallSelected = this.listHalls[0].id;
          this.listRows = this.listRowsOriginal[this.warehouseSelected][this.hallSelected];
          this.rowSelected = this.listRows[0].row;
          this.listColumns = this.listColumnsOriginal[this.warehouseSelected][this.hallSelected][this.rowSelected];
          this.columnSelected = this.listColumns[0].column;
          this.referenceContainer = this.listReferences[this.warehouseSelected][this.hallSelected][this.rowSelected][this.columnSelected];
        } else {
          this.referenceContainer = null;
        }
        break;
      case 2:
        this.listRows = this.listRowsOriginal[this.warehouseSelected][this.hallSelected];
        if (this.listRows && this.listRows.length > 0) {
          this.rowSelected = this.listRows[0].row;
          this.listColumns = this.listColumnsOriginal[this.warehouseSelected][this.hallSelected][this.rowSelected];
          this.columnSelected = this.listColumns[0].column;
          this.referenceContainer = this.listReferences[this.warehouseSelected][this.hallSelected][this.rowSelected][this.columnSelected];
        } else {
          this.referenceContainer = null;
        }
        break;
      case 3:
        this.listColumns = this.listColumnsOriginal[this.warehouseSelected][this.hallSelected][this.rowSelected];
        if (this.listColumns && this.listColumns.length > 0) {
          this.columnSelected = this.listColumns[0].column;
          this.referenceContainer = this.listReferences[this.warehouseSelected][this.hallSelected][this.rowSelected][this.columnSelected];
        } else {
          this.referenceContainer = null;
        }
        break;
      case 4:
        this.referenceContainer = this.listReferences[this.warehouseSelected][this.hallSelected][this.rowSelected][this.columnSelected];
        break;
    }
  }

  private checkFieldIsEnabled(source) {
    switch (source) {
      case 2:
        return this.listHallsOriginal[this.warehouseSelected];
      case 3:
        return this.listRowsOriginal[this.warehouseSelected] && this.listRowsOriginal[this.warehouseSelected][this.hallSelected];
      case 4:
        return this.listColumnsOriginal[this.warehouseSelected] && this.listColumnsOriginal[this.warehouseSelected][this.hallSelected] && this.listColumnsOriginal[this.warehouseSelected][this.hallSelected][this.rowSelected];
    }
  }

  private resetDataMovement() {
    this.warehouseSelected = null;
  }

  private saveDataMovement(product) {
    if (this.warehouseSelected && typeof this.warehouseSelected == 'number') {
      let referenceProduct = product.reference;
      let textLoading = 'Reubicando producto...';
      let textToastOk = 'Producto ' + referenceProduct + ' reubicado';
      if (this.referenceContainer) {
        let location = parseInt(this.referenceContainer.substring(1, 4)) + ' . ' + parseInt(this.referenceContainer.substring(8, 11)) + ' . ' + parseInt(this.referenceContainer.substring(5, 7));
        textToastOk += ' en Ubicación ' + location;
      } else {
        textToastOk += ' de tienda.';
      }

      this.locateProductFunction(this.referenceContainer, referenceProduct, this.warehouseSelected, textLoading, textToastOk);
    }
  }

  private locateProductFunction(referenceContainer: string, referenceProduct: string, idWarehouse: number, textLoading: string, textToastOk: string) {
    if (!this.loading) {
      this.showLoading(textLoading || 'Ubicando producto...').then(() => {
        let inventoryProcess: InventoryModel.Inventory = {
          productReference: referenceProduct,
          warehouseId: idWarehouse
        };

        if (referenceContainer) inventoryProcess.containerReference = referenceContainer;

        this.storeProductInContainer(inventoryProcess, textToastOk);
      });
    }
  }

  async showWarningToForce(inventoryProcess, textToastOk) {
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: 'No se esperaba la entrada del producto que acaba de escanear. ¿Desea forzar la entrada del producto igualmente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.presentToast(`No se ha registrado la ubicación del producto ${inventoryProcess.productReference} en el contenedor`, 'danger');
          }
        }, {
          text: 'Forzar',
          handler: () => {
            inventoryProcess.force = true;
            this.storeProductInContainer(inventoryProcess, textToastOk);
          }
        }
      ]
    });

    await alert.present();
  }

  private storeProductInContainer(params, textToastOk) {
    this.inventoryService
      .postStore(params)
      .then((data: Observable<HttpResponse<InventoryModel.ResponseStore>>) => {
        data.subscribe((res: HttpResponse<InventoryModel.ResponseStore>) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          if (res.body.code == 200 || res.body.code == 201) {
            this.presentToast(textToastOk || ('Producto ' + params.productReference + ' ubicado en ' + this.title), 'success');
            this.loadProducts();
            this.loadProductsHistory();
          } else if (res.body.code == 428) {
            this.showWarningToForce(params, textToastOk);
          } else {
            let errorMessage = '';
            if (res.body.errors.productReference && res.body.errors.productReference.message) {
              errorMessage = res.body.errors.productReference.message;
            } else {
              errorMessage = res.body.message;
            }
            this.presentToast(errorMessage, 'danger');
          }
        }, (error: HttpErrorResponse) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          if (error.error.code == 428) {
            this.showWarningToForce(params, textToastOk);
          } else {
            this.presentToast(error.error.message, 'danger');
          }
        });
      }, (error: HttpErrorResponse) => {
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
        if (error.error.code == 428) {
          this.showWarningToForce(params, textToastOk);
        } else {
          this.presentToast(error.message, 'danger');
        }
      });
  }

  showTimeFromNow(dateToFormat) : string {
    return this.dateTimeParserService.timeFromNow(dateToFormat);
  }

  showDateTime(dateToFormat) : string {
    return this.dateTimeParserService.dateTime(dateToFormat);
  }

}
