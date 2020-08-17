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
import { ActivatedRoute,Router } from '@angular/router';import * as _ from "lodash";
import {CustomerModel} from "../../../services/src/models/endpoints/Customer";
import {MatAccordion} from '@angular/material/expansion';
import {Countries} from './CountriesList';
@Component({
  selector: 'customer',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  initFormAddress:boolean = false;
  emailConfirm:String;
  section:String;
  customer ={
    id:1
  };
  countries= Countries;
  addressId:number;
  address:[];
  customerId: number;
  dataAddress:CustomerModel.CustomerAddress;
  closedAddressPanel=true;
  dataClient:CustomerModel.Customer;
  dataEmail:CustomerModel.CustomerEmail
  newEmail:CustomerModel.CreateCustomerEmail;
  addressForm: FormGroup = this.formBuilder.group({
    addressLine:['', [Validators.required, Validators.minLength(4)]],
    postCode:['', [Validators.required, Validators.minLength(3)]],
    countryOriginalName:['',[Validators.required,Validators.minLength(2)]],
    city:['', [Validators.required, Validators.minLength(3)]],
    state:['', [Validators.required, Validators.minLength(3)]],
    phoneNumber:['',[Validators.required,Validators.minLength(4)]],
  });
  customerForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(4)]],
    surname:['',[Validators.required,Validators.minLength(4)]],
    companyName:['',[Validators.required,Validators.minLength(4)]],
    email:['',[Validators.required,Validators.minLength(4)]],
    confirmEmail:['',[Validators.required,Validators.minLength(4)]],
  });
  
  constructor(
    private intermediaryService: IntermediaryService,
    private customersService: CustomersService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private route:ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const token =this.route.snapshot.paramMap.get('token');
    this.section ='information';
    
    this.getCustomer(token);
  }

  async getCustomer(token) {
    let body={token}
    this.intermediaryService.presentLoading("Buscado cliente..");
    await this.customersService.getCustomerByToken(body).subscribe((resp: any) => {  
      this.intermediaryService.dismissLoading();
      this.initCustomer(resp);
      this.dataClient = resp;
      this.customerId = resp.id;
      this.address = resp.address;
      if(resp.email != null && resp.email != ""){
        this.dataEmail = resp.email;
      }
      //this.initAddress(resp.address[0]);
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
    this.addressForm.get('countryOriginalName').patchValue(address.countryOriginalName);
    this.addressForm.get('addressLine').patchValue(address.addressLine);
    this.addressForm.get('postCode').patchValue(address.postCode);
    this.addressForm.get('city').patchValue(address.city ? address.city :'');
    this.addressForm.get('state').patchValue(address.state);
    let phone ='';
    if(address.phoneNumbers.length >0){
       phone = address.phoneNumbers[0].fullNumber+"".trim();
    }
    this.addressForm.get('phoneNumber').patchValue(phone);  
  }

 
  async getAddressById(addressId:number){
    this.intermediaryService.presentLoading("Cargando Dirección...");
    this.customersService.getAddressById(addressId).subscribe(result =>{
      this.intermediaryService.dismissLoading();
      this.initAddress(result);

    },async error=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error al cargar la dirección.");
    });
  }
  
  saveInfo(){
    if(this.emailValidate()){
      this.dataClient.firstName = (this.customerForm.get("firstName").value).toString().toUpperCase();
      this.dataClient.surname = (this.customerForm.get('surname').value).toString().toUpperCase();
      this.dataClient.companyName = (this.customerForm.get("companyName").value).toString().toUpperCase();
      this.updateCustomer(this.dataClient);
    }else{
      this.intermediaryService.presentToastError("Las direcciones de correo electrónico deben ser iguales.");
    }
  
  }
  saveAddress(){
    if(this.phoneValidate()){
      this.updateAddress(this.addressForm.value);
    }else{
      this.intermediaryService.presentToastError("Teléfono invalido, este debe contener solo numeros y máximo de 15 caracteres");
    }
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
       
        this.intermediaryService.presentToastError("Error al actualizar el cliente.");

      },
      async () => {
        await this.intermediaryService.dismissLoading()
      })
  }

  public async updateEmail(emailId,emailAddress){
    await this.customersService.putUpdateEmail(emailId,{address: emailAddress}).subscribe((resp: any) => {  
      this.intermediaryService.dismissLoading();   
      this.intermediaryService.presentToastSuccess("Cliente actualizado exitosamente");
     
    },
      async err => {
        await this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError("Error al actualizar el correo electrónico, intentalo de nuevo");
      
      },
      async () => {
        await this.intermediaryService.dismissLoading();
      })
  }

  public async createEmail(customerId,email){
    await this.customersService.postCreateEmail(customerId,email).subscribe((resp: any) => {  
      this.intermediaryService.dismissLoading();   
      this.intermediaryService.presentToastSuccess("Cliente actualizado exitosamente");
     
    },
      async err => {
        await this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError("Error al actualizar el correo electrónico, intentalo de nuevo");
      },
      async () => {
        await this.intermediaryService.dismissLoading();
      })
  }

  public async updateAddress(data){
    this.intermediaryService.presentLoading("Actualizando dirección..");
    await this.customersService.postUpdateAddress(data,this.addressId).subscribe((resp: any) => {  
      this.intermediaryService.dismissLoading();   
      this.intermediaryService.presentToastSuccess("Dirección actualizada exitosamente");
    },
      async err => {
        await this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError("No se pudo actualizar la dirección");

      },
      async () => {
        await this.intermediaryService.dismissLoading()
      })
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
  get countryOriginalName(){
    return this.addressForm.get('countryOriginalName');
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

  get fullNumber(){
    return this.addressForm.get('phoneNumber');
  } 

  phoneValidate(){
    if(isNaN(this.customerForm.get('phoneNumber').value)){
      return false
    }
    return true
  }

  get closedPanel(){
    return this.closedAddressPanel;
  }

  setStep(addressId){
    this.closedAddressPanel = false;
    this.accordion.openAll();
    this.initFormAddress = true;
    this.addressId = addressId;
    this.getAddressById(addressId);
  }
  
  closedPanelAddress(){
    this.closedAddressPanel=true;
  }
  

}

