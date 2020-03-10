import { Component, OnInit, ViewChild, Input, OnChanges, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment'
import { IonSlides, ModalController } from '@ionic/angular';
import {Router} from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
;
import {formatDate} from '@angular/common';
import { IntermediaryService, IncidentsService } from '../../../services/src';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';
import {SignatureComponent} from '../signature/signature.component';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Platform } from '@ionic/angular';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';

@Component({
  selector: 'suite-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss']
})
export class IncidentsComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(IonSlides) slides: IonSlides;
  // @ViewChild(ScannerManualComponent) scanner: ScannerManualComponent;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  principal: boolean = true;
  dataUrl: string;


  ticketEmit: boolean;
  passHistory:boolean;
  requirePhoto:boolean;
  requireContact: boolean;
  requireOk: boolean;
  checkHistory: true;
  txtName =""
  txtEmail="";
  txtTel="";
  name;
  email;
  phone;
  managementId;
  defectChildId;
  slideOpts = {
    speed: 400
  };
  date: string;
  dateNow = formatDate(new Date(), 'dd/MM/yyyy', 'es');
  dateDetection;
  incidenceForm: FormGroup;
  defectContacto: FormGroup;
  readed: boolean
  barcode: string = ''
  defects: any = [];
  statusManagament: any;
  imgUrl: any;
  public barcodeRoute = null;
  public types:any;

  private varTrying;

  constructor(
    private fb: FormBuilder,
    private fbContact: FormBuilder,
    private incidentsService: IncidentsService,
    private intermediary: IntermediaryService,
    private modalController: ModalController,
    private router: Router,
    private plt: Platform,
  ) { 


  }

  ngOnInit() {
    this.defectType();
    this.date = moment().format('DD-MM-YYYY');
    this.initForm();
    this.readed = false;
    const navigation = this.router.getCurrentNavigation();    
    if(navigation.extras.state!=undefined){
      this.barcodeRoute = navigation.extras.state['reference'];
      this.types ="Cargando";
    }
    this.initDinamicFields();
    
    

  }

  defectType(){
    //let res = this.statusManagament['classifications'].find( x => x.defectType == id);

  }

  initForm() {
    this.incidenceForm = this.fb.group({
      productReference: '',
      dateDetection:[this.date],
      observations: '.',
      numberObservations: 1,
      factoryReturn: [false],
      isHistory: [false],
      statusManagementDefectId: [0],
      defectTypeChildId: [0],
      defectType: [0],  
      gestionState: [0],
      contact: this.fb.group({
        name:'',
        email:'',
        phone:''
      })
    });
  
  }

  async initDinamicFields() {
    this.incidentsService.getDefectTypesChild().subscribe(resp => {
      //console.log('getDefectTypesChild', resp);
      this.defects = resp;
      
    })
    this.incidentsService.getDtatusManagamentDefect().subscribe(resp => {
      //console.log('getDtatusManagamentDefect', resp);
      this.statusManagament = resp
    })
    this.loadFromDBValues();
  }

  async loadFromDBValues(){

    if(this.barcodeRoute){


      let body = {
        "id":this.barcodeRoute
      }

      await this.incidentsService.getOneIncidentProductById(body).subscribe(resp=>{


          this.types = resp.querys;
          resp = resp.result;

          this.statusManagament = {
            'classifications' : resp.statusManagementDefectId
          }
          
          // this.statusManagament["classifications"] = resp.statusManagementDefectId;



          this.varTrying = resp.statusManagementDefectId.id;          

          // this.incidenceForm.setValue({gestionChange:resp.statusManagementDefectId.id})
          this.incidenceForm.patchValue({
            barcode: resp.barcode,
            registerDate: resp.registerDate,
            defectType: resp.defectTypeChildId.id,
            observations: resp.observations,
            gestionState: resp.statusManagementDefectId.id,
            // gestionState: resp.defectTypeChildId.id,
            photo: resp.photo,
            validation: resp.validation
          });

          this.readed = true;

          let sendtoGestionChange = {
            "detail":{
              "value":resp.statusManagementDefectId.id
            }
          }

          this.gestionChange(sendtoGestionChange);
      });

      // await this.incidentsService.getDtatusManagamentDefect().subscribe(resp => {
      //   console.log('getDtatusManagamentDefect', resp);
      //   this.statusManagament = resp
      // })

    }

  }

  newValue(e){




    console.log(e);
    this.barcode = e
    if (this.barcode && this.barcode.length > 0) {

      this.incidenceForm.patchValue({
        productReference: this.barcode
      })
      console.log(this.incidenceForm.value);
      
      this.readed = true
    }    

    console.log("on new Value");
    console.log(this.statusManagament);
  }
  async print(){
    console.log("imprimir...")
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
  onKeyName(event){
    this.txtName = event.target.value;
  }
  onKeyEmail(event){
    this.txtEmail = event.target.value;
  }
  onKeyTel(event){
    this.txtTel = event.target.value;
  }
  send(){

    this.incidenceForm.patchValue({
      statusManagementDefectId: this.managementId,
      defectTypeChildId: this.defectChildId,
      contact:{
        name: this.txtName,
        email: this.txtEmail,
        phone: this.txtTel
      }

    })
    console.log("validacion "+this.validate());  
    if(this.validate()){
      this.sendToIncidents();
    }
    
  }

  async sendToIncidents() {

    

    console.log("aqui mero", this.incidenceForm)
      let This = this;
      await This.intermediary.presentLoading('Enviando...')
  
      if(this.ticketEmit == true){
        this.print();
      }
      This.incidentsService.addRegistry(this.incidenceForm.value).subscribe(
        resp => {
          This.intermediary.dismissLoading()
          This.intermediary.presentToastSuccess('El defecto fue enviado exitosamente')
          this.router.navigateByUrl('/defect-handler');
        },
        e => {
          This.intermediary.dismissLoading()
          This.intermediary.presentToastError(e.error)
        }
      );
     
  }

  async presentModal() {
    const modal = await this.modalController.create({
    component: PhotoModalComponent,
    componentProps: { value: 123 }
    });
  
    await modal.present();
  
    const data = await modal.onDidDismiss();
    console.log(data)
    if (data.data.imgUrl) {
      this.imgUrl = data.data.imgUrl
      this.incidenceForm.patchValue({
        photo: data.data.imgUrl
      })
    }
  }
  gestionChange(e) {
    
    let id = e.detail.value;
    console.log("this.statusManagament",this.statusManagament);
    let res;
    if(this.barcodeRoute == null || this.barcodeRoute == undefined){
      res = this.statusManagament['classifications'].find( x => x.defectType == id);

    }else{
      res = this.statusManagament.classifications!=undefined ? this.statusManagament.classifications : this.statusManagament['classifications'].find( x => x.defectType == id);

    }
    
    console.log("res",res);
    

    if(res != undefined){
      this.ticketEmit = res.ticketEmit;
      this.passHistory = res.passHistory;
      this.requirePhoto = res.requirePhoto
      this.requireContact = res.requireContact;
      this.requireOk = res.requireOk;
      this.managementId = res.id;
      this.defectChildId = id;
      console.log(this.managementId+"----"+this.defectChildId)
    }else{
      this.ticketEmit = false;
      this.passHistory = false;
      this.requirePhoto = false;
      this.requireContact = false;
      this.requireOk = false;
    }


    this.incidenceForm.patchValue({
      gestionState: parseInt(e.detail.value)
    });

    
  }
  defectChange(e) {
    console.log(e);
    this.incidenceForm.patchValue({
      defectType: parseInt(e.detail.value)
    })
  }

  ngAfterViewInit() {
    // console.log(this.signaturePad);
    //   this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    //   this.signaturePad.set('canvasWidth', this.plt.width())
    //   this.signaturePad.set('canvasHeight', 300)
    //   this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  ngOnChanges(){
      
  }
  

  signModal(){
    this.router.navigate(['signature']);
  }
}
