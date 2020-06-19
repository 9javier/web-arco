import {Component, OnInit} from '@angular/core';
import {COLLECTIONS} from 'config/base';
import {NavParams, ModalController} from '@ionic/angular';
import {WarehousesService, WarehouseModel} from '@suite/services';
import {MatSelectChange} from '@angular/material';
import {CarrierService, IntermediaryService} from '@suite/services';
import * as _ from 'lodash';
import { CustomersService } from '../../../../services/src/lib/endpoint/customers/customers.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {
  title = 'Editar Cliente';

  lista;
  warehouses: Array<WarehouseModel.Warehouse> = [];
  warehouse: WarehouseModel.Warehouse;
  listWithNoDestiny;
  customer;
  client;
  customerForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(4)]],
    surname:['',[Validators.required,Validators.minLength(4)]],
    companyName:['',[Validators.required,Validators.minLength(4)]],
  });
  section = 'information';
  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private carrierService: CarrierService,
    private intermediaryService: IntermediaryService,
    private customersService: CustomersService,
    private formBuilder: FormBuilder

  ) {
    this.customer = this.navParams.get("customer");
  }

  ngOnInit() {
  console.log("*****Customer****");
  console.log(this.customer);
  this.getCustomer(this.customer.id);
  }
  
  close(reload: boolean = false) {
    this.modalController.dismiss(reload);
  }

  async getCustomer(customerId) {
    this.intermediaryService.presentLoading("Buscado cliente..");
    let body={id:customerId};
    await this.customersService.getCustomerById(body).subscribe((resp: any) => {  
      console.log("****Cliente******");
      console.log(resp);
      this.client = resp;
      console.log(this.client.companyName);
      this.customerForm.get('firstName').patchValue(this.client.firstName);
      this.customerForm.get('surname').patchValue(this.client.surname);
      this.customerForm.get('companyName').patchValue(this.client.companyName);
      this.intermediaryService.dismissLoading();
    },
      async err => {
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.dismissLoading()
      })
  }

}
