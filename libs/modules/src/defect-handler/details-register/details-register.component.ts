import { Component, OnInit } from '@angular/core';
import {IncidentsService, TypesService, environment, IntermediaryService, UploadFilesService} from '@suite/services';
import { AlertController, LoadingController, ModalController, NavParams } from "@ionic/angular";
import { InventoryService, WarehouseService } from '@suite/services';
import { DefectiveRegistryModel } from '../../../../services/src/models/endpoints/DefectiveRegistry';
import { DefectiveRegistryService } from '../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { DamagedModel } from '../../../../services/src/models/endpoints/Damaged';
import { ChangeStateComponent } from '../../components/modal-defective/change-state/change-state.component';
import { PrinterService } from '../../../../services/src/lib/printer/printer.service';
import {PrintTicketService} from "../../../../services/src/lib/print-ticket/print-ticket.service";
import {SelectScrollbarProvider} from "../../../../services/src/providers/select-scrollbar/select-scrollbar.provider";
import {PopoverController} from "@ionic/angular";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {ToolbarProvider} from "../../../../services/src/providers/toolbar/toolbar.provider";
import { DropFilesComponent } from '../../drop-files/drop-files.component';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { ModalReviewComponent } from '../../components/modal-defective/ModalReview/modal-review.component';
import { SignatureComponent } from '../../signature/signature.component';
import { ReviewImagesComponent } from '../../incidents/components/review-images/review-images.component';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileUploadOptions, FileTransferObject, FileUploadResult, FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Router } from '@angular/router';
import {SelectScrollbarComponent} from "./select-scrollbar/select-scrollbar.component";
import {DefectiveManagementService} from "../../../../services/src/lib/endpoint/defective-management/defective-management.service";
import {DefectiveZonesService} from "../../../../services/src/lib/endpoint/defective-zones/defective-zones.service";
import { DropFilesService } from '../../../../services/src/lib/endpoint/drop-files/drop-files.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'suite-details-register',
  templateUrl: './details-register.component.html',
  styleUrls: ['./details-register.component.scss']
})
export class DetailsRegisterComponent implements OnInit {
  id: number;
  ticketEmit: boolean;
  private baseUrlPhoto = environment.apiBasePhoto;
  section = 'information';
  title = 'Ubicación ';
  productId: string;
  registry: any = {};
  registry_data: any ={};
  registryHistorical;
  showChangeState = false;
  date: any;
  container = null;
  warehouseId: number;
  listProducts: any[] = [];
  loading = null;

  actionTypes = {};
  listWarehouses: any[] = [];
  listHalls: any[] = [];
  listHallsOriginal: any = {};
  listRows: any[] = [];
  listRowsOriginal: any = {};
  listColumns: any[] = [];
  listColumnsOriginal: any = {};
  listReferences: any = {};
  warehouseSelected: number;
  columnSelected: number;
  dates: any[] = [];
  statusManagement;
  allDefectType = [];
  allOptions = [];
  passHistory: boolean;
  requirePhoto: boolean;
  requireContact: boolean;
  requireOk: boolean;
  defectStatus: any;
  managementId;
  selectGestionState = false;
  barcode = "64565465645655";
  txtName = ""
  txtInfo = "";
  apiURL: string = environment.uploadFiles + '?type=defects'
  imgData: string;
  img: any;
  photos: Array<any> = [];
  photoList: boolean = false;
  signatureList: boolean = false;
  displayPhotoList: boolean = false;
  signatures: any = null
  dateNow = moment().format("YYYY-MM-DD");
  dateDetection;
  incidenceForm: FormGroup;
  readed: boolean;
  defectChildId;
  defectParentId;
  ParentAndChild;
  ZoneAndChild;
  status;
  signatureId;
  signaturesSubscription: Subscription;
  pagerValues = [10, 20, 80];

