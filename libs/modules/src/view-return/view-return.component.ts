import {Component, OnInit} from '@angular/core';
import {ReturnService} from "../../../services/src/lib/endpoint/return/return.service";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import Return = ReturnModel.Return;
import SaveResponse = ReturnModel.SaveResponse;
import {ActivatedRoute, Router} from "@angular/router";
import LoadResponse = ReturnModel.LoadResponse;
import {BrandModel} from "../../../services/src/models/endpoints/Brand";
import Brand = BrandModel.Brand;
import {
  AuthenticationService, environment,
  IntermediaryService,
  UploadFilesService,
  UserModel,
  WarehouseModel
} from "@suite/services";
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";
import {PickingProvider} from "../../../services/src/providers/picking/picking.provider";
import ReturnPacking = ReturnModel.ReturnPacking;
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileUploadOptions, FileTransferObject, FileUploadResult, FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {ModalController, NavParams } from "@ionic/angular";
import {DropFilesService} from "../../../services/src/lib/endpoint/drop-files/drop-files.service";
import User = UserModel.User;
import {ReviewImagesComponent} from "../incidents/components/review-images/review-images.component";
import { ModalReviewComponent } from '../components/modal-defective/ModalReview/modal-review.component';
import {Events} from "@ionic/angular";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {PrintTicketService} from "../../../services/src/lib/print-ticket/print-ticket.service";

@Component({
  selector: 'suite-view-return',
  templateUrl: './view-return.component.html',
  styleUrls: ['./view-return.component.scss']
})
export class ViewReturnComponent implements OnInit {
  private baseUrlPhoto = environment.apiBasePhoto;
  return: Return;
  apiArchivesURL: string = environment.uploadFiles + '?type=archives';
  apiDeliveryNotesURL: string = environment.uploadFiles + '?type=delivery_notes';
  imgData: string;
  img: any;

  archives: Array<any> = [];
  delivery_notes: Array<any> = [];
  incidenceForm: FormGroup;
  archiveList: boolean = false;
  delivery_noteList: boolean = false;
  displayArchiveList: boolean = false;
  displayDeliveryNoteList: boolean = false;

  private ReturnStatus = ReturnModel.Status;
  private ReturnStatusNames = ReturnModel.StatusNames;
  public listStatusAvailable = [];

  public requiredFields: any = {
    type: true,
    provider: true,
    warehouse: true,
    brand: true,
    returnBeforeDate: true,
    quantityPacking: false,
    shipper: false,
    pickupDate: false,
    deliveryNote: false
  };

  constructor(
    private events: Events,
    private route: ActivatedRoute,
    public router: Router,
    private pickingProvider: PickingProvider,
    private returnService: ReturnService,
    private toolbarProvider: ToolbarProvider,
    private authenticationService: AuthenticationService,
    private modalController: ModalController,
    private camera: Camera,
    private uploadService: UploadFilesService,
    private intermediaryService: IntermediaryService,
    private transfer: FileTransfer,
    private fb: FormBuilder,
    private dropFilesService: DropFilesService,
    private dateTimeParserService: DateTimeParserService,
    private printTicketService: PrintTicketService,
  ) {}

