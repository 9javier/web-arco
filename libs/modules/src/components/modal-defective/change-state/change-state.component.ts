import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from "@ionic/angular";
import { RegistryDetailsComponent } from '../registry-details/registry-details.component';
import { IntermediaryService, IncidentsService, environment, UploadFilesService } from '../../../../../services/src';
import {formatDate} from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'suite-change-state',
  templateUrl: './change-state.component.html',
  styleUrls: ['./change-state.component.scss']
})
export class ChangeStateComponent implements OnInit {
  allDefectType=[];
  ticketEmit: boolean;
  passHistory:boolean = true;
  requirePhoto:boolean = true;
  requireContact: boolean = true;
  requireOk: boolean = true;
  checkHistory: boolean;
  registry;
  barcode ="64565465645655";
  txtName =""
  txtEmail="";
  txtTel="";
  apiURL: string = environment.uploadFiles + '?type=defects'
  imgData: string;
  img: any;
  photos: Array<any> = []
  signatures: Array<any> = []
  photoList: boolean = false;
  signatureList: boolean = false;

  date: string;
  dateNow = formatDate(new Date(), 'dd/MM/yyyy', 'es');
  dateDetection;
  incidenceForm: FormGroup;
  defectContacto: FormGroup;
  readed: boolean;
  defectChildId;
  defectParentId;
  ParentAndChild;
  showChangeState;

  constructor(
    private incidentsService: IncidentsService,
    private intermediary: IntermediaryService,
    private modalController: ModalController,
    private navParams: NavParams,
    private fb: FormBuilder,
    private intermediaryService: IntermediaryService,
  ) {
    this.registry = this.navParams.get("registry");
    
  }

  ngOnInit() {
    
    this.date =  formatDate(this.registry.dateDetection, 'dd/MM/yyyy', 'es');
    console.log("registro:")
    console.log(this.registry);
    this.initForm();
    
  }


  initForm() {
   this.incidenceForm = this.fb.group({
      productId: 1,
      productReference: '',
      dateDetection:[this.date],
      observations: [this.registry.observations],
      factoryReturn: [false],
      statusManagementDefectId: [this.registry.statusManagementDefect.id],
      defectTypeChildId: [this.registry.defectTypeChild.id],
      signFileId: [1],
      gestionState: 0, 
      contact: this.fb.group({
        name: [this.registry.contact.name],
        email: [this.registry.contact.email],
        phone: [this.registry.contact.phone]
      }) 
      
    })

    this.txtName = this.registry.contact.name;
    this.txtEmail = this.registry.contact.email;
    this.txtTel = this.registry.contact.phone;

    this.ParentAndChild = this.registry.defectTypeChild.name +" - "
    +this.registry.defectTypeParent.name;

  }


  validate(){

    let regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
     let validation = true;
     let msg;
     let This = this;
     console.log(this.txtName.length);

     if( this.txtName.length < 4){
      console.log("name false");
      msg="Nombre debe tener minimo 4 digítos...";
       validation = false;
     }if(this.txtEmail.length < 1){
         msg="Campo email vacío";
         validation = false;
     }
     if(this.txtTel.length < 6){
      console.log("telefono false");
      msg="Teléfono debe tener minimo 6 digítos...";
      validation = false;
    }
    if(!regex.test(this.txtEmail)){
      console.log("email validation true");
      msg="Email invalido...";
      validation = false;
      console.log("email false");
    }

    if(msg == undefined){ 

    }else{
      if(msg.length > 0){
        This.intermediary.presentToastError(msg); 
      }
    }

    return validation;
  }

  send(){

    console.log("aqui "+this.requireContact);
    console.log(this.incidenceForm);
    if(this.requireContact == true){
      if(this.validate()){
        this.sendToIncidents();
      }
    }
    else{
      /*this.incidenceForm.patchValue({
        statusManagementDefectId: this.managementId,
        defectTypeChildId: this.defectChildId,
      });*/
      let object = this.incidenceForm.value;
      delete object.contact;
      this.sendToDefectsWithoutContact(object);
    }  
  }


  

  async close() {
    await this.modalController.dismiss().then(async () => {
      const modal = await this.modalController.create({
        component: RegistryDetailsComponent,
        componentProps: {
          productId: this.registry.product.id,
          showChangeState: true
        }
      });

      return await modal.present();
    });
  }


  onKeyName(event){
    this.txtName = event.target.value;
  }
  onKeyEmail(event){
    this.txtEmail = event.target.value;
  }
  onKeyTel(event){
    this.txtTel = event.target.value;
  }

  async sendToIncidents() {
    this.incidenceForm.value.contact.phone = this.txtTel+"";
   /* this.incidenceForm.patchValue({
      statusManagementDefectId: this.managementId,
      defectTypeChildId: this.defectChildId,

    })*/
   

    let This = this;

    This.incidentsService.addRegistry(this.incidenceForm.value).subscribe(
      resp => {

        if(this.ticketEmit == true){
          this.print();
        }

        this.readed = false
        this.incidenceForm.patchValue({
          productId: 1,
          productReference: '',
          dateDetection: this.dateNow,
          observations: '',
          factoryReturn: false,
          statusManagementDefectId: 0,
          defectTypeChildId: 0,
          photosFileIds: [],
          signFileId: 0,
          contact: {
            name: '',
            email: '',
            phone: ''
          }
        })
        this.photos = [];
        this.signatures = [];
        This.intermediary.dismissLoading()
        This.intermediary.presentToastSuccess('El defecto fue enviado exitosamente');
        this.close();
      },
      e => {
        console.log(e);
        
        This.intermediary.dismissLoading()
        This.intermediary.presentToastError(e.error.errors)
      }
    );

   
  }

  async sendToDefectsWithoutContact(object) {


    let This = this;
    This.incidentsService.addRegistry(object).subscribe(
      resp => {

        if(this.ticketEmit == true){
          this.print();
        }

        this.readed = false
        this.incidenceForm.patchValue({
          productId: 1,
          productReference: '',
          dateDetection: this.dateNow,
          observations: '',
          factoryReturn: false,
          statusManagementDefectId: 0,
          defectTypeChildId: 0,
          signFileId: 0
        })
        This.intermediary.dismissLoading()
        This.intermediary.presentToastSuccess('El defecto fue enviado exitosamente')
        this.close();
      },
      e => {
        console.log(e);
        
        This.intermediary.dismissLoading()
        This.intermediary.presentToastError(e.error.errors)
      }
    );

   
     
  }

  print(){
    console.log("imprimir...")
  }

  gestionChange(e) {
    
  }



  


}
