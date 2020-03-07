import { Component, OnInit, ViewChild, Input, OnChanges, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment'
import { IonSlides, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { IntermediaryService, IncidentsService } from '../../../services/src';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';
import {SignatureComponent} from '../signature/signature.component';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Platform } from '@ionic/angular';

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
  checkHistory: boolean;

  slideOpts = {
    speed: 400
  };
  date: string;

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
    private modalController: ModalController,
    private plt: Platform,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.date = moment().format('DD-MM-YYYY')
    this.readed = false
    this.initDinamicFields()
    
  }

  initForm() {
    this.incidenceForm = this.fb.group({
      barcode: [''],
      registerDate:[''],
      defectType: [0],
      observations: [''],
      gestionState: [0],
      photo:[''], 
      validation:[false]
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
        barcode: this.barcode
      })
      console.log(this.incidenceForm.value);
      
      this.readed = true
    }
    
  }
  async print(){

  }

  async enviar() {
    await this.intermediary.presentLoading('Enviando...')

    if(this.ticketEmit == true){
      this.print();
    }
    
    // setTimeout(async () => {
    //   await this.intermediary.dismissLoading()
    // }, 3000)
    console.log(this.incidenceForm.value);
    this.incidentsService.storeIncidentProduct(this.incidenceForm.value).subscribe(
      resp => {
        this.intermediary.dismissLoading()
        this.intermediary.presentToastSuccess('La incidencia fue enviada exitosamente')
        this.incidenceForm.patchValue({
          barcode: null,
          registerDate: null,
          defectType: 0,
          observations: null,
          gestionState: 0,
          photo: null,
          validation: false
        })
        this.readed = false
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
