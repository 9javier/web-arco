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
import {SignatureComponent} from '../signature/signature.component';
import {DropFilesComponent} from '../drop-files/drop-files.component';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Platform } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult } from '@ionic-native/file-transfer/ngx';
import { ReviewImagesComponent } from './components/review-images/review-images.component';
import { ProductModel, ProductsService } from '@suite/services';
import { AlertController } from "@ionic/angular";
import { PositionsToast } from '../../../services/src/models/positionsToast.type';
import { ToolbarProvider } from "../../../services/src/providers/toolbar/toolbar.provider";

//import { ReviewImagesComponent } from './components/review-images/review-images.component';

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
  requirePhoto: boolean;
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
  public types: any;
  public differentState: boolean = true;
  private typeIdBC: number;


  private varTrying;
  apiURL: string = environment.uploadFiles + '?type=defects'
  imgData: string;
  img: any;
  photos: Array<any> = []
  signatures: any = null
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
    private toolbarProvider: ToolbarProvider,
    private dropService: DropFilesService
  ) { 


  }

  ngOnInit() {

    this.signatures = null;

    this.toolbarProvider.currentPage.next("Registro defectuoso")
    this.photos = [];
    console.log(this.photos);
    console.log(this.signatures);


    this.uploadService.signatureEventAsign().subscribe(resp => {
      console.log(this.signatures);

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
      if (!this.signatureList) {
        this.openSignatureList()
      }
      console.log(resp);
    })

    this.date = moment().format('DD-MM-YYYY');
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

    if (this.signatures) {
      this.uploadService.deleteFile(this.signatures.id).subscribe(resp => {
        this.signatures = null
        this.uploadService.setSignature(null)
      })
    }

    if (this.photos.length > 0) {
      this.photos.forEach(elem => {
        this.uploadService.deleteFile(elem.id).subscribe(resp => { })
      })
    }
    this.signatures = null
    this.photos = []
  }

  defectType(defecType_) {

    let defecType = [];
    defecType_['classifications'].forEach(element => {
      let res = defecType_['statuses'].find(x => x.id == element.defectType);
      if (res != undefined) {
        defecType.push(res);
      }
    });
    this.allDefectType = defecType;
  }

  initForm() {

    let phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    this.incidenceForm = this.fb.group({
      productId: 1,
      productReference: '',
      dateDetection: [this.date],
      observations: '',
      numberObservations: 1,
      factoryReturn: [false],
      statusManagementDefectId: [0],
      defectTypeChildId: [0],
      signFileId: [0],
      gestionState: 0,
      contact: this.fb.group({
        name: '',
        email: '',
        phone: ['']
      })

    })
  }

  async initDinamicFields() {
    this.incidentsService.getDefectTypesChild().subscribe(resp => {
      this.defects = resp;

    })
    this.incidentsService.getDtatusManagamentDefect().subscribe(resp => {
      this.statusManagament = resp
      this.types = resp.statuses;
      this.defectType(resp);
    })
    this.loadFromDBValues();
  }

  async loadFromDBValues() {

    if (this.barcodeRoute) {
      let body = {
        // "productId":12,
        "productId": this.barcodeRoute,
        "productReference": ""
      }
      await this.incidentsService.getOneIncidentProductById(body).subscribe(resp => {

        // this.types = resp.data;
        resp = resp.data;
        // let contact = resp.contact;
        console.log('result', resp);
        // console.log('contact', contact);

        this.statusManagament = {
          'classifications': resp.statusManagementDefect
        }

        console.log("resp status ", resp.statusManagementDefect);

        this.statusManagament["classifications"] = resp.statusManagementDefect;

        this.varTrying = resp.statusManagementDefect.id;

        // this.incidenceForm.patchValue({ gestionChange: resp.statusManagementDefect.id })
        this.incidenceForm.patchValue({
          productReference: resp.product.reference,
          barcode: resp.product.reference,
          registerDate: Date.now(),
          observations: resp.observations,
          gestionState: resp.statusManagementDefect.id,
          gestionChange: resp.statusManagementDefect.id,
          photo: resp.photo,
          validation: resp.validation,
          isHistory: resp.isHistory,
          statusManagementDefectId: resp.statusManagementDefect.id,
          defectTypeChildId: resp.defectTypeChild.id,
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
    console.log(e);
    this.barcode = e;
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
  print() {
    console.log("imprimir...")
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

    if (!this.requireOk && !this.signatures) {
      msg = "La firma es requerida";
      validation = false;
    }

    if (!this.requirePhoto && this.photos.length == 0) {
      msg = "Debe capturar por lo menos una foto";
      validation = false;
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
        this.incidenceForm.addControl('signFileId', new FormControl(this.signatures.id))
      } else {
        this.intermediary.presentToastError("Debe Agregar la Firma");
        return;
      }

    }
    console.log("aqui " + this.requireContact);
    console.log(this.incidenceForm.value);
    if (this.requireContact == true) {
      if (this.validate()) {
        this.sendToIncidents();
      }
    }
    else {
      this.incidenceForm.patchValue({
        statusManagementDefectId: this.managementId,
        defectTypeChildId: this.defectChildId,
      });
      let object = this.incidenceForm.value;
      delete object.contact;
      this.sendToDefectsWithoutContact(object);
    }


    /* this.incidenceForm.patchValue({
       statusManagementDefectId: this.managementId,
       defectTypeChildId: this.defectChildId,
       signFileId: this.signatures.id,
       photosFileIds: photos,
       contact:{
         name: this.txtName,
         email: this.txtEmail,
         phone: this.txtTel
       }
     })*/

  }


  async enviaryarn() {
    let photos = []
    this.photos.forEach(elem => {
      photos.push({ id: elem.id });
    });
    this.incidenceForm.patchValue({
      statusManagementDefectId: this.managementId,
      defectTypeChildId: this.defectChildId,
      defectTypeParentId: 1,
      photosFileIds: photos,
      signFileId: this.signatures.id,
      // contact:{
      //   name: this.txtName,
      //   email: this.txtEmail,
      //   phone: this.txtTel,
      // },
    })
    console.log("hello world", this.incidenceForm);
    let This = this;
    await This.intermediary.presentLoading('Enviando...')
    if (this.ticketEmit == true) {
      this.print();
    }

    if (this.incidenceForm.value.observations == null) {
      this.incidenceForm.patchValue({
        observations: "None",
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
        console.log(e);
        This.intermediary.dismissLoading()
        This.intermediary.presentToastError(e.error)
        console.log("e,", e);
      }
    );

  }

  async enviar() {
    let photos = []
    this.photos.forEach(elem => {
      photos.push({ id: elem.id });
    });
    this.incidenceForm.patchValue({
      statusManagementDefectId: this.managementId,
      defectTypeChildId: this.defectChildId,
      photosFileIds: photos,
      signFileId: this.signatures.id,
      // contact:{
      //   name: this.txtName,
      //   email: this.txtEmail,
      //   phone: this.txtTel,
      // },
    })

  }




  async sendToIncidents() {
    this.incidenceForm.value.contact.phone = this.txtTel + "";
    this.incidenceForm.patchValue({
      statusManagementDefectId: this.managementId,
      defectTypeChildId: this.defectChildId,
    })


    let This = this;

    This.incidentsService.addRegistry(this.incidenceForm.value).subscribe(
      resp => {
        if (this.ticketEmit == true) {
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
        this.signatures = null;
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



  async sendToDefectsWithoutContact(object) {


    let This = this;
    This.incidentsService.addRegistry(object).subscribe(
      resp => {

        if (this.ticketEmit == true) {
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
    console.log("this.statusManagament", this.statusManagament);
    let res;
    if (this.barcodeRoute == null || this.barcodeRoute == undefined) {
      res = this.statusManagament['classifications'].find(x => x.defectType == id);

    } else {
      res = this.statusManagament.classifications != undefined ? this.statusManagament.classifications : this.statusManagament['classifications'].find(x => x.defectType == id);

    }

    if (res != undefined) {
      console.log("res", res);

      if (res instanceof Array) {
        res = res.find(x => x.id == id);
      }
      this.ticketEmit = res.ticketEmit;
      this.passHistory = res.passHistory;
      this.requirePhoto = res.requirePhoto
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
  async searchPhoto() {
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


  private getSizeListByReference(dataWrote: string) {
    const body = {
      reference: dataWrote
    };
    this.productsService.verifyProdcut(body).subscribe((res) => {
      if (res !== undefined) {
        this.intermediaryService.presentToastError('El producto solicitado ya se encuentra registrado', PositionsToast.BOTTOM).then(() => {
          this.readed = false
        });
      } else {
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
