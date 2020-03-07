import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment'
import { IonSlides, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {Router} from '@angular/router';
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
      registerDate:[''],
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

          console.log("Los tipos", this.types)

          resp = resp.result;
          this.varTrying = resp.statusManagementDefectId.id;

          // this.incidenceForm.setValue({gestionChange:resp.statusManagementDefectId.id})
          this.incidenceForm.patchValue({
            barcode: resp.barcode,
            registerDate: resp.registerDate,
            defectType: resp.defectTypeChildId.id,
            observations: resp.observations,
            gestionState: 1,
            // gestionState: resp.defectTypeChildId.id,
            photo: resp.photo,
            validation: resp.validation
          });

          this.readed = true;

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

  async enviar() {
    await this.intermediary.presentLoading('Enviando...')
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
