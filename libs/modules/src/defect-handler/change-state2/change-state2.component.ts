import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from "@ionic/angular";
import { DetailsRegisterComponent } from '../details-register/details-register.component';
import { IntermediaryService, IncidentsService, environment, UploadFilesService } from '../../../../services/src';
import { DropFilesComponent } from '../../drop-files/drop-files.component';
import { formatDate } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { DropFilesService } from '../../../../services/src/lib/endpoint/drop-files/drop-files.service';
import { Subscription } from 'rxjs';
import { ModalReviewComponent } from '../../components/modal-defective/ModalReview/modal-review.component';
import { SignatureComponent } from '../../signature/signature.component';
import { ReviewImagesComponent } from '../../incidents/components/review-images/review-images.component';
import { ToolbarProvider } from "../../../../services/src/providers/toolbar/toolbar.provider";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileUploadOptions, FileTransferObject, FileUploadResult, FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Router } from '@angular/router';
import { DefectiveRegistryService } from '../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { PrintTicketService } from '../../../../services/src/lib/print-ticket/print-ticket.service';
import {SelectScrollbarComponent} from "../../incidents/components/select-scrollbar/select-scrollbar.component";
import {SelectScrollbarProvider} from "../../../../services/src/providers/select-scrollbar/select-scrollbar.provider";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'suite-change-state2',
  templateUrl: './change-state2.component.html',
  styleUrls: ['./change-state2.component.scss']
})
export class ChangeState2Component implements OnInit {
  allDefectType = [];
  allOptions = [];
  ticketEmit: boolean;
  passHistory: boolean;
  requirePhoto: boolean;
  requireContact: boolean;
  requireOk: boolean;
  checkHistory: boolean;
  registry;
  barcode = "64565465645655";
  txtName = ""
  txtInfo = "";
  apiURL: string = environment.uploadFiles + '?type=defects'
  imgData: string;
  img: any;
  photos: Array<any> = []

  photoList: boolean = false;
  signatureList: boolean = false;
  displayPhotoList: boolean = false;
  signatures: any = null
  date: string;
  dateNow = moment().format("YYYY-MM-DD");
  dateDetection;
  incidenceForm: FormGroup;
  defectContacto: FormGroup;
  readed: boolean;
  defectChildId;
  defectParentId;
  ParentAndChild;
  ZoneAndChild;
  showChangeState;
  status;
  managementId;
  statusManagement;
  selectGestionState = false;
  signatureId;
  pagerValues = [10, 20, 80];
  signaturesSubscription: Subscription;

  state: boolean;
  color: string;

  defectStatus: any;

