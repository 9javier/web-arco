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
