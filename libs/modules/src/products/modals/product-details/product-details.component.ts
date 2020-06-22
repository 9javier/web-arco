import { Component, OnInit } from '@angular/core';
import { IntermediaryService, TypesService } from '@suite/services';
import { ProductsService, InventoryModel } from '@suite/services';
import { PrinterService } from "../../../../../services/src/lib/printer/printer.service";
import { PrintModel } from "../../../../../services/src/models/endpoints/Print";
import { WarehouseService } from "../../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import { AlertController, LoadingController, ModalController, NavParams } from "@ionic/angular";
import { InventoryService } from "../../../../../services/src/lib/endpoint/inventory/inventory.service";
import { Observable } from "rxjs";
import * as moment from 'moment';
import { HttpResponse } from "@angular/common/http";
import { DateTimeParserService } from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";
import { PermissionsService } from '../../../../../services/src/lib/endpoint/permissions/permissions.service';
import { TimesToastType } from '../../../../../services/src/models/timesToastType';
import {PositionsToast} from "../../../../../services/src/models/positionsToast.type";
@Component({
  selector: 'suite-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  /**The section that by showed in the modal */
  section = 'information';
  title = 'Ubicación ';

  permision: boolean;
  processInitiated: boolean;

  product: InventoryModel.SearchInContainer;
  productHistorical;
  date: any;
  container = null;
  warehouseId: number;

  listProducts: any[] = [];
  listHistory: any[] = [];

  loading = null;

  /**Dictionary for fast access */
  actionTypes = {};
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
  dates: any[] = [];
  hours: any[] = [];

  public isProductRelocationEnabled: boolean = true;

  constructor(
    private typeService: TypesService,
    private productService: ProductsService,
    private modalController: ModalController,
    private navParams: NavParams,
    private printerService: PrinterService,
    private warehouseService: WarehouseService,
    private alertController: AlertController,
    private inventoryService: InventoryService,
    private loadingController: LoadingController,
    private intermediaryService: IntermediaryService,
    private servicePermision: PermissionsService,
    private dateTimeParserService: DateTimeParserService,
  ) {
    this.product = this.navParams.get("product");
  }

  getStatusText(status: number): string{
    const statusProductType = [
      '',
      'Libre',
      'Preasignado',
      'Asignado',
      'Preventilado',
      'Cálculo',
      'Incidencia',
      'Cálculo temporal',
      'Preasignado temporal',
      'Preasignado directo temporal',
      'Preasignado OT temporal',
      'Cálculo OT temporal',
      'Preverificado',
      'Defectuoso',
      'No Apto Online',
      'Verificado',
      'Preverificado OT temporal',
      'Bloqueado',
      'Logística Interna',
      'Asociado a Pedido'
    ];
    return statusProductType[status];
  }

  getFoundText(statusNotFound: number): string{
    const statusProductNotFound = [
      '',
      'Disponible',
      'Primer aviso',
      'Segundo aviso'
    ];
    return statusProductNotFound[statusNotFound];
  }

  ngOnInit() {
    this.container = this.navParams.data.container;
    this.warehouseId = this.navParams.data.warehouseId;
    //this.title += this.container.reference;
    this.listWarehouses = this.warehouseService.listWarehouses;
    this.listHallsOriginal = this.warehouseService.listHalls;
    this.listRowsOriginal = this.warehouseService.listRows;
    this.listColumnsOriginal = this.warehouseService.listColumns;
    this.listReferences = this.warehouseService.listReferences;

    this.warehouseSelected = null;
    this.getProductHistorical();
    this.getActionTypes();
  }

  /**
   * Get action types
   */
  getActionTypes(): void {
    this.typeService.getTypeActions().subscribe(ActionTypes => {
      /**fill the actionTypes dictionary */
      ActionTypes.forEach(actionType => {
        this.actionTypes[actionType.id] = actionType.name
      })
    })
  }

  /**
   * Get historical of products
   */
  getProductHistorical(): void {
    this.productService.getHistorical(this.product.productShoeUnit.id).subscribe(historical => {
      this.productHistorical = historical;

      for (let i = 0; i < historical.length; i++) {
        this.dates[i] = moment(historical[i].updatedAt).format('DD/MM/YYYY');
        this.hours[i] = moment(historical[i].updatedAt).format('HH:mm:ss');
      }
    });
  }

  /**
   * Close the current instance of the modal
   */
  close() {
    this.modalController.dismiss();
  }

  /**
   * Print a Simple Product Tag
   */
  printProductTag() {
    this.printerService.printProductBoxTag(this.printerService.buildString([{ product: <PrintModel.Product>this.product }]));
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

  public async saveDataMovement(product) {
    if (this.warehouseSelected && typeof this.warehouseSelected === 'number') {
      let idWarehouseOrigin = this.product.warehouse.id;
      if (this.warehouseSelected !== idWarehouseOrigin) {
        let alertRequestMovement = await this.alertController.create({
          header: 'Atención',
          message: 'Está a punto de mover un producto entre almacenes y/o tiendas. ¿Quiere generar un escaneo de destino en Avelon para el movimiento?',
          buttons: [
            'Cancelar',
            {
              text: 'No generar',
              handler: () => {
                this.processMovementMessageAndLocate(product, true);
              }
            },
            {
              text: 'Generar',
              handler: () => {
                this.processMovementMessageAndLocate(product, false);
              }
            }
          ]
        });

        await alertRequestMovement.present();
      } else {
        this.processMovementMessageAndLocate(product, true);
      }
    }
  }

  private processMovementMessageAndLocate(product, generateAvelonMovement: boolean) {
        if(this.permision){
          let referenceProduct = product.productShoeUnit.reference;
          let textLoading = 'Reubicando producto...';
          let textToastOk = 'Producto ' + referenceProduct + ' reubicado';
          if (this.referenceContainer) {
            let location = parseInt(this.referenceContainer.substring(1, 4)) + ' . ' + parseInt(this.referenceContainer.substring(8, 11)) + ' . ' + parseInt(this.referenceContainer.substring(5, 7));
            textToastOk += ' en Ubicación ' + location;
          } else {
            textToastOk += ' de tienda.';
          }
          this.locateProductFunction(this.referenceContainer, referenceProduct, this.warehouseSelected, textLoading, textToastOk, generateAvelonMovement);
        }else{
          this.AlertPermision()
        }
  }

  async AlertPermision(){
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

  private locateProductFunction(referenceContainer: string, referenceProduct: string, idWarehouse: number, textLoading: string, textToastOk: string, generateAvelonMovement: boolean) {
    if (!this.loading) {
      this.showLoading(textLoading || 'Ubicando producto...').then(() => {
        let inventoryProcess: InventoryModel.Inventory = {
          productReference: referenceProduct,
          warehouseId: idWarehouse
        };

        if (referenceContainer) inventoryProcess.containerReference = referenceContainer;

        this.storeProductInContainer(inventoryProcess, textToastOk, generateAvelonMovement);
      });
    }
  }
  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }

  private changeSelect(source) {
    switch (source) {
      case 1:
        this.listHalls = this.listHallsOriginal[this.warehouseSelected];
        if (this.listHalls && this.listHalls.length > 0) {
          if (this.listHalls[0].containers) {
            this.hallSelected = this.listHalls[0].id;
          } else {
            this.hallSelected = (this.listHalls.find(hall => hall.containers)).id;
          }
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
            this.intermediaryService.presentToastError(`No se ha registrado la ubicación del producto ${inventoryProcess.productReference} en el contenedor`);
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

  private async warningToForce(params, textToastOk, subHeader, checkPermissionToForce: boolean = true, btnOkMessage: string = 'Forzar') {
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
                this.storeProductInContainer(params, textToastOk);
                this.processInitiated = false;
              } else {
                this.alertController.dismiss();
                this.presentAlert('Su usuario no tiene los permisos suficientes para realizar este forzado de ubicación.');
                this.processInitiated = false;
              }
            } else {
              params.force = true;
              this.storeProductInContainer(params, textToastOk);
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

  private async storeProductInContainer(params, textToastOk, generateAvelonMovement?: boolean) {
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
          this.getProductHistorical();
          this.intermediaryService.presentToastSuccess(textToastOk || ('Producto ' + params.productReference + ' ubicado en ' + this.title), TimesToastType.DURATION_SUCCESS_TOAST_3750);
          this.product.container = res.data.destinationContainer;
          this.product.warehouse = res.data.destinationWarehouse;
          this.product.productShoeUnit = res.data.productShoeUnit;
          this.warehouseSelected = null;
          this.hallSelected = null;
          this.rowSelected = null;
          this.columnSelected = null;
        } else if (res.code === 428) {
          await this.showWarningToForce(params, textToastOk);
        } else if (res.code === 401) {
          if (res.message === 'UserConfirmationRequiredException') {
            this.warningToForce(params, textToastOk, res.errors, false, 'Continuar');
          } else {
            /** Comprobando si tienes permisos para el forzado */
            const permission = await this.inventoryService.checkUserPermissions();
            /** Forzado de empaquetado */
            if (permission.data) {
              this.warningToForce(params, textToastOk, res.errors);
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
          this.intermediaryService.presentToastError(errorMessage);
        }
      }, (error) => {
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
        if (error.error.code === 428) {
          this.showWarningToForce(params, textToastOk);
        } else {
          this.intermediaryService.presentToastError(error.message);
        }
      });
  }
}
