import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment'
import { IonSlides, ModalController } from '@ionic/angular';
import {Router} from '@angular/router';
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
  checkHistory: boolean;

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
  public barcodeRoute = null;
  public types:any;

  private varTrying;

  constructor(
    private fb: FormBuilder,
    private incidentsService: IncidentsService,
    private intermediary: IntermediaryService,
    private modalController: ModalController,
    private router: Router,
  ) { 


  }

  ngOnInit() {
    this.initForm();
    this.date = moment().format('DD-MM-YYYY');
    this.readed = false;
    const navigation = this.router.getCurrentNavigation();    
    if(navigation.extras.state!=undefined){
      this.barcodeRoute = navigation.extras.state['reference'];
      this.types ="Cargando";
    }
    this.initDinamicFields();
    
    

  }

  initForm() {
    this.incidenceForm = this.fb.group({
      barcode: [''],
      registerDate:[this.dateNow],
      defectType: [0],
      observations: [''],
      gestionState: [0],
      photo:[''], 
      validation:[false]
    })
  }

  async initDinamicFields() {
    this.incidentsService.getDefectTypesChild().subscribe(resp => {
      console.log('getDefectTypesChild', resp);
      this.defects = resp;
      
    })
    this.incidentsService.getDtatusManagamentDefect().subscribe(resp => {
      console.log('getDtatusManagamentDefect', resp);
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

          console.log('result mas op del mundo', resp);

          this.types = resp.querys;
          resp = resp.result;

          this.statusManagament = {
            'classifications' : resp.statusManagementDefectId
          }
          
          // this.statusManagament["classifications"] = resp.statusManagementDefectId;


          console.log('result mas op del mundo', resp);

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
    this.barcode = e
    if (this.barcode && this.barcode.length > 0) {
      this.incidenceForm.patchValue({
        barcode: this.barcode
      });      
      this.readed = true
    }    

    console.log("on new Value");
    console.log(this.statusManagament);
  }
  async print(){
    console.log("imprimir...")
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
    
    let id = e.detail.value;
    
    console.log("this.statusManagament",this.statusManagament);
    
    
    const res = this.statusManagament.classifications!=undefined ? this.statusManagament.classifications : this.statusManagament['classifications'].find( x => x.defectType == id);
    
    console.log("res",res);
    

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
