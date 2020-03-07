import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment'
import { IonSlides, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
;
import {formatDate} from '@angular/common';
import { IntermediaryService, IncidentsService } from '../../../services/src';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';


@Component({
  selector: 'suite-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss']
})
export class IncidentsComponent implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  // @ViewChild(ScannerManualComponent) scanner: ScannerManualComponent;


  ticketEmit: boolean;
  passHistory:boolean;
  requirePhoto:boolean;
  requireContact: boolean;
  requireOk: boolean;
  checkHistory: true;
  txtName
  txtEmail;
  txtTel;

  slideOpts = {
    speed: 400
  };
  date: string;
  dateNow = formatDate(new Date(), 'dd/MM/yyyy', 'es');
  incidenceForm: FormGroup;
  readed: boolean
  barcode: string = ''
  defects: any = [];
  statusManagament: any;
  imgUrl: any;
  constructor(
    private fb: FormBuilder,
    private incidentsService: IncidentsService,
    private intermediary: IntermediaryService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.initForm();
    this.date = moment().format('DD-MM-YYYY')    
    this.readed = false
    this.initDinamicFields()
  }

  initForm() {
    this.incidenceForm = this.fb.group({
      productReference: '',
      dateDetection:[this.dateNow],
      numberObservations: [0],
      observations: '',
      factoryReturn: [false],
      isHistory: [false],
      defectTypeChildId: [1],
      statusManagementDefectId: [0]
    })
  }

  initDinamicFields() {
    this.incidentsService.getDefectTypesChild().subscribe(resp => {
      console.log('getDefectTypesChild', resp);
      this.defects = resp;
      
    })
    this.incidentsService.getDtatusManagamentDefect().subscribe(resp => {
      console.log('getDtatusManagamentDefect', resp);
      this.statusManagament = resp
    })
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
    
  }
  async print(){
    console.log("imprimir...")
  }

  async enviar() {


/*
    this.incidenceForm = this.fb.group({
      productId: 10,
      productReference: this.barcode,
      dateDetection: this.dateNow,
      numberObservations: 1,
      factoryReturn: false,
      isHistory: this.checkHistory,
      defectTypeChildId: 1,
      statusManagementDefectId: 16,
      contact: {
        name: "ds",
        email: "dsda",
        phone: "465454654"
      }
    })*/
    

    this.incidenceForm.patchValue({
      contact:{
        name: this.txtName,
        email: this.txtEmail,
        phone: this.txtTel,
      }      
    })

    console.log(this.incidenceForm.value);

    


    await this.intermediary.presentLoading('Enviando...')

    if(this.ticketEmit == true){
      this.print();
    }
    
    // setTimeout(async () => {
    //   await this.intermediary.dismissLoading()
    // }, 3000)
    console.log(this.incidenceForm.value);
    this.incidentsService.addRegistry(this.incidenceForm.value).subscribe(
      resp => {
        this.intermediary.dismissLoading()
        this.intermediary.presentToastSuccess('El defecto fue enviado exitosamente')
        /*this.incidenceForm.patchValue({
          barcode: null,
          registerDate: null,
          defectType: 0,
          observations: null,
          gestionState: 0,
          photo: null,
          validation: false
        })
        this.readed = false*/
      },
      e => {
        this.intermediary.dismissLoading()
        this.intermediary.presentToastError(e.error)
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
    console.log(e);

    let id = e.detail.value;

  
    const res = this.statusManagament['classifications'].find( x => x.defectType == id);
    
    if(res != undefined){
      this.ticketEmit = res.ticketEmit;
      this.passHistory = res.passHistory;
      this.requirePhoto = res.requirePhoto
      this.requireContact = res.requireContact;
      this.requireOk = res.requireOk;
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
}