  defects: any = [];
  defectsSubtypes: any = [];
  defectChildsOfParent: any = [];
  zones: any = [];
  zonesChilds: any = [];
  defectZonesChildsOfParent: any = [];
  defectZoneChildId;
  defectZoneParentId;
  select1: boolean = false;
  select2: boolean = false;
  statusManagament: any;
  public barcodeRoute = null;
  public types: any;
  public differentState: boolean = true;
  private typeIdBC: number;
  private varTrying;
  lastPopoverType: string;
  defectTypeP: any;
  defectTypeC: any;
  defectZoneP: any;
  defectZoneC: any;

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
    private typeService: TypesService,
    private defectiveRegistryService: DefectiveRegistryService,
    private defectiveManagementService: DefectiveManagementService,
    private defectiveZonesService: DefectiveZonesService,
    private modalController: ModalController,
    private navParams: NavParams,
    private printerService: PrinterService,
    private warehouseService: WarehouseService,
    private alertController: AlertController,
    private inventoryService: InventoryService,
    private loadingController: LoadingController,
    private incidentsService: IncidentsService,
    private printTicketService: PrintTicketService,
    private popoverController: PopoverController,
    private selectScrollbarProvider: SelectScrollbarProvider,
    private intermediary: IntermediaryService,
    private fb: FormBuilder,
    private intermediaryService: IntermediaryService,
    private dropFilesService: DropFilesService,
    private uploadService: UploadFilesService,
    private toolbarProvider: ToolbarProvider,
    private camera: Camera,
    private transfer: FileTransfer,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.id = this.navParams.get("id");
    this.productId = this.navParams.get("productId");
    this.showChangeState = this.navParams.get("showChangeState");
  }

  ngOnInit() {

    this.incidenceForm = this.fb.group({
      id: [0],
      productId: [0],
      productReference: [""],
      dateDetection: [""],
      observations: [""],
      factoryReturn: [false],
      statusManagementDefectId: [0],
      defectTypeParentId: [0],
      defectTypeChildId: [0],
      defectZoneParentId: [0],
      defectZoneChildId: [0],
      signFileId: [0],
      contact: this.fb.group({
        name: [''],
        info: [''],
      })

    })

    this.container = this.navParams.data.container;
    this.warehouseId = this.navParams.data.warehouseId;
    this.listWarehouses = this.warehouseService.listWarehouses;
    this.listHallsOriginal = this.warehouseService.listHalls;
    this.listRowsOriginal = this.warehouseService.listRows;
    this.listColumnsOriginal = this.warehouseService.listColumns;
    this.listReferences = this.warehouseService.listReferences;

    this.warehouseSelected = null;
    this.getRegistryDetail();
    this.getRegistryHistorical();
    this.getActionTypes();

    this.photos = [];
    this.dropFilesService.getImage().subscribe(resp => {
      if (resp) {
        this.photos.push(resp)
        this.displayPhotoList = true;
        this.photoList = true;
      }
      if (this.photos) {
        this.openPhotoList();
      }
    });

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
      if (!this.signatureList) {
        this.openSignatureList()
      }
    })
  }

  initGestionState() {

    let res;

    res = this.registry.statusManagementDefect;


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
      id: [this.registry.id],
      productId: [this.registry.product.id],
      productReference: [this.registry.product.reference],
      dateDetection: [this.date],
      observations: [this.registry.observations],
      factoryReturn: [false],
      statusManagementDefectId: this.registry && this.registry && this.registry.statusManagementDefect ? [this.registry.statusManagementDefect.id] : [0],
      defectTypeParentId: this.registry && this.registry && this.registry.defectTypeParent ? [this.registry.defectTypeParent.id] : [0],
      defectTypeChildId: this.registry && this.registry && this.registry.defectTypeChild ? [this.registry.defectTypeChild.id] : [0],
      defectZoneParentId: this.registry && this.registry && this.registry.defectZoneParent ? [this.registry.defectZoneParent.id] : [0],
      defectZoneChildId: this.registry && this.registry && this.registry.defectZoneChild ? [this.registry.defectZoneChild.id] : [0],
      signFileId: [0],
      contact: this.fb.group({
        name: this.registry && this.registry.contact && this.registry.contact.name ? [this.registry.contact.name] : [''],
        info: this.registry && this.registry.contact && this.registry.contact.info ? [this.registry.contact.info] : [''],
      })

    })
    console.log("mostrando datos", this.incidenceForm.value);

    this.txtName = this.registry && this.registry.contact && this.registry.contact.name ? this.registry.contact.name : "";
    this.txtInfo = this.registry && this.registry.contact && this.registry.contact.info ? this.registry.contact.info : "";

    this.ParentAndChild = "";
    this.ZoneAndChild = "";
    if(this.registry && this.registry && this.registry.defectTypeParent && this.registry.defectTypeParent.name) this.ParentAndChild +=  this.registry.defectTypeParent.name;
    if(this.registry && this.registry && this.registry.defectTypeChild && this.registry.defectTypeChild.name) this.ParentAndChild +=  "-"+this.registry.defectTypeChild.name;
    if(this.registry && this.registry && this.registry.defectZoneParent && this.registry.defectZoneParent.name) this.ZoneAndChild +=  this.registry.defectZoneParent.name;
    if(this.registry && this.registry && this.registry.defectZoneChild && this.registry.defectZoneChild.name) this.ZoneAndChild +=  "-"+this.registry.defectZoneChild.name;

  }

  async initDinamicFields() {
    this.incidentsService.getDefectTypesChild().subscribe(resp => {
      this.defectsSubtypes = resp;
    })
    this.incidentsService.getDefectTypesParent().subscribe(resp => {
      this.defects = resp;
    })
    this.incidentsService.getDefectZonesChild().subscribe(resp => {
      this.zonesChilds = resp;
    })
    this.incidentsService.getDefectZonesParent().subscribe(resp => {
      this.zones = resp;
    })
    this.incidentsService.getDtatusManagamentDefect().subscribe(resp => {
      this.statusManagament = resp
      this.types = resp.statuses;
      this.defectType(resp);
    })
  }

  onChange(value) {
    if (value != this.typeIdBC) {
      this.differentState = false;
    } else {
      this.differentState = true;
    }

  }

  getActionTypes(): void {
    this.typeService.getTypeActions().subscribe(ActionTypes => {
      ActionTypes.forEach(actionType => {
        this.actionTypes[actionType.id] = actionType.name
      })
    })
  }

  getRegistryHistorical(): void {
    console.log("Actualice la información.......");
    this.defectiveRegistryService.getHistoricalAl({ id: this.id }).subscribe(historical => {
      this.registryHistorical = historical;
    });
  }

  getRegistryDetail(): void {
    this.defectiveRegistryService.getDataDefect({ id: this.id }).subscribe(lastHistorical => {
      this.registry_data = {
        data: lastHistorical.data,
        status: lastHistorical.statuses};
      this.registry = lastHistorical.data;

      if(this.registry.defectTypeParent) {
        this.defectTypeP = this.registry.defectTypeParent;
        this.defectParentId = this.registry.defectTypeParent.id;
        this.defectChildId = this.registry.defectTypeChild && this.registry.defectTypeChild.id ? this.registry.defectTypeChild.id : 0;
        this.defectTypeC = this.registry.defectTypeChild ? this.registry.defectTypeChild : null;
        this.defectiveManagementService.getShow(this.defectParentId).subscribe(data => {
          this.defectChildsOfParent = data.defectTypeChild;
        });
      }
      if(this.registry.defectZoneParent) {
        this.defectZoneP = this.registry.defectZoneParent;
        this.defectZoneParentId = this.registry.defectZoneParent.id;
        this.defectZoneChildId = this.registry.defectZoneChild && this.registry.defectZoneChild.id ? this.registry.defectZoneChild.id : 0;
        this.defectZoneC = this.registry.defectZoneChild ? this.registry.defectZoneChild : null;
        this.defectiveZonesService.getShow(this.defectZoneParentId).subscribe(data => {
          this.defectZonesChildsOfParent = data.defectZoneChild;
        });
      }
      this.date = formatDate(this.registry.dateDetection, 'dd/MM/yyyy', 'es');
      this.date = moment().format("YYYY-MM-DD");
      this.getStatusManagement();
      this.initForm();
      this.initGestionState();
      this.signatures = null;
      this.photos = [];
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state != undefined) {
        this.readed = true;
        this.barcodeRoute = navigation.extras.state['reference'];
      }
      this.initDinamicFields();
      this.defectStatus = this.registry.statusManagementDefect;
    });
  }

  async close() {
    await this.modalController.dismiss();
  }

  async closeWithoutSave() {
    if(this.isStateChange()){
      await this.presentModelConfirmClose();
    } else {
      await this.modalController.dismiss();
    }
  }


  onKeyName(event) {
    this.txtName = event.target.value;
  }
  onKeyInfo(event) {
    this.txtInfo = event.target.value;
  }

  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }

  async presentAlert(subHeader) {
    const alert = await this.alertController.create({
      header: 'Atencion',
      subHeader,
      buttons: ['OK']
    });
    await alert.present();
  }

  getRequireStatus(defectStatus, statusName: string) {
    if (defectStatus && statusName) {
      switch (statusName) {
        case 'contact':
          return defectStatus.requireContact;
        case 'history':
          return defectStatus.passHistory;
        case 'photo':
          return defectStatus.requirePhoto;
        case 'signature':
          return defectStatus.requireOk;
        case 'ticket':
          return defectStatus.ticketEmit;
        case 'orders':
          return defectStatus.allowOrders;
      }
    }
  }

  print(defective) {
    this.incidentsService.getData(defective).subscribe(
      resp => {
        if (resp.data.statusManagementDefect.ticketEmit == true) {
          this.printTicketService.printTicket(resp.data);
        }
      });
  }

  getStatusManagement() {
    this.incidentsService.getDtatusManagamentDefect().subscribe(resp => {
      this.statusManagement = resp;
      this.defectType(this.statusManagement);
    })
  }

  defectType(defecType) {
    this.allDefectType = defecType ? defecType.classifications : [];
  }

  clickSelectPopover(ev: any, popoverType: string) {
    ev.stopPropagation();
    ev.preventDefault();
    this.lastPopoverType = popoverType;

    switch (popoverType) {
      case 'status':
        this.openSelectPopover(ev, null, this.allDefectType);
        break;
      case 'typeP':
        this.openSelectPopover(ev, null, this.defects);
        break;
      case 'typeC':
        this.openSelectPopover(ev, null, this.defectChildsOfParent);
        break;
      case 'zoneP':
        this.openSelectPopover(ev, null, this.zones);
        break;
      case 'zoneC':
        this.openSelectPopover(ev, null, this.defectZonesChildsOfParent);
        break;
    }

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
      switch(this.lastPopoverType){
        case 'status':
          this.selectChangeStatus(data);
          break;
        case 'typeP':
          this.selectChangeTypeP(data);
          break;
        case 'typeC':
          this.selectChangeTypeC(data);
          break;
        case 'zoneP':
          this.selectChangeZoneP(data);
          break;
        case 'zoneC':
          this.selectChangeZoneC(data);
          break;
      }
    });
    await popover.present();
  }

  selectChangeTypeP(defectTypeP) {
    this.defectTypeP = defectTypeP.data;
    this.defectTypeC = null;
    this.defectChange(this.defectTypeP);
  }
  selectChangeTypeC(defectTypeC) {
    this.defectTypeC = defectTypeC.data;
    this.defectParentChange(this.defectTypeC);
  }
  selectChangeZoneP(defectZoneP) {
    this.defectZoneP = defectZoneP.data;
    this.defectZoneC = null;
    this.defectZoneChange(this.defectZoneP);
  }
  selectChangeZoneC(defectZoneC) {
    this.defectZoneC = defectZoneC.data;
    this.defectZoneChangeParent(this.defectZoneC);
  }

  selectChangeStatus(defectStatus) {
    if(defectStatus && defectStatus.data){
      this.defectStatus = defectStatus.data;
      this.managementId = defectStatus.data;
      this.gestionChange(this.defectStatus);
    }
  }

  gestionChange(e) {
    let id = e.id;
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

  isStateChange(){
    return this.registry.statusManagementDefect && this.defectStatus && this.registry.statusManagementDefect.id != this.defectStatus.id;
  }

  send() {

    this.incidenceForm.patchValue({
      defectTypeChildId: this.defectChildId,
      defectTypeParentId: this.defectParentId,
      defectZoneChildId: this.defectZoneChildId,
      defectZoneParentId: this.defectZoneParentId,
    });

    if (this.requirePhoto) {
      if (this.photos.length > 0) {
        let photos = [];
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


  clearVariables(type?: number) {
    if (!type) {
      if(this.incidenceForm){
        this.incidenceForm.patchValue({
          id: this.registry.id,
          productReference: this.registry.product.id,
          dateDetection: moment().format("YYYY-MM-DD"),
          observations: '',
          factoryReturn: false,
          statusManagementDefectId: 0,
          defectTypeParentId: 0,
          defectTypeChildId: 0,
          defectZoneParentId: 0,
          defectZoneChildId: 0,
          photosFileIds: [],
          signFileId: 0,
          contact: {
            name: '',
            info: ''
          }
        });
      }
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

  isFormComplete(){
    if(!this.selectGestionState){
      return false;
    }
    if(this.requirePhoto && this.photos.length == 0){
      return false;
    }
    if(this.requireOk && !this.signatures){
      return false;
    }
    if(this.requireContact && this.txtName.length < 4 && this.txtInfo.length < 1){
      return false;
    }
    return true;
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 15,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
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
      quality: 15,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
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
          this.showPhotoList();
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

  defectChange(e) {
    this.select2 = true;
    this.defectParentId = e.id;
    this.defectChildsOfParent = e.defectTypeChild ? e.defectTypeChild : [];
    this.defectChildId = 0;
  }

  defectParentChange(e) {
    this.select2 = true;
    this.defectChildId = e.id;
  }

  defectZoneChange(e) {
    this.select2 = true;
    this.defectZoneParentId = e.id;
    this.defectZonesChildsOfParent = e.defectZoneChild ? e.defectZoneChild : [];
    this.defectZoneChildId = 0;
  }

  defectZoneChangeParent(e) {
    this.select2 = true;
    this.defectZoneChildId = e.id;
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

  openPhotoList() {
    this.photoList = !this.photoList;
  }

  showPhotoList() {
    this.displayPhotoList = !this.displayPhotoList;
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

  async presentModelConfirmClose(){
    let buttonsAlert: any = [{
      text: "Salir sin guardar",
      handler: async ()=>{
        await this.modalController.dismiss();
      }
    }, {
      text: "No",
      handler: ()=>{

      }
    }];

    const alert = await this.alertController.create({
      header: "Salir sin guardar",
      message: "¿Está seguro de que desea salir de la operación sin guardar los cambios?",
      buttons: buttonsAlert
    });
    alert.onDidDismiss().then((data) => {
      if(!data){

      }
    });
    return await alert.present();
  }

  ngOnDestroy() {
    this.signaturesSubscription.unsubscribe()
    this.clearVariables();
  }
}
