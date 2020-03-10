import { Component, OnInit, ViewChild, Input, OnChanges, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment'
import { IonSlides, ModalController } from '@ionic/angular';
import {Router} from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
;
import {formatDate} from '@angular/common';
import { IntermediaryService, IncidentsService, environment, UploadFilesService } from '../../../services/src';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';
import {SignatureComponent} from '../signature/signature.component';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Platform } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult } from '@ionic-native/file-transfer/ngx';
import { ReviewImagesComponent } from './components/review-images/review-images.component';
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
  public barcodeRoute = null;
  public types:any;
  public differentState:boolean = true;
  private typeIdBC:number;


  private varTrying;
  apiURL: string = environment.uploadFiles + '?type=defects'
  imgData: string;
  img: any;
  photos: Array<any> = []
  signatures: Array<any> = []
  photoList: boolean = false;
  signatureList: boolean = false;

  constructor(
    private fb: FormBuilder,
    private fbContact: FormBuilder,
    private incidentsService: IncidentsService,
    private intermediary: IntermediaryService,
    private modalController: ModalController,
    private router: Router,
    private plt: Platform,
    private camera: Camera,
    private transfer: FileTransfer,
    private uploadService: UploadFilesService,
    private productsService: ProductsService,
    private intermediaryService: IntermediaryService,
    private alertController: AlertController,
  ) { 


  }

  ngOnInit() {
    this.defectType();
    this.uploadService.signatureEventAsign().subscribe(resp => {
      if (resp) {
        this.signatures.push(resp)
      }
      if (!this.signatureList) {
        this.openSignatureList()
      }
      console.log(resp);
    })

    this.initForm();
    this.date = moment().format('DD-MM-YYYY');
    this.initForm();
    this.readed = false;
    const navigation = this.router.getCurrentNavigation();    
    if(navigation.extras.state!=undefined){
      this.barcodeRoute = navigation.extras.state['reference'];
    }
    this.initDinamicFields();
  }

  defectType(){
    //let res = this.statusManagament['classifications'].find( x => x.defectType == id);

  }

  initForm() {
    this.incidenceForm = this.fb.group({
      productId: 1,
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
      photosFileIds: [ [{ "id": 1 }]],
      signFileId: [1],
      contact: this.fb.group({
        name: '',
        email: '',
        phone: ''
      })
    })
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

async enviaryarn() {
    let photos = []
    this.photos.forEach(elem => {
      photos.push({id: elem.id});
    });
    this.incidenceForm.patchValue({
      statusManagementDefectId: this.managementId,
      defectTypeChildId: this.defectChildId,
      photosFileIds: photos,
      signFileId: this.signatures[0].id,
      // contact:{
      //   name: this.txtName,
      //   email: this.txtEmail,
      //   phone: this.txtTel,
      // },
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
        this.readed = false
        this.incidenceForm.patchValue({
          productId: 1,
          productReference: '',
          dateDetection: this.dateNow,
          numberObservations: 0,
          observations: '',
          factoryReturn: false,
          isHistory: false,
          statusManagementDefectId: 0,
          defectTypeChildId: 0,
          defectType: 0,
          gestionState: 0,
          photosFileIds: 0,
          signFileId: 0,
          contact: {
            name: '',
            email: '',
            phone: ''
          }
        })
        This.intermediary.dismissLoading()
        This.intermediary.presentToastSuccess('El defecto fue enviado exitosamente')
        this.router.navigateByUrl('/defect-handler');
      },
      e => {
        console.log(e);
        This.intermediary.dismissLoading()
        This.intermediary.presentToastError(e.error)
        console.log("e,",e);
      }
    );

    }



  async enviar() {
    let photos = []
    this.photos.forEach(elem => {
      photos.push({id: elem.id});
    });
    this.incidenceForm.patchValue({
      statusManagementDefectId: this.managementId,
      defectTypeChildId: this.defectChildId,
      photosFileIds: [{ "id": 1 }],
      signFileId: this.signatures[0].id,
      // contact:{
      //   name: this.txtName,
      //   email: this.txtEmail,
      //   phone: this.txtTel,
      // },
    })

    }
   
    
  

  async sendToIncidents() {

    let This = this;
    // setTimeout(async () => {
    //   await this.intermediary.dismissLoading()
    // }, 3000)
    This.incidentsService.addRegistry(this.incidenceForm.value).subscribe(
      resp => {
        this.readed = false
        this.incidenceForm.patchValue({
          productId: 1,
          productReference: '',
          dateDetection: this.dateNow,
          numberObservations: 0,
          observations: '',
          factoryReturn: false,
          isHistory: false,
          statusManagementDefectId: 0,
          defectTypeChildId: 0,
          defectType: 0,
          gestionState: 0,
          photosFileIds: [{ "id": 1 }],
          signFileId: 0,
          contact: {
            name: '',
            email: '',
            phone: ''
          }
        })
        This.intermediary.dismissLoading()
        This.intermediary.presentToastSuccess('El defecto fue enviado exitosamente')
        this.router.navigateByUrl('/defect-handler');
      },
      e => {
        console.log(e);
        
        This.intermediary.dismissLoading()
        This.intermediary.presentToastError(e.error.errors)
      }
    );

    console.log("aqui mero", this.incidenceForm)
     
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

  // async presentModal() {
  //   const modal = await this.modalController.create({
  //   component: PhotoModalComponent,
  //   componentProps: { value: 123 }
  //   });
  
  //   await modal.present();
  
  //   const data = await modal.onDidDismiss();
  //   console.log(data)
  //   if (data.data.imgUrl) {
  //     this.imgUrl = data.data.imgUrl
  //     this.incidenceForm.patchValue({
  //       photo: data.data.imgUrl
  //     })
  //   }
  // }
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
  

  async signModal(){
    const modal = await this.modalController.create({
      component: SignatureComponent,
    });

    await modal.present();
    // this.router.navigate(['signature']);
  }

 

  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log(imageData);
      this.imgData = imageData
      this.uploadImage()

    }, (err) => {
      // Handle error
    });
  }
  searchPhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imgData = imageData
      this.uploadImage()
    }, (err) => {
      // Handle error
    })
  }
  async uploadImage() {
    if (!this.imgData || this.imgData.length == 0) {
      this.intermediaryService.presentToastError('Debe seleccionar una imagen o tomar una foto')
      return
    }
    this.intermediaryService.presentLoading()
    // Destination URL
    let url = this.apiURL;

    // File for Upload
    var targetPath = this.imgData;
    const imgDataSplit = this.imgData.split('/')
    let name = imgDataSplit[imgDataSplit.length - 1]
    if (name.split('?').length > 1) {
      name = name.split('?')[0]
    }


    var options: FileUploadOptions = {
      fileKey: 'file',
      chunkedMode: false,
      mimeType: 'image/png',
      fileName: name
      // params: { 'desc': desc }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options)
      .then((result: FileUploadResult) => {
        this.intermediaryService.dismissLoading()
        const response: any = JSON.parse(result.response)
        console.log('response: ', response);

        this.img = response.data
        this.photos.push(this.img);
        console.log('subido');
        if (!this.photoList) {
          this.openPhotoList()
        }
        this.intermediaryService.presentToastSuccess('la imagen cargada correctamente')

      })
      .catch(
        e => {
          console.log(e);

          this.intermediaryService.dismissLoading()
          const error = JSON.parse(e.body)

          this.intermediaryService.presentToastError(error.errors)
        }
      );

  }

  openPhotoList(){
    this.photoList = !this.photoList
  }
  openSignatureList() {
    this.signatureList = !this.signatureList

  }

  deleteImage(item, index, arr) {
    this.intermediary.presentLoading()
    this.uploadService.deleteFile(item.id).subscribe(
      resp => {
        this.intermediary.presentToastSuccess('Archivo borrado exitosamente')
        arr.splice(index, 1);
      },
      err => {
        this.intermediary.presentToastError('Ocurrio un error al borrar el archivo')
        this.intermediary.dismissLoading()
      },
      () => {
        this.intermediary.dismissLoading()
      }
    )
  }
  async onOpenReviewModal(item) {
    const modal = await this.modalController.create({
    component: ReviewImagesComponent,
    componentProps: { imgSrc: item.pathMedium  }
    });
  
    await modal.present();
  
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
