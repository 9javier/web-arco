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
  public barcodeRoute = null;
  public types:any;

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
    private incidentsService: IncidentsService,
    private intermediary: IntermediaryService,
    private modalController: ModalController,
    private router: Router,
    private plt: Platform,
    private camera: Camera,
    private transfer: FileTransfer,
    private intermediaryService: IntermediaryService,
    private uploadService: UploadFilesService
  ) { 


  }

  ngOnInit() {
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
      productId: 1,
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
      photosFileIds: [0],
      signFileId: [0],
      contact: this.fb.group({
        name: '',
        email: '',
        phone: ''
      })
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

  async enviar() {
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
        This.intermediary.presentToastError(e.error.errors)
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
}