  async ngOnInit() {
    this.archiveList = false;
    this.delivery_noteList = false;
    this.archives = [];
    this.delivery_notes = [];
    let returnId = parseInt(this.route.snapshot.paramMap.get('id'));
    if (returnId) {
      this.load(returnId);
    } else {
      this.return = {
        amountPackages: 0,
        brands: [],
        dateLastStatus: String(new Date()),
        dateLimit: "",
        datePickup: "",
        datePredictedPickup: "",
        dateReturnBefore: "",
        email: "",
        history: false,
        id: 0,
        lastStatus: 1,
        observations: "",
        operatorObservations: "",
        packings: [],
        printTagPackages: false,
        provider: null,
        shipper: "",
        status: 1,
        type: null,
        unitsPrepared: 0,
        unitsSelected: 0,
        user: await this.getCurrentUser(),
        userLastStatus: await this.getCurrentUser(),
        warehouse: null,
        archives: [],
        delivery_notes: []
      };
      this.listStatusAvailable = this.ReturnStatusNames.filter(r => r.id != this.ReturnStatus.UNKNOWN);
    }

    this.dropFilesService.getImage().subscribe(resp => {
      if (resp) {
        if(resp.type=='archive') {
          this.archives.push(resp.file);
        }else{
          if(resp.type=='delivery_note') {
            this.delivery_notes.push(resp.file);
          }
        }
        if(this.archives.length > 0){
          this.openArchiveList();
        }
        if(this.delivery_notes.length > 0){
          this.openDeliveryNoteList();
        }
      }
      console.log(resp);
    });
    this.toolbarProvider.currentPage.next('Picking Devolución');
    this.toolbarProvider.optionsActions.next([]);
    this.load(parseInt(this.route.snapshot.paramMap.get('id')));

    this.events.subscribe('picking:remove', () => {
      this.load(parseInt(this.route.snapshot.paramMap.get('id')));
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('picking:remove');
  }

  initForm() {
    this.incidenceForm = this.fb.group({
      amountPackages: this.return && this.return.amountPackages ? [this.return.amountPackages] : [0],
      brands: [this.return.brands],
      dateLastStatus: [this.return.dateLastStatus],
      dateLimit: [this.return.dateLimit],
      datePickup: [this.return.datePickup],
      datePredictedPickup: [this.return.datePredictedPickup],
      dateReturnBefore: [this.return.dateReturnBefore],
      email: [this.return.email],
      history: [this.return.history],
      id: [this.return.id],
      lastStatus: [this.return.lastStatus],
      observations: [this.return.observations],
      operatorObservations: [this.return.operatorObservations],
      packings: [this.return.packings],
      printTagPackages: [this.return.printTagPackages],
      provider: [this.return.provider],
      shipper: [this.return.shipper],
      status: [this.return.status],
      type: [this.return.type],
      unitsPrepared: [this.return.unitsPrepared],
      unitsSelected: [this.return.unitsSelected],
      user: [this.return.user],
      userLastStatus: [this.return.userLastStatus],
      warehouse: [this.return.warehouse]
    });
  }

  save(){
    if (this.archives.length > 0) {
      let archives = [];
      this.archives.forEach(elem => {
        archives.push({ id: elem.id });
      });
      this.incidenceForm.addControl('archivesFileIds', new FormControl(archives));
    }
    if (this.delivery_notes.length > 0) {
      let delivery_notes = [];
      this.delivery_notes.forEach(elem => {
        delivery_notes.push({ id: elem.id });
      });
      this.incidenceForm.addControl('delivery_notesFileIds', new FormControl(delivery_notes));
    }
    let object = this.incidenceForm.value;
    this.return.archives = this.incidenceForm.value.archivesFileIds;
    this.return.delivery_notes = this.incidenceForm.value.delivery_notesFileIds;
    this.returnService.postSave(this.return).then((response: SaveResponse) => {
      if(response.code == 200){
        this.router.navigateByUrl('/return-pending-list')
      }else{
        console.error(response);
      }
    }).catch(console.error);
  }

  load(returnId: number){
    this.returnService.postLoad({returnId: returnId}).then((response: LoadResponse) => {
      if (response.code == 200) {
        this.return = response.data;
        this.pickingProvider.currentReturnPickingId = this.return.id;
        this.archives = this.return.archives || [];
        this.delivery_notes = this.return.delivery_notes || [];
        if(this.archives.length > 0){
          this.displayArchiveList = true;
        }
        if(this.delivery_notes.length > 0){
          this.displayDeliveryNoteList = true;
        }

        this.listStatusAvailable = this.ReturnStatusNames.filter(r => r.id != this.ReturnStatus.UNKNOWN);

        this.initForm();
        this.archiveList = true;
        this.delivery_noteList = true;
      } else {
        console.error(response);
      }
    }).catch(console.error);
  }

  async getCurrentUser() {
    const user: User = await this.authenticationService.getCurrentUser();
    delete user.permits;
    return user;
  }

  getStatusName(status: number): string {
    const returnItem = this.ReturnStatusNames.find(r => r.id == status);
    if (returnItem) {
      return returnItem.name;
    }

    return 'Desconocido';
  }

  getBrandNameList(brands: Brand[]): string{
    return brands.map(brand => brand.name).join('/');
  }

  getPackingNameList(returnPackings: ReturnPacking[]): string{
    return returnPackings.map(returnPacking => returnPacking.packing.reference).join('/');
  }

  async changeStatus(status: number) {
    this.return.status = status;
    this.return.lastStatus = status;
    this.return.userLastStatus = await this.authenticationService.getCurrentUser();
    this.return.dateLastStatus = String(new Date());

    switch (this.return.status) {
      case this.ReturnStatus.PREPARED:
        this.requiredFields.quantityPacking = true;
        this.requiredFields.pickupDate = false;
        this.requiredFields.shipper = false;
        this.requiredFields.deliveryNote = false;
        break;
      case this.ReturnStatus.PENDING_PICKUP:
        this.requiredFields.quantityPacking = true;
        this.requiredFields.pickupDate = true;
        this.requiredFields.shipper = true;
        this.requiredFields.deliveryNote = false;
        break;
      case this.ReturnStatus.PICKED_UP:
        this.requiredFields.quantityPacking = true;
        this.requiredFields.pickupDate = true;
        this.requiredFields.shipper = true;
        this.requiredFields.deliveryNote = true;
        break;
    }
  }

  allFieldsFilled(): boolean {
    if (this.return) {
      switch (this.return.status) {
        case this.ReturnStatus.PREPARED:
          return !!(this.return.type && this.return.warehouse && this.return.provider && this.return.brands && this.return.dateReturnBefore && this.return.amountPackages);
        case this.ReturnStatus.PICKED_UP:
          return !!(this.return.type && this.return.warehouse && this.return.provider && this.return.brands && this.return.dateReturnBefore && this.return.amountPackages && this.return.datePredictedPickup && this.return.shipper);
        case this.ReturnStatus.PENDING_PICKUP:
          return !!(this.return.type && this.return.warehouse && this.return.provider && this.return.brands && this.return.dateReturnBefore && this.return.amountPackages && this.return.datePredictedPickup && this.return.shipper && this.delivery_notes.length > 0);
        default:
          return !!(this.return.type && this.return.warehouse && this.return.provider && this.return.brands && this.return.dateReturnBefore);
      }
    } else {
      return false;
    }
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
      this.imgData = imageData;
      this.uploadImage('archive')

    }, (err) => {
      // Handle error
    });
  }
  async searchArchive() {
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
      this.imgData = imageData;
      this.uploadImage('archive')

    }, (err) => {
      // Handle error
    });
  }

  async searchDeliveryNote() {
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
      this.uploadImage('delivery_note')

    }, (err) => {
      // Handle error
    });
  }

  async uploadImage(type) {
    if (!this.imgData || this.imgData.length == 0) {
      this.intermediaryService.presentToastError('Debe seleccionar una imagen o tomar una foto')
      return
    }
    this.intermediaryService.presentLoading()
    // Destination URL
    let url = '';
    if(type == 'delivery_note'){
      url = this.apiDeliveryNotesURL;
    }else{
      url = this.apiArchivesURL;
    }
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
        this.intermediaryService.dismissLoading();
        const response: any = JSON.parse(result.response);
        this.img = response.data.file;
        if(type=='delivery_note'){
          this.delivery_notes.push(this.img);
          console.log('subido');
          if (!this.delivery_noteList) {
            this.openDeliveryNoteList();
          }
        }else{
          this.archives.push(this.img);
          console.log('subido');
          if (!this.archiveList) {
            this.openArchiveList();
          }
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

  openArchiveList() {
    this.archiveList = !this.archiveList;
  }

  openDeliveryNoteList() {
    this.delivery_noteList = !this.delivery_noteList;
  }

  async onOpenReviewModal(item) {
    const modal = await this.modalController.create({
      component: ReviewImagesComponent,
      componentProps: { imgSrc: this.baseUrlPhoto + item.pathMedium }
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

  deleteImage(item, index, arr) {
    this.intermediaryService.presentLoading()
    this.uploadService.deleteFile(item.id).subscribe(
      resp => {
        this.intermediaryService.presentToastSuccess('Archivo borrado exitosamente')
        arr.splice(index, 1);
        if (this.archives.length === 0) {
          this.openArchiveList()
        }
        if (this.delivery_notes.length === 0) {
          this.openDeliveryNoteList()
        }
      },
      err => {
        this.intermediaryService.presentToastError('Ocurrio un error al borrar el archivo')
        this.intermediaryService.dismissLoading()
      },
      () => {
        this.intermediaryService.dismissLoading()
      }
    )
  }

  showArchiveList() {
    this.displayArchiveList = !this.displayArchiveList;
  }

  showDeliveryNoteList() {
    this.displayDeliveryNoteList = !this.displayDeliveryNoteList;
  }

  public formatDate(date: string) {
    return this.dateTimeParserService.dateMonthYear(date);
  }

  public startPicking() {
    if (this.return && this.return.type && !this.return.type.defective) {
      this.returnService
        .postSearchAndAssignProducts(this.return.id)
        .subscribe((res) => {
          this.router.navigateByUrl('picking/return');
        }, (e) => {})
    } else {
      this.router.navigateByUrl('picking/return');
    }
  }

  printPackages(returnObj) {
    this.printTicketService.printPackages(returnObj);
  }
}
