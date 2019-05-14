import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, ModalController, NavParams, ToastController} from "@ionic/angular";
import {InventoryService} from "../../../../../../libs/services/src/lib/endpoint/inventory/inventory.service";
import {InventoryModel} from "../../../../../../libs/services/src/models/endpoints/Inventory";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class UpdateComponent implements OnInit {
  formBuilderDataInputs = {
    rows: ['', Validators.required],
    columns: ['', Validators.required]
  };
  formBuilderTemplateInputs = [
    {
      name: 'rows',
      label: 'Número de Filas',
      type: 'select',
      value: [1, 2, 3, 4, 5],
      icon: {type: 'md', name: 'view_stream'}
    },
    {
      name: 'columns',
      label: 'Número de Columnas',
      type: 'select',
      value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
      icon: {type: 'md', name: 'view_column'}
    }
  ];
  title = 'Ubicación ';
  apiEndpoint = 'Wharehouse Maps';
  redirectTo = '/locations';
  updateForm: FormGroup;

  container = null;
  warehouseId: number;

  listProducts: any[] = [];
  listRacks: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  listRows: number[] = [1, 2, 3, 4, 5];
  listColumns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  listEnable: string[] = ['Activar', 'Desactivar'];
  listHistory: any[] = [];

  loading = null;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private inventoryService: InventoryService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.container = this.navParams.data.container;
    this.warehouseId = this.navParams.data.warehouseId;
    this.title += this.container.column + ' . ' + this.container.row;
    this.updateForm = this.formBuilder.group(
      this.formBuilderDataInputs,
      {}
    );
    this.loadProducts();
    this.loadProductsHistory()
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
                name: 'Producto - ' + product.productShoeUnit.reference
              }
            });
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
                destination_warehouse: productHistory.destinationWarehouse,
                user: productHistory.logUser,
                errors: 'Ninguno'
              }
            });
        });
      });
  }

  get f() {
    return this.updateForm.controls;
  }

  scanProduct() {

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
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Vale',
          handler: (result) => {
            let productReference = result.productReference;
            if (UpdateComponent.validateProductReference(productReference)) {
              if (!this.loading) {
                this.showLoading('Ubicando producto...').then(() => {
                  let inventoryProcess: InventoryModel.Inventory = {
                    productReference: productReference,
                    containerReference: this.container.reference,
                    warehouseId: this.warehouseId
                  };
                  this.inventoryService
                    .postStore(inventoryProcess)
                    .then((data: Observable<HttpResponse<InventoryModel.ResponseStore>>) => {
                      data.subscribe((res: HttpResponse<InventoryModel.ResponseStore>) => {
                        if (this.loading) {
                          this.loading.dismiss();
                          this.loading = null;
                        }
                        if (res.body.code == 200 || res.body.code == 201) {
                          this.presentToast('Producto ' + productReference + ' añadido a la ubicación ' + this.title, 'success');
                          this.loadProducts();
                          this.loadProductsHistory()
                        } else {
                          let errorMessage = '';
                          if (res.body.errors.productReference && res.body.errors.productReference.message) {
                            errorMessage = res.body.errors.productReference.message;
                          } else {
                            errorMessage = res.body.message;
                          }
                          this.presentToast(errorMessage, 'danger');
                        }
                      });
                    }, (error: HttpErrorResponse) => {
                      this.presentToast(error.message, 'danger');
                    });
                });
              }
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

}