  form: FormGroup = this.formBuilder.group({
    product: [],
    model: [],
    size: [],
    color: [],
    brand: [],
    dateDetection: [],
    statusManagementDefect: [],
    defectTypeParent: [],
    defectTypeChild: [],
    warehouse: [],
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: 1,
      order: "asc"
    })
  });
  constructor(
    private incidentsService: IncidentsService,
    private intermediary: IntermediaryService,
    private modalController: ModalController,
    private navParams: NavParams,
    private fb: FormBuilder,
    private intermediaryService: IntermediaryService,
    private dropFilesService: DropFilesService,
    private uploadService: UploadFilesService,
    private toolbarProvider: ToolbarProvider,
    private camera: Camera,
    private transfer: FileTransfer,
    private router: Router,
    private formBuilder: FormBuilder,
    private defectiveRegistryService: DefectiveRegistryService,
    private printTicketService: PrintTicketService,
    private popoverController: PopoverController,
    private selectScrollbarProvider: SelectScrollbarProvider

  ) {
    this.registry = this.navParams.get("registry");
  }

  ngOnInit() {
    this.photos = []
    this.dropFilesService.getImage().subscribe(resp => {
      if (resp) {
        this.photos.push(resp)
        console.log(this.photos);
        this.displayPhotoList = true;
        this.photoList = true;
      }
      if (this.photos) {
        this.openPhotoList();
      }
      console.log(resp);
    });
    this.date = formatDate(this.registry.data.dateDetection, 'dd/MM/yyyy', 'es');
    this.date = moment().format("YYYY-MM-DD");
    this.getStatusManagement();
    this.initForm();
    this.initGestionState();
    this.signatures = null;
    this.photos = [];



    this.signaturesSubscription = this.uploadService.signatureEventAsign().subscribe(resp => {
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
      if (this.signatures) {
        this.signatures.pathMedium = `${environment.apiBasePhoto}${this.signatures.pathMedium}`
        this.signatures.pathIcon = `${environment.apiBasePhoto}${this.signatures.pathIcon}`
      }
      if (!this.signatureList) {
        this.openSignatureList()
      }
      console.log(resp);
    })
  }

  openPhotoList() {
    this.photoList = !this.photoList;
  }

  initForm() {

    this.form.patchValue({
      product: [],
      model: [],
      size: [],
      color: [],
      brand: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      warehouse: [],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
    });

    this.incidenceForm = this.fb.group({
      id: [this.registry.data.id],
      productId: [this.registry.data.product.id],
      productReference: [this.registry.data.product.reference],
      dateDetection: [this.date],
      observations: [this.registry.data.observations],
      factoryReturn: [false],
      statusManagementDefectId: this.registry && this.registry.data && this.registry.data.statusManagementDefect ? [this.registry.data.statusManagementDefect.id] : [0],
      defectTypeChildId: this.registry && this.registry.data && this.registry.data.defectTypeChild ? [this.registry.data.defectTypeChild.id] : [0],
      defectZoneChildId: this.registry && this.registry.data && this.registry.data.defectZoneChild ? [this.registry.data.defectZoneChild.id] : [0],
      signFileId: [0],
      contact: this.fb.group({
        name: this.registry.data && this.registry.data.contact && this.registry.data.contact.name ? [this.registry.data.contact.name] : [''],
        info: this.registry.data && this.registry.data.contact && this.registry.data.contact.info ? [this.registry.data.contact.info] : [''],
      })

    })
    console.log("mostrando datos", this.incidenceForm.value);

    this.txtName = this.registry.data && this.registry.data.contact && this.registry.data.contact.name ? this.registry.data.contact.name : "";
    this.txtInfo = this.registry.data && this.registry.data.contact && this.registry.data.contact.info ? this.registry.data.contact.info : "";

    this.ParentAndChild = "";
    this.ZoneAndChild = "";
    if(this.registry && this.registry.data && this.registry.data.defectTypeParent && this.registry.data.defectTypeParent.name) this.ParentAndChild +=  this.registry.data.defectTypeParent.name;
    if(this.registry && this.registry.data && this.registry.data.defectTypeChild && this.registry.data.defectTypeChild.name) this.ParentAndChild +=  "-"+this.registry.data.defectTypeChild.name;
    if(this.registry && this.registry.data && this.registry.data.defectZoneParent && this.registry.data.defectZoneParent.name) this.ZoneAndChild +=  this.registry.data.defectZoneParent.name;
    if(this.registry && this.registry.data && this.registry.data.defectZoneChild && this.registry.data.defectZoneChild.name) this.ZoneAndChild +=  "-"+this.registry.data.defectZoneChild.name;

  }

  showPhotoList() {
    this.displayPhotoList = !this.displayPhotoList;
  }
  validate() {

    let regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    let validation = true;
    let msg;
    let This = this;

    if (this.txtName.length < 4) {
      console.log("name false");
      msg = "Nombre debe tener minimo 4 digítos...";
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
    })
    if (this.requireContact == true) {
      if (this.validate()) {
        this.incidenceForm.value.contact.info = this.txtInfo + "";
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




  async close() {


    await this.modalController.dismiss();



  }


  onKeyName(event) {
    this.txtName = event.target.value;
  }
  onKeyInfo(event) {
    this.txtInfo = event.target.value;
  }

  async sendToIncidents(object) {

    let This = this;
    This.incidentsService.addRegistry(object).subscribe(
      resp => {

        if (this.ticketEmit == true) {
          this.print(resp.result);
        }

        this.readed = false;
        this.clearVariables();
        This.intermediary.dismissLoading()
        This.intermediary.presentToastSuccess('El defecto fue enviado exitosamente');
        this.close();
        this.defectiveRegistryService.getListDefectAfterUpdate(this.form.value);

      },
      e => {
        console.log(e);

        This.intermediary.dismissLoading()
        This.intermediary.presentToastError(e.error.errors)
      }
    );


  }



  print(defective) {
    this.printTicketService.printTicket(defective);
  }

  initGestionState() {

    let res;

    res = this.registry.data.statusManagementDefect;


    if (res != undefined) {
      console.log("Iniciando gestion state");
      console.log(res);

      this.ticketEmit = res.ticketEmit;
      //this.passHistory = res.passHistory;
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

  async openReviewImage(item) {
    const modal = await this.modalController.create({
      component: ModalReviewComponent,
      componentProps: {
        data: item
      }
    });
    await modal.present();
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
        response.data.pathMedium = `${environment.apiBasePhoto}${response.data.pathMedium}`
        response.data.pathIcon = `${environment.apiBasePhoto}${response.data.pathIcon}`
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


  gestionChange(e) {
    let id = e.id;
    console.log("this.statusManagament", this.statusManagement);
    let res;

    res = this.statusManagement['classifications'].find(x => x.id == id);



    if (res != undefined) {
      console.log("resultado de cambio...", res);

      /*if(res instanceof Array){
        res = res.find( x  => x.id == id);
      }*/

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

    this.selectGestionState = true;


  }
  defectChange(e) {
    //this.select2 = true;
    console.log(e);
    this.defectChildId = e.detail.value;
  }

  defectType(defecType) {
    this.allDefectType = defecType ? defecType.classifications : [];

  }

  getStatusManagement() {
    this.incidentsService.getDtatusManagamentDefect().subscribe(resp => {
      this.statusManagement = resp;
      this.defectType(this.statusManagement);
    })
  }

  async signModal() {
    const modal = await this.modalController.create({
      component: SignatureComponent,
    });

    await modal.present();
    // this.router.navigate(['signature']);
  }

  openSignatureList() {
    this.signatureList = !this.signatureList

  }

  async onOpenReviewModal(item) {
    const modal = await this.modalController.create({
      component: ReviewImagesComponent,
      componentProps: { imgSrc: item.pathMedium }
    });

    await modal.present();

  }

  deleteImage(item, index, arr) {
    this.intermediary.presentLoading()
    this.uploadService.deleteFile(item.id).subscribe(
      resp => {
        this.intermediary.presentToastSuccess('Archivo borrado exitosamente')
        arr.splice(index, 1);
        if (this.photos.length === 0) {
          this.openPhotoList()
        }
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
        this.uploadService.setSignature(null);
        this.clearVariables(1);
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


  ngOnDestroy() {

    this.signaturesSubscription.unsubscribe()
    this.clearVariables();
  }



  clearVariables(type?: number) {
    if (!type) {
      this.incidenceForm.patchValue({
        id: this.registry.data.id,
        productReference: this.registry.data.product.id,
        dateDetection: moment().format("YYYY-MM-DD"),
        observations: '',
        factoryReturn: false,
        statusManagementDefectId: 0,
        defectTypeChildId: 0,
        defectZoneChildId: 0,
        photosFileIds: [],
        signFileId: 0,
        contact: {
          name: '',
          info: ''
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

  clickSelectPopover(ev: any) {
    ev.stopPropagation();
    ev.preventDefault();
    this.openSelectPopover(ev, null, this.allDefectType);
  }

  public async openSelectPopover(ev: any, typedValue, allOptions) {
    this.selectScrollbarProvider.allOptions = allOptions;
    this.allOptions = allOptions;

    const popover = await this.popoverController.create({
      cssClass: 'select-scrollbar',
      component: SelectScrollbarComponent,
      componentProps: { typedValue, allOptions }
    });

    popover.onDidDismiss().then((data) => {
          this.selectChangeStatus(data);
    });
    await popover.present();
  }

  selectChangeStatus(defectStatus) {
    this.defectStatus = defectStatus.data;
    this.managementId = defectStatus.data;
    this.gestionChange(this.defectStatus);
  }

}
