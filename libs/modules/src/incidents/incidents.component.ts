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
import { ProductModel, ProductsService } from '@suite/services';
import { AlertController } from "@ionic/angular";
import { PositionsToast } from '../../../services/src/models/positionsToast.type';


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
  txtName
  txtEmail;
  txtTel;
  managementId;
  defectChildId;
  slideOpts = {
    speed: 400
  };
  date: string;
  dateNow = formatDate(new Date(), 'dd/MM/yyyy', 'es');
  dateDetection;
  incidenceForm: FormGroup;
  readed: boolean
  barcode: string = ''
  defects: any = [];
  statusManagament: any;
  imgUrl: any;
  public barcodeRoute = null;
  public types:any;
  public differentState:boolean = true;
  private typeIdBC:number;


  private varTrying;

  constructor(
    private fb: FormBuilder,
    private incidentsService: IncidentsService,
    private intermediary: IntermediaryService,
    private modalController: ModalController,
    private router: Router,
    private plt: Platform,
    private productsService: ProductsService,
    private intermediaryService: IntermediaryService,
    private alertController: AlertController,
  ) { 


  }

  ngOnInit() {
    this.initForm();
    this.date = moment().format('DD-MM-YYYY');
    this.readed = false;
    const navigation = this.router.getCurrentNavigation();    
    if(navigation.extras.state!=undefined){
      this.barcodeRoute = navigation.extras.state['reference'];
    }
    this.initDinamicFields();
    
    

  }

  initForm() {
    this.incidenceForm = this.fb.group({
      productReference: '',
      dateDetection:[this.dateNow],
      numberObservations: [0],
      observations: '',
      factoryReturn: [false],
      isHistory: [false],
      statusManagementDefectId: [0],
      defectTypeChildId: [0],
      defectType: [0],  
      gestionState: [0],
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
        // "productId":12,
        "productId":this.barcodeRoute,
        "productReference":""
      }

      console.log("body", body);

      await this.incidentsService.getDtatusManagamentDefect().subscribe(resp=>{
        // console.log("resp no se que", resp);
        this.types = resp.statuses;
      });

      await this.incidentsService.getOneIncidentProductById(body).subscribe(resp=>{

        
          // this.types = resp.data;
          resp = resp.data;
          console.log('result', resp);

          this.statusManagament = {
            'classifications' : resp.statusManagementDefect
          }
          
          // console.log("resp status ", resp.statusManagementDefect);

          this.statusManagament["classifications"] = resp.statusManagementDefect;

          this.varTrying = resp.statusManagementDefect.id;        
          
          this.incidenceForm.patchValue({gestionChange:resp.statusManagementDefect.id})
          this.incidenceForm.patchValue({productReference: resp.product.reference})
          this.incidenceForm.patchValue({
            barcode: resp.product.reference,
            registerDate: Date.now(),
            defectType: resp.defectTypeChild.id,
            observations: resp.observations,
            gestionState: resp.statusManagementDefect.id,
            // gestionState: resp.defectTypeChildId.id,
            photo: resp.photo,
            validation: resp.validation,
            
          });


          this.readed = true;
          this.typeIdBC = resp.statusManagementDefect.id;

          let sendtoGestionChange = {
            "detail":{
              "value":resp.statusManagementDefect.id
            }
          }
          this.gestionChange(sendtoGestionChange);
      }, error=>{
        console.log("here is error ", error);
      });

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
      

      this.getSizeListByReference(e);
      
    }    

    console.log("on new Value");
    console.log(this.statusManagament);
  }
  async print(){
    console.log("imprimir...")
  }

  async enviaryarn() {

    this.incidenceForm.patchValue({
      statusManagementDefectId: this.managementId,
      defectTypeChildId: this.defectChildId,
      contact:{
        name: this.txtName,
        email: this.txtEmail,
        phone: this.txtTel,
      }      
    })


    let This = this;
    await This.intermediary.presentLoading('Enviando...')

    if(this.ticketEmit == true){
      this.print();
    }
    
    // setTimeout(async () => {
    //   await this.intermediary.dismissLoading()
    // }, 3000)
    This.incidentsService.addRegistry(this.incidenceForm.value).subscribe(
      resp => {
        This.intermediary.dismissLoading()
        This.intermediary.presentToastSuccess('El defecto fue enviado exitosamente')
        this.router.navigateByUrl('/defect-handler');
      },
      e => {
        This.intermediary.dismissLoading()
        This.intermediary.presentToastError(e.error)
        console.log("e,",e);
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

    if(res != undefined){
      console.log("res",res);

      if(res instanceof Array){
        res = res.find( x  => x.id == id);
      }


      
      this.ticketEmit = res.ticketEmit;
      this.passHistory = res.passHistory;
      this.requirePhoto = res.requirePhoto
      this.requireContact = res.requireContact;
      this.requireOk = res.requireOk;
      this.managementId = res.id;
      this.defectChildId = id;
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


  onChange(value){
    if(value != this.typeIdBC){
      this.differentState = false;
    }else{
      this.differentState = true;
    }

  }


  private getSizeListByReference(dataWrote: string) {
    this.productsService.getInfo(dataWrote).then(async (res: ProductModel.ResponseInfo) => {
        if (res.code === 200) {
          this.readed = true
        } else if (res.code === 0) {
          this.intermediaryService.presentToastError('Ha ocurrido un problema al intentar conectarse con el servidor. Revise su conexión y pruebe de nuevo a realizar la operación.', PositionsToast.BOTTOM).then(() => {
            this.readed = false
          });

        } else {
          this.intermediaryService.presentToastError('No se ha podido consultar la información del producto escaneado.', PositionsToast.BOTTOM).then(() => {
            this.readed = false
          });

        }
      }, (error) => {
        console.error('Error::Subscribe::GetInfo -> ', error);
        this.intermediaryService.presentToastError('No se ha podido consultar la información del producto escaneado.', PositionsToast.BOTTOM).then(() => {
          this.readed = false
        });

      })
      .catch((error) => {
        console.error('Error::Subscribe::GetInfo -> ', error);
        this.intermediaryService.presentToastError('No se ha podido consultar la información del producto escaneado.', PositionsToast.BOTTOM).then(() => {
          this.readed = false
        });

      });
  }


  private async presentAlertInput(modelId: number, sizeId: number) {
    const alert = await this.alertController.create({
      header: 'Ubicación del producto',
      message: 'Introduce la referencia de la ubicación o el embalaje en que está el producto. Si no está en ninguno de estos sitios continúa sin rellenar este campo.',
      inputs: [{
        name: 'reference',
        type: 'text',
        placeholder: 'Referencia '
      }],
      backdropDismiss: false,
      buttons: [
        {
          text: 'Continuar',
          handler: (data) => {
            let reference = data.reference.trim();
            
          }
        }
      ]
    });

    await alert.present();
  }
  

}
