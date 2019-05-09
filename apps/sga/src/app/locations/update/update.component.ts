import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController, NavParams} from "@ionic/angular";
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

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService
    ) {}

  ngOnInit() {
    this.container = this.navParams.data.container;
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

}
