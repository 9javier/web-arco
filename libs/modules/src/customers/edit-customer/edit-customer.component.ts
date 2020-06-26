import {Component, OnInit} from '@angular/core';
import {NavParams, ModalController} from '@ionic/angular';
import { IntermediaryService} from '@suite/services';
import * as _ from 'lodash';
import { CustomersService } from '../../../../services/src/lib/endpoint/customers/customers.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {CustomerModel} from "../../../../services/src/models/endpoints/Customer";
import { truncate } from 'fs';

@Component({
  selector: 'edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {
  title = 'Editar Cliente';

  listWithNoDestiny;
  customer;
  client;
  dataAddress:CustomerModel.CustomerAddress;
  dataClient:CustomerModel.Customer;
  dataEmail:CustomerModel.CustomerEmail
  newEmail:CustomerModel.CreateCustomerEmail;
  customerId: number;
  emailConfirm:String;
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
  section = 'information';
  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private intermediaryService: IntermediaryService,
    private customersService: CustomersService,
    private formBuilder: FormBuilder

  ) {
    this.customer = this.navParams.get("customer");
  }

  ngOnInit() {
  this.getCustomer(this.customer.id);
  }
  
  close(reload: boolean = false) {
    this.modalController.dismiss(reload);
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
  saveInfo(){
    if(this.emailValidate()){
      this.dataClient.firstName = this.customerForm.get("firstName").value;
      this.dataClient.surname = this.customerForm.get('surname').value;
      this.dataClient.companyName = this.customerForm.get("companyName").value;
      this.updateCustomer(this.dataClient);
    }else{
      this.intermediaryService.presentToastError("Las direcciones de correo electrónico deben ser iguales.");
    }
  
  }
  saveAddress(){
    this.dataAddress.addressLine = this.addressForm.get("addressLine").value;
    this.dataAddress.postCode = this.addressForm.get('postCode').value;
    this.dataAddress.city = this.addressForm.get("city").value;
    this.dataAddress.state = this.addressForm.get("state").value;
    this.updateAddress(this.dataAddress);
  }

  public async updateCustomer(data){
    this.intermediaryService.presentLoading("Actualizando cliente..");
    await this.customersService.postUpdateCustomer(data).subscribe((resp: any) => { 
      if(this.dataEmail){
        this.dataEmail.address = this.customerForm.get("email").value; 
        this.updateEmail(this.dataEmail.id,this.dataEmail.address);  
      }else{
        let body ={
          address: this.customerForm.get('email').value,
          kind : "contact_email"
        }

        this.createEmail(this.customerId,body);
      }
     
    },
      async err => {
        await this.intermediaryService.dismissLoading();
        this.close();
        this.intermediaryService.presentToastError("Error al actualizar el cliente.");

      },
      async () => {
        await this.intermediaryService.dismissLoading()
      })
  }

  public async updateAddress(data){
    this.intermediaryService.presentLoading("Actualizando dirección..");
    await this.customersService.postUpdateAddress(data).subscribe((resp: any) => {  
      this.intermediaryService.dismissLoading();   
      this.close();
    },
      async err => {
        await this.intermediaryService.dismissLoading();
        this.close();
        this.intermediaryService.presentToastError("No se pudo actualizar la dirección del cliente.");

      },
      async () => {
        await this.intermediaryService.dismissLoading()
      })
  }

  public async updateEmail(emailId,emailAddress){
    await this.customersService.putUpdateEmail(emailId,{address: emailAddress}).subscribe((resp: any) => {  
      this.intermediaryService.dismissLoading();   
      this.intermediaryService.presentToastSuccess("Cliente actualizado exitosamente");
      this.close();
    },
      async err => {
        await this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError("Error al actualizar el correo electrónico, intentalo de nuevo");
        this.close();
      },
      async () => {
        await this.intermediaryService.dismissLoading();
      })
  }

  public async createEmail(customerId,email){
    await this.customersService.postCreateEmail(customerId,email).subscribe((resp: any) => {  
      this.intermediaryService.dismissLoading();   
      this.intermediaryService.presentToastSuccess("Cliente actualizado exitosamente");
      this.close();
    },
      async err => {
        await this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError("Error al actualizar el correo electrónico, intentalo de nuevo");
        this.close();
      },
      async () => {
        await this.intermediaryService.dismissLoading();
      })
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
