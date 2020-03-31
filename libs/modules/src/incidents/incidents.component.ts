import { Component, OnInit, ViewChild, Input, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment'
import { IonSlides, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
  ;
import { formatDate } from '@angular/common';
import { IntermediaryService, IncidentsService, environment, UploadFilesService } from '../../../services/src';
import { DropFilesService } from '../../../services/src/lib/endpoint/drop-files/drop-files.service';
import { SignatureComponent } from '../signature/signature.component';
import { DropFilesComponent } from '../drop-files/drop-files.component';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Platform } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult } from '@ionic-native/file-transfer/ngx';
import { ReviewImagesComponent } from './components/review-images/review-images.component';
import { ProductModel, ProductsService } from '@suite/services';
import { AlertController } from "@ionic/angular";
import { PositionsToast } from '../../../services/src/models/positionsToast.type';
import { ToolbarProvider } from "../../../services/src/providers/toolbar/toolbar.provider";
import { Subscription } from 'rxjs';
import { KeyboardService } from '../../../services/src/lib/keyboard/keyboard.service';
import {ItemReferencesProvider} from "../../../services/src/providers/item-references/item-references.provider";
import { PrintTicketService } from '../../../services/src/lib/print-ticket/print-ticket.service';
import {DefectiveRegistryModel} from "../../../services/src/models/endpoints/DefectiveRegistry";
import DefectiveRegistry = DefectiveRegistryModel.DefectiveRegistry;
import {IncidenceModel} from "../../../services/src/models/endpoints/Incidence";

//import { ReviewImagesComponent } from './components/review-images/review-images.component';

declare let ScanditMatrixSimple;

const BACKGROUND_COLOR_ERROR: string = '#e8413e';
const BACKGROUND_COLOR_INFO: string = '#15789e';
const TEXT_COLOR: string = '#FFFFFF';
const HEADER_BACKGROUND: string = '#222428';
const HEADER_COLOR: string = '#FFFFFF';

