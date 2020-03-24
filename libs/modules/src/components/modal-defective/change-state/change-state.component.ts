import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from "@ionic/angular";
import { RegistryDetailsComponent } from '../registry-details/registry-details.component';
import { IntermediaryService, IncidentsService, environment, UploadFilesService } from '../../../../../services/src';
import { DropFilesComponent } from '../../../drop-files/drop-files.component';
import { formatDate } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { DropFilesService } from '../../../../../services/src/lib/endpoint/drop-files/drop-files.service';
import { ModalReviewComponent } from '../ModalReview/modal-review.component';
import { SignatureComponent } from '../../../signature/signature.component';
import { ReviewImagesComponent } from '../../../incidents/components/review-images/review-images.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'suite-change-state',
  templateUrl: './change-state.component.html',
  styleUrls: ['./change-state.component.scss']
})
export class ChangeStateComponent implements OnInit {
  private baseUrlPhoto = environment.apiBasePhoto;
  allDefectType = [];
  ticketEmit: boolean;
  passHistory: boolean;
  requirePhoto: boolean;
  requireContact: boolean;
  requireOk: boolean;
  checkHistory: boolean;
  registry;
  barcode = "64565465645655";
  txtName = ""
  txtEmail = "";
  txtTel = "";
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
  showChangeState;
  status;
  managementId;
  statusManagement;
  selectGestionState = false;
  signatureId;

  signaturesSubscription: Subscription;

  constructor(
    private incidentsService: IncidentsService,
    private intermediary: IntermediaryService,
    private modalController: ModalController,
    private navParams: NavParams,
    private fb: FormBuilder,
    private intermediaryService: IntermediaryService,
    private dropFilesService: DropFilesService,
    private uploadService: UploadFilesService,

  ) {
    this.registry = this.navParams.get("registry");
  }

  ngOnInit() {
    this.photoList = false;

    this.dropFilesService.getImage().subscribe(resp => {
      if (resp) {
        this.photos.push(resp);
        this.displayPhotoList = true;
        this.photoList = true;
      }
    });
    this.date = formatDate(this.registry.data.dateDetection, 'dd/MM/yyyy', 'es');
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
      if (!this.signatureList) {
        this.openSignatureList()
      }
    })





    /*this.uploadService.signatureEventAsign().subscribe(resp => {
      if (resp) {
        this.signatures.push(resp)
      }
      if (!this.signatureList) {
        this.openSignatureList()
      }
      if(resp != null || resp != undefined){
        this.signatureId = resp.id;
        this.signature = true;
      }

    })*/
  }

  openPhotoList() {
    this.photoList = !this.photoList;
  }

  initForm() {
    this.incidenceForm = this.fb.group({
      productId: 1,
      productReference: [this.registry.data.product.reference],
      dateDetection: [moment().format("YYYY-MM-DD")],
      observations: [this.registry.data.observations],
      factoryReturn: [false],
      statusManagementDefectId: [this.registry.data.statusManagementDefect.id],
      defectTypeChildId: [this.registry.data.defectTypeChild.id],
      signFileId: [0],
      contact: this.fb.group({
        name: [this.registry.data.contact.name],
        email: [this.registry.data.contact.email],
        phone: [this.registry.data.contact.phone]
      })

    })

    this.txtName = this.registry.data.contact.name;
    this.txtEmail = this.registry.data.contact.email;
    this.txtTel = this.registry.data.contact.phone;

    this.ParentAndChild = this.registry.data.defectTypeChild.name + " - "
      + this.registry.data.defectTypeParent.name;

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

    if (this.requireContact == true) {
      if (this.validate()) {
        this.sendToIncidents();
      }
    }
    else {
      this.incidenceForm.patchValue({
        statusManagementDefectId: this.managementId,
      });
      let object = this.incidenceForm.value;
      delete object.contact;
      this.sendToDefectsWithoutContact(object);
    }
  }




  async close() {
    await this.modalController.dismiss().then(async () => {
      const modal = await this.modalController.create({
        component: RegistryDetailsComponent,
        componentProps: {
          productId: this.registry.data.product.id,
          showChangeState: true
        },
        backdropDismiss: false
      });

      return await modal.present();
    });
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

  async sendToIncidents() {

    this.incidenceForm.value.contact.phone = this.txtTel + "";
    this.incidenceForm.patchValue({
      statusManagementDefectId: this.managementId,
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
        this.signatures = [];
        This.intermediary.dismissLoading()
        This.intermediary.presentToastSuccess('El defecto fue enviado exitosamente');
        this.close();
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
        this.close();
      },
      e => {
        console.log(e);

        This.intermediary.dismissLoading()
        This.intermediary.presentToastError(e.error)
      }
    );



  }

  print() {
    console.log("imprimir...")
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

  async searchPhoto() {
    const modal = await this.modalController.create({
      component: DropFilesComponent,
    });
    await modal.present();
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






  gestionChange(e) {
    let id = e.detail.value;
    console.log("this.statusManagament", this.statusManagement);
    let res;

    res = this.statusManagement['classifications'].find(x => x.defectType == id);



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

  defectType_(defecType_) {

    let defecType = [];
    defecType_['status'].forEach(element => {
      let res = defecType_.data.statusManagementDefect.defectType == element.id;

      if (res == true) {

      } else {
        defecType.push(
          {
            id: element.id,
            name: element.name
          });
      }
    });

    this.allDefectType = defecType;
    console.log(this.allDefectType);
  }


  defectType(defecType_) {
    console.log(defecType_);
    let defecType = [];
    defecType_['classifications'].forEach(element => {
      let res = defecType_['statuses'].find(x => x.id == element.defectType);
      if (res != undefined) {

        if (res.id == this.registry.data.statusManagementDefect.defectType) {

        } else {
          defecType.push(res);
        }

      }
    });
    this.allDefectType = defecType;

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
        //this.signature = false;
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


  ngOnDestroy() {
    this.clearVariables();
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

}
