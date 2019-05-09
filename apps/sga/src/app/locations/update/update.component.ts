import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, ModalController, NavParams, ToastController} from "@ionic/angular";
import {InventoryService} from "../../../../../../libs/services/src/lib/endpoint/inventory/inventory.service";
import {InventoryModel} from "../../../../../../libs/services/src/models/endpoints/Inventory";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";

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
  listHistory: any[] = [
    {
      reference: '00126456',
      name: 'MARCA Modelo Modelo',
      date_add: '01/10/2020',
      date_upd: '05/02/2021',
      date_access: '03/11/2021',
      errors: '1'
    },
    {
      reference: '00124540',
      name: 'MARCA Modelo Modelo',
      date_add: '2/21/2020',
      date_upd: '602/2021',
      date_access: '03/11/2021',
      errors: '2'
    },
    {
      reference: '00122626',
      name: 'MARCA Modelo Modelo',
      date_add: '3/21/2020',
      date_upd: '702/2021',
      date_access: '03/11/2021',
      errors: '3'
    },
    {
      reference: '00127457',
      name: 'MARCA Modelo Modelo',
      date_add: '4/21/2020',
      date_upd: '802/2021',
      date_access: '03/11/2021',
      errors: 'Ninguno'
    },
    {
      reference: '00121123',
      name: 'MARCA Modelo Modelo',
      date_add: '5/21/2020',
      date_upd: '902/2021',
      date_access: '03/11/2021',
      errors: '5'
    },
    {
      reference: '00121123',
      name: 'MARCA Modelo Modelo',
      date_add: '6/21/2020',
      date_upd: '1002/2021',
      date_access: '03/11/2021',
      errors: '6'
    },
    {
      reference: '00121123',
      name: 'MARCA Modelo Modelo',
      date_add: '7/21/2020',
      date_upd: '1102/2021',
      date_access: '03/11/2021',
      errors: '7'
    },
    {
      reference: '00121123',
      name: 'MARCA Modelo Modelo',
      date_add: '8/21/2020',
      date_upd: '1202/2021',
      date_access: '03/11/2021',
      errors: 'Ninguno'
    },
    {
      reference: '00121123',
      name: 'MARCA Modelo Modelo',
      date_add: '9/21/2020',
      date_upd: '1302/2021',
      date_access: '03/11/2021',
      errors: '9'
    },
    {
      reference: '00121123',
      name: 'MARCA Modelo Modelo',
      date_add: '10/10/2020',
      date_upd: '14/02/2021',
      date_access: '03/11/2021',
      errors: '10'
    },
    {
      reference: '00121123',
      name: 'MARCA Modelo Modelo',
      date_add: '11/10/2020',
      date_upd: '15/02/2021',
      date_access: '03/11/2021',
      errors: 'Ninguno'
    },
    {
      reference: '00121123',
      name: 'MARCA Modelo Modelo',
      date_add: '12/10/2020',
      date_upd: '16/02/2021',
      date_access: '03/11/2021',
      errors: '12'
    },
    {
      reference: '00121123',
      name: 'MARCA Modelo Modelo',
      date_add: '13/10/2020',
      date_upd: '17/02/2021',
      date_access: '03/11/2021',
      errors: '13'
    },
    {
      reference: '00121123',
      name: 'MARCA Modelo Modelo',
      date_add: '14/10/2020',
      date_upd: '18/02/2021',
      date_access: '03/11/2021',
      errors: 'Ninguno'
    }
  ];

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
            if (productReference) {
              if (!this.loading) {
                this.showLoading('Ubicando producto...');
              }

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
                    this.presentToast('Producto ' + productReference + ' añadido a la ubicación ' + this.title, 'success');
                  });
                });
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

}