@Component({
  selector: 'suite-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss']
})
export class IncidentsComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  principal: boolean = true;
  dataUrl: string;
  select1: boolean = false;
  select2: boolean = false;
  allDefectType = [];
  ticketEmit: boolean;
  passHistory: boolean;
  requirePhoto: boolean = false;
  requireContact: boolean = false;
  requireOk: boolean;
  checkHistory: boolean;
  txtName = ""
  txtEmail = "";
  txtTel = "";
  name;
  email;
  phone;
  managementId;
  defectChildId;
  defectZoneChildId;
  slideOpts = {
    speed: 400
  };
  date: string;
  dateNow = moment().format("YYYY-MM-DD");
  dateDetection;
  incidenceForm: FormGroup;
  defectContacto: FormGroup;
  readed: boolean
  barcode: string = ''
  defects: any = [];
  zones: any = [];
  statusManagament: any;
  public barcodeRoute = null;
  public types: any;
  public differentState: boolean = true;
  private typeIdBC: number;
  showKeyboard: boolean

  private varTrying;
  apiURL: string = environment.uploadFiles + '?type=defects'
  imgData: string;
  img: any;
  photos: Array<any> = []
  signatures: any = null
  signaturesSubscription: Subscription;
  photoList: boolean = false;
  signatureList: boolean = false;
  dateOnFront = new Date();
  state: boolean;
  color: string;
  private lastCodeScanned = '';
  private timeMillisToResetScannedCode = 2000;

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
    private toolbarProvider: ToolbarProvider,
    private dropService: DropFilesService,
    private itemReferencesProvider: ItemReferencesProvider,
    private printTicketService: PrintTicketService,

  ) {


  }

  ngOnInit() {

    this.signatures = null;
    this.toolbarProvider.currentPage.next("Registro defectuoso")
    this.photos = [];
    this.showKeyboard = true


    this.signaturesSubscription = this.uploadService.signatureEventAsign().subscribe(resp => {
      if (resp) {
        this.intermediary.presentLoading()
        if (this.signatures) {

          this.uploadService.deleteFile(this.signatures.id).subscribe(
            resp => {
              this.intermediary.presentToastSuccess('Imagen anterior eliminada exitosamente')
            },
            err => {
              this.intermediary.dismissLoading()
            },
            () => {
              this.intermediary.dismissLoading()
            }
          )
        }
      }
      this.signatures = resp

      if (this.signatures) {
        this.signatures.pathMedium = `${environment.apiBasePhoto}${this.signatures.pathMedium}`
        this.signatures.pathIcon = `${environment.apiBasePhoto}${this.signatures.pathIcon}`
      }
      console.log(this.signatures);

      if (!this.signatureList) {
        this.openSignatureList()
      }
    })
    this.initForm();
    this.readed = false;
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state != undefined) {
      this.readed = true;
      this.barcodeRoute = navigation.extras.state['reference'];
    }
    this.initDinamicFields();

  }
  ngOnDestroy() {


    console.log('OnDestroy');
    console.log(this.photos);
    console.log(this.signatures);

    // if (this.signatures) {
    //   this.uploadService.deleteFile(this.signatures.id).subscribe(resp => {
    //     this.signatures = null
    //     this.uploadService.setSignature(null)
    //   })
    // }

    // if (this.photos.length > 0) {
    //   this.photos.forEach(elem => {
    //     this.uploadService.deleteFile(elem.id).subscribe(resp => { })
    //   })
    // }
    //this.signatures = null
    //this.uploadService.setSignature(null)
    //this.photos = []
    this.clearVariables();
    this.signaturesSubscription.unsubscribe();
  }

  defectType(defecType) {
    this.allDefectType = defecType ? defecType.classifications : [];
  }

  initForm() {
    this.date = moment().format("YYYY-MM-DD");
    let phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    this.incidenceForm = this.fb.group({
      productId: 1,
      productReference: '',
      dateDetection: [moment().format("YYYY-MM-DD")],
      observations: '',
      numberObservations: 1,
      factoryReturn: [false],
      statusManagementDefectId: [0],
      defectTypeChildId: [0],
      defectZoneChildId: [0],
      signFileId: [0],
      gestionState: 0,
      contact: this.fb.group({
        name: '',
        email: '',
        phone: ['']
      })

    })
    this.clearVariables();
  }

  async initDinamicFields() {
    this.incidentsService.getDefectTypesChild().subscribe(resp => {
      this.defects = resp;

    })
    this.incidentsService.getDefectZonesChild().subscribe(resp => {
      this.zones = resp;
      console.log("TEST::zones", this.zones);
    })
    this.incidentsService.getDtatusManagamentDefect().subscribe(resp => {
      this.statusManagament = resp
      this.types = resp.statuses;
      this.defectType(resp);
    })
    this.loadFromDBValues();
  }

  async loadFromDBValues() {
    console.log("Date now", this.dateNow)
    if (this.barcodeRoute) {
      let body = {
        "productId": this.barcodeRoute,
        "productReference": ""
      }
      await this.incidentsService.getOneIncidentProductById(body).subscribe(resp => {

        resp = resp.data;
        // console.log('result', resp);
        // console.log('contact', contact);

        this.statusManagament = {
          'classifications': resp.statusManagementDefect
        }

        // console.log("resp status ", resp.statusManagementDefect);

        this.statusManagament["classifications"] = resp.statusManagementDefect;

        this.varTrying = resp.statusManagementDefect.id;



        // this.incidenceForm.patchValue({ gestionChange: resp.statusManagementDefect.id })
        this.incidenceForm.patchValue({
          id: resp.id,
          productId: resp.product.id,
          productReference: resp.product.reference,
          barcode: resp.product.reference,
          registerDate: Date.now(),
          observations: resp.observations,
          gestionState: resp.statusManagementDefect.id,
          photo: resp.photo,
          validation: resp.validation,
          isHistory: resp.isHistory,
          statusManagementDefectId: resp.statusManagementDefect.id,
          defectTypeChildId: resp.defectTypeChild.id,
          dateDetection: moment().format(),
          // photosFileIds: [ [{ "id": 1 }]],
          // signFileId: [1],
          // contact: this.fb.group({
          //   name: contact.name,
          //   email: contact.email,
          //   phone: contact.phone
          // })
        });
        this.typeIdBC = resp.statusManagementDefect.id;
        this.onChange(resp.defectTypeChild.id);

        let sendtoGestionChange = {
          "detail": {
            "value": resp.statusManagementDefect.id
          }
        }
        this.gestionChange(sendtoGestionChange);
      }, error => {
        console.log("here is error ", error);
      });

    }

  }

  newValue(e) {
    if(this.itemReferencesProvider.checkCodeValue(e) === this.itemReferencesProvider.codeValue.PRODUCT){
      this.barcode = e;
      if (this.barcode && this.barcode.length > 0) {
        this.incidenceForm.patchValue({
          productReference: this.barcode
        })
        this.getSizeListByReference(e, null, null);
      }
    } else {
      this.intermediary.presentToastError(`Código de producto [${e}] inválido`, PositionsToast.BOTTOM);
    }

  }

  scanNewCode(){
    this.lastCodeScanned = '';
    ScanditMatrixSimple.init((response) => {
      if(response && response.result && response.actionIonic){
        this.executeAction(response.actionIonic, response.params);
      } else if (response && response.barcode) {
        if(response.barcode != this.lastCodeScanned){
          this.lastCodeScanned = response.barcode;
          ScanditMatrixSimple.setTimeout("lastCodeScannedStart", this.timeMillisToResetScannedCode, "");
          let code = response.barcode.data;
          if(this.itemReferencesProvider.checkCodeValue(code) === this.itemReferencesProvider.codeValue.PRODUCT){
            this.incidenceForm.patchValue({
              productReference: code
            })
            this.getSizeListByReference(code, ()=>{
              ScanditMatrixSimple.finish();
              setTimeout(() => {
                if(document.getElementById('input-ta')){
                  document.getElementById('input-ta').focus();
                }
              },100);
            }, (msg)=>{
              ScanditMatrixSimple.setText(msg, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
              ScanditMatrixSimple.showText(true);
              this.hideTextMessage(4000)
            });

          } else {
            ScanditMatrixSimple.setText(`Código de producto [${code}] inválido`, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
            ScanditMatrixSimple.showText(true);
            this.hideTextMessage(4000)
          }
        }

      }
    }, 'Registrar defectuoso', HEADER_BACKGROUND, HEADER_COLOR);
  }

  print(defective, status) {
    this.printTicketService.printTicket(defective);
  }

  validate() {

    let regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    let validation = true;
    let msg;
    let This = this;
    console.log(this.txtName.length);

    if (this.txtName.length < 4) {
      console.log("name false");
      msg = "Nombre debe tener minimo 4 digítos...";
      validation = false;
    } if (this.txtEmail.length < 1) {
      msg = "Campo email vacío";
      validation = false;
    }
    if (this.txtTel.length < 6) {
      console.log("telefono false");
      msg = "Teléfono debe tener minimo 6 digítos...";
      validation = false;
    }
    if (!regex.test(this.txtEmail)) {
      console.log("email validation true");
      msg = "Email invalido...";
      validation = false;
      console.log("email false");
    }

    if (msg == undefined) {

    } else {
      if (msg.length > 0) {
        This.intermediary.presentToastError(msg);
      }
    }

    return validation;
  }
  onKeyName(event) {
    this.txtName = event.target.value;
  }
  onKeyEmail(event) {
    this.txtEmail = event.target.value;
  }
  onKeyTel(event) {
    this.txtTel = event.target.value;
  }



  send() {
    if (this.requirePhoto) {
      if (this.photos.length > 0) {
        let photos = []
        this.photos.forEach(elem => {
          photos.push({ id: elem.id });
        });
        this.incidenceForm.addControl('photosFileIds', new FormControl(photos))
      } else {

        this.intermediary.presentToastError("Debe Agregar Algunas Fotos");
        return;
      }

    }

    if (this.requireOk) {
      console.log('signFileId');
      if (this.signatures) {
        this.incidenceForm.patchValue({
          signFileId: this.signatures.id,
        });
      } else {
        this.intermediary.presentToastError("Debe Agregar la Firma");
        return;
      }

    }


    this.incidenceForm.patchValue({
      statusManagementDefectId: this.managementId,
      defectTypeChildId: this.defectChildId,
      defectZoneChildId: this.defectZoneChildId,
    })
    if (this.requireContact == true) {
      if (this.validate()) {
        this.incidenceForm.value.contact.phone = this.txtTel + "";
        let object = this.incidenceForm.value;
        this.sendToIncidents(object);
      }
    }
    else {
      let object = this.incidenceForm.value;
      delete object.contact;
      this.sendToIncidents(object);
    }
  }


  async enviaryarn() {
    let photos = []
    this.photos.forEach(elem => {
      photos.push({ id: elem.id });
    });
    this.incidenceForm.patchValue({
      statusManagementDefectId: this.managementId,
      defectTypeChildId: this.defectChildId,
      defectZoneChildId: this.defectZoneChildId,
      defectTypeParentId: 1,
      photosFileIds: photos,
      signFileId: this.signatures.id,
      // contact:{
      //   name: this.txtName,
      //   email: this.txtEmail,
      //   phone: this.txtTel,
      // },
    });
    //let defective = ;
    // console.log("hello world", this.incidenceForm);
    let This = this;
    await This.intermediary.presentLoading('Enviando...')
    if (this.ticketEmit == true) {
      //this.printTicketService.printTicket(this.incidenceForm, this.incidenceForm.statuManagementDefectId);
    }

    if (this.incidenceForm.value.observations == null) {
      this.incidenceForm.patchValue({
        observations: "None",
      })
    }

    if (this.incidenceForm.value.observations != null) {
      this.incidenceForm.patchValue({
        contact: {
          phone: this.incidenceForm.value.contact.phone + ""
        },
      })
    }

    let object = this.incidenceForm.value;
    if (!this.requireContact) {
      delete object.contact;
    }
    // setTimeout(async () => {
    //   await this.intermediary.dismissLoading()
    // }, 3000)
    This.incidentsService.addRegistry(object).subscribe(
      resp => {
        this.readed = false
        this.incidenceForm.patchValue({
          // productId: 1,
          productReference: '',
          dateDetection: this.dateNow,
          observations: '',
          factoryReturn: false,
          statusManagementDefectId: 0,
          defectTypeChildId: 0,
          gestionState: 0,
          photosFileIds: 0,
          signFileId: 0,
          contact: {
            name: this.txtName,
            email: this.txtEmail,
            phone: this.txtTel
          }
        })
        This.intermediary.dismissLoading()
        This.intermediary.presentToastSuccess('El defecto fue enviado exitosamente')
        this.router.navigateByUrl('/defect-handler');
      },
      e => {
        // console.log(e);
        This.intermediary.dismissLoading()
        This.intermediary.presentToastError(e.error)
        // console.log("e,", e);
      }
    );

  }


  async sendToIncidents(object) {

    let This = this;
    This.incidentsService.addRegistry(object).subscribe(
      resp => {
        if (this.ticketEmit == true) {
          this.printTicketService.printTicket(resp.result);
        }
        this.readed = false;
        this.clearVariables();
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

  gestionChange(e) {
    let id = e.detail.value;
    let res;
    if (this.barcodeRoute == null || this.barcodeRoute == undefined) {
      res = this.statusManagament['classifications'].find(x => x.id == id);

    } else {
      res = this.statusManagament.classifications != undefined ? this.statusManagament.classifications : this.statusManagament['classifications'].find(x => x.id == id);

    }

    if (res != undefined) {
      // console.log("res", res);

      if (res instanceof Array) {
        res = res.find(x => x.id == id);
      }
      console.log(res.requirePhoto);
      this.ticketEmit = res.ticketEmit;
      this.passHistory = res.passHistory;
      this.requirePhoto = res.requirePhoto;
      this.requireContact = res.requireContact;
      this.requireOk = res.requireOk;
      this.managementId = res.id;

    } else {
      this.ticketEmit = false;
      this.passHistory = false;
      this.requirePhoto = false;
      this.requireContact = false;
      this.requireOk = false;
    }

    this.select1 = true;


  }
  defectChange(e) {
    this.select2 = true;
    console.log(e);
    this.defectChildId = e.detail.value;
  }

  defectZoneChange(e) {
    this.select2 = true;
    console.log(e);
    this.defectZoneChildId = e.detail.value;
  }

  ngAfterViewInit() {
    // console.log(this.signaturePad);
    //   this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    //   this.signaturePad.set('canvasWidth', this.plt.width())
    //   this.signaturePad.set('canvasHeight', 300)
    //   this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  ngOnChanges() {
  }


  async signModal() {
    const modal = await this.modalController.create({
      component: SignatureComponent,
    });
    await modal.present();

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
  async searchPhoto() {
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
      console.log(imageData);
      this.imgData = imageData
      this.uploadImage()

    }, (err) => {
      // Handle error
    });
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
        console.log(response.data);

        response.data.pathMedium = `${environment.apiBasePhoto}${response.data.pathMedium}`
        response.data.pathIcon = `${environment.apiBasePhoto}${response.data.pathIcon}`
        this.img = response.data;
        this.photos.push(this.img);
        console.log('subido');
        if (!this.photoList) {
          this.openPhotoList();
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

  openPhotoList() {
    this.photoList = !this.photoList
  }
  openSignatureList() {
    this.signatureList = !this.signatureList;
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

  deleteSignature(item) {
    this.intermediary.presentLoading()
    this.uploadService.deleteFile(item.id).subscribe(
      resp => {
        this.intermediary.presentToastSuccess('Archivo borrado exitosamente')
        this.clearVariables(1);
        this.uploadService.setSignature(null)
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
      componentProps: { imgSrc: item.pathMedium }
    });

    await modal.present();

  }


  onChange(value) {
    if (value != this.typeIdBC) {
      this.differentState = false;
    } else {
      this.differentState = true;
    }

  }


  private getSizeListByReference(dataWrote: string, successCallback: () => any, errorCallback: (msg) => any) {
    const body = {
      reference: dataWrote
    };
    this.productsService.verifyProduct(body).subscribe((res) => {
      if (res !== undefined) {
        if(errorCallback){
          errorCallback('El producto solicitado ya se encuentra registrado');
        } else {
          this.intermediaryService.presentToastError('El producto solicitado ya se encuentra registrado', PositionsToast.BOTTOM).then(() => {
            this.readed = false
          });
        }
      } else {
        this.productsService.getInfo(dataWrote).then(async (res: ProductModel.ResponseInfo) => {
          if (res.code === 200) {
            this.readed = true;
            if(successCallback){
              successCallback();
            }
          } else if (res.code === 0) {
            if(errorCallback){
              errorCallback('Ha ocurrido un problema al intentar conectarse con el servidor. Revise su conexión y pruebe de nuevo a realizar la operación.');
            } else {
              this.intermediaryService.presentToastError('Ha ocurrido un problema al intentar conectarse con el servidor. Revise su conexión y pruebe de nuevo a realizar la operación.', PositionsToast.BOTTOM).then(() => {
                this.readed = false
              });
            }
          } else {
            if(errorCallback){
              errorCallback('No se ha podido consultar la información del producto escaneado.');
            } else {
              this.intermediaryService.presentToastError('No se ha podido consultar la información del producto escaneado.', PositionsToast.BOTTOM).then(() => {
                this.readed = false
              });
            }
          }
        }, (error) => {
          console.error('Error::Subscribe::GetInfo -> ', error);
          if(errorCallback){
            errorCallback('No se ha podido consultar la información del producto escaneado.');
          } else {
            this.intermediaryService.presentToastError('No se ha podido consultar la información del producto escaneado.', PositionsToast.BOTTOM).then(() => {
              this.readed = false
            });
          }
        })
          .catch((error) => {
            console.error('Error::Subscribe::GetInfo -> ', error);
            if(errorCallback){
              errorCallback('No se ha podido consultar la información del producto escaneado.');
            } else {
              this.intermediaryService.presentToastError('No se ha podido consultar la información del producto escaneado.', PositionsToast.BOTTOM).then(() => {
                this.readed = false
              });
            }
          });
      }
    }, error => {
      const msg = error && error.error && error.error.errors ? error.error.errors : `Ha ocurrido un error al consultar la información del producto [${dataWrote}]`
      console.error('Error::Subscribe::GetInfo -> ', error);
      if(errorCallback){
        errorCallback(msg);
      } else {
        this.intermediaryService.presentToastError(msg, PositionsToast.BOTTOM).then(() => {
          this.readed = false
        });
      }
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


  clearVariables(type?: number) {
    if (!type) {
      this.incidenceForm.patchValue({
        productReference: '',
        dateDetection: moment().format("YYYY-MM-DD"),
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
      });
      this.signatures = null;
      this.uploadService.setSignature(null);
      this.photos = [];
      this.photoList = false
      this.signatureList = false;
      this.ticketEmit = false;
      this.passHistory = false;
      this.requirePhoto = false;
      this.requireContact = false;
      this.requireOk = false;
    } else
      if (type == 1) {
        this.uploadService.setSignature(null);
        this.signatures = null;
        this.signatureList = false;
      } else if (type == 2) {
        this.photos = [];
        this.photoList = false
        this.requirePhoto = false;
      }
  }

  onActiveKeyboard() {

  }


  private hideTextMessage(delay: number){
    ScanditMatrixSimple.setTimeout("hideText", delay, "");
  }

  private executeAction(action: string, paramsString: string){
    let params = [];
    try{
      params = JSON.parse(paramsString);
    } catch (e) {

    }

    switch (action){
      case 'lastCodeScannedStart':
        this.lastCodeScanned = '';
        break;
      case 'hideText':
        ScanditMatrixSimple.showText(false);
        break;
    }
  }

}
