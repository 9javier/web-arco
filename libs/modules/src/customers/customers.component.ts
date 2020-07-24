import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {  MatSort, Sort ,MatTableDataSource, MatCheckboxChange } from '@angular/material';
import { PredistributionModel } from '../../../services/src/models/endpoints/Predistribution';
import Predistribution = PredistributionModel.Predistribution;
import { IntermediaryService } from '../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PredistributionsService } from '../../../services/src/lib/endpoint/predistributions/predistributions.service';
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import * as Filesave from 'file-saver';
import { catchError } from 'rxjs/operators';
import { from, Observable } from "rxjs";
import { of } from 'rxjs';
import { CustomersService } from '../../../services/src/lib/endpoint/customers/customers.service';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {TableEmitter } from './../../../services/src/models/tableEmitterType';
import {ModalController} from '@ionic/angular';
import {EditCustomerComponent} from './edit-customer/edit-customer.component'
import { Router } from '@angular/router';
import * as _ from "lodash";
import {CustomerModel} from "../../../services/src/models/endpoints/Customer";

@Component({
  selector: 'customer',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  emailConfirm:String;
  section:String;
  customer ={
    id:1
  };
  customerId: number;
  dataAddress:CustomerModel.CustomerAddress;
  dataClient:CustomerModel.Customer;
  dataEmail:CustomerModel.CustomerEmail
  newEmail:CustomerModel.CreateCustomerEmail;
  addressForm: FormGroup = this.formBuilder.group({
    addressLine:['', [Validators.required, Validators.minLength(4)]],
    postCode:['', [Validators.required, Validators.minLength(3)]],
    city:['', [Validators.required, Validators.minLength(3)]],
    state:['', [Validators.required, Validators.minLength(3)]]
  });
  customerForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(4)]],
    surname:['',[Validators.required,Validators.minLength(4)]],
    companyName:['',[Validators.required,Validators.minLength(4)]],
    email:['',[Validators.required,Validators.minLength(4)]],
    confirmEmail:['',[Validators.required,Validators.minLength(4)]],
    phone:['',[Validators.required,Validators.minLength(4)]],
  });
  
  constructor(
    private intermediaryService: IntermediaryService,
    private customersService: CustomersService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,

  ) {}

  ngOnInit(): void {
   this.section ='information';
   this.getCustomer(this.customer.id);

  }

 

  async getCustomer(customerId) {
    this.intermediaryService.presentLoading("Buscado cliente..");
    let body={id:customerId};
    await this.customersService.getCustomerById(body).subscribe((resp: any) => {  
      this.intermediaryService.dismissLoading();
      this.initCustomer(resp);
      this.dataClient = resp;
      this.customerId = resp.id;
      this.dataAddress = resp.address[0];
      if(resp.email != null && resp.email != ""){
        this.dataEmail = resp.email;
      }
      this.initAddress(resp.address[0]);
    },
      async err => {
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.dismissLoading()
      })
  }

  initCustomer(client){
    this.customerForm.get('firstName').patchValue(client.firstName);
    this.customerForm.get('surname').patchValue(client.surname);
    this.customerForm.get('companyName').patchValue(client.companyName);
    this.customerForm.get('email').patchValue(client.email && client.email != null && client.email.address ? client.email.address : '');
  }

  initAddress(address){
    this.addressForm.get('addressLine').patchValue(address.addressLine);
    this.addressForm.get('postCode').patchValue(address.postCode);
    this.addressForm.get('city').patchValue(address.city);
    this.addressForm.get('state').patchValue(address.state); 
  }

 

  
  

  async editCustomer(customer) {
    event.stopPropagation();
    event.preventDefault();

    let modal = await this.modalCtrl.create({
      component: EditCustomerComponent,
      componentProps: {
        customer: customer,
      }
    });

    modal.onDidDismiss().then((p) => {
        
    });

    modal.present();
  }

  get name(){
    return this.customerForm.get('firstName');
  }

  get surname(){
    return this.customerForm.get('surname');
  }
  get companyName(){
    return this.customerForm.get('companyName');
  }
  get email(){
    return this.customerForm.get('email');
  }
  get confirmEmail(){
    return this.customerForm.get('confirmEmail');
  }

  get phone(){
    return this.customerForm.get('phone');
  }
  
  emailValidate(){
    if(this.customerForm.get('email').value == this.customerForm.get('confirmEmail').value){
      return true
    }
    return false
  }
  
  confirmEmailValidate(){
    if(this.emailConfirm.length >0){
      return true
    }
    return false;
  }

  emailConfirmInput(value){
    this.emailConfirm = value;
  }

  get addressLine(){
    return this.addressForm.get('addressLine');
  }
  get postCode(){
    return this.addressForm.get('postCode');
  }
  get city(){
    return this.addressForm.get('city');
  }
  get state(){
    return this.addressForm.get('state');
  }
  
}

