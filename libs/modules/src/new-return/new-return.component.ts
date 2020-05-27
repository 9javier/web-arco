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
import Warehouse = WarehouseModel.Warehouse;
import OptionsResponse = ReturnModel.OptionsResponse;
import {ReturnTypeModel} from "../../../services/src/models/endpoints/ReturnType";
import ReturnType = ReturnTypeModel.ReturnType;
import {ProviderModel} from "../../../services/src/models/endpoints/Provider";
import Provider = ProviderModel.Provider;
import User = UserModel.User;
import {ModalController} from "@ionic/angular";
import {SelectConditionComponent} from "./select-condition/select-condition.component";
import {SupplierConditionModel} from "../../../services/src/models/endpoints/SupplierCondition";
import SupplierCondition = SupplierConditionModel.SupplierCondition;
import {SelectableListComponent} from "./modals/selectable-list/selectable-list.component";
import {DropFilesComponent} from "../drop-files/drop-files.component";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {DropFilesService} from "../../../services/src/lib/endpoint/drop-files/drop-files.service";
import { ModalReviewComponent } from '../components/modal-defective/ModalReview/modal-review.component';
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'suite-new-return',
  templateUrl: './new-return.component.html',
  styleUrls: ['./new-return.component.scss']
})
export class NewReturnComponent implements OnInit {
  private baseUrlPhoto = environment.apiBasePhoto;
  return: Return;
  types: ReturnType[];
  warehouses: Warehouse[];
  providers: Provider[];
  archives: Array<any> = [];
  delivery_notes: Array<any> = [];
  incidenceForm: FormGroup;
  archiveList: boolean = false;
  delivery_noteList: boolean = false;
  signatureList: boolean = false;
  displayArchiveList: boolean = false;
  displayDeliveryNoteList: boolean = false;
  isHistoric;

  private listItemsSelected: any[] = [];
  private itemForList: string = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private returnService: ReturnService,
    private authenticationService: AuthenticationService,
    private modalController: ModalController,
    private intermediary: IntermediaryService,
    private dropFilesService: DropFilesService,
    private uploadService: UploadFilesService,
    private fb: FormBuilder,
    private dateTimeParserService: DateTimeParserService
  ) {}

  async ngOnInit() {
    this.archiveList = false;
    this.delivery_noteList = false;
    this.archives = [];
    this.delivery_notes = [];

    this.getOptions();

    const returnId: number = parseInt(this.route.snapshot.paramMap.get('id'));
    if(this.route.snapshot.paramMap.get('isHistoric')){
      this.isHistoric = this.route.snapshot.paramMap.get('isHistoric');
    }
    if (returnId) {
      this.load(returnId);
      this.archiveList = true;
      this.delivery_noteList = true;
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
        packings: [],
        history: false,
        id: 0,
        lastStatus: 1,
        observations: "",
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

      this.archives = this.return.archives;
      this.delivery_notes = this.return.delivery_notes;
      this.displayArchiveList = false;
      this.displayDeliveryNoteList = false;
      this.initForm();

      this.archiveList = true;
      this.delivery_noteList = true;
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
          this.displayArchiveList = true;
        }
        if(this.delivery_notes.length > 0){
          this.displayDeliveryNoteList = true;
        }
      }
    });

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

  async getCurrentUser() {
    const user: User = await this.authenticationService.getCurrentUser();
    delete user.permits;
    return user;
  }

  openArchiveList() {
    this.archiveList = !this.archiveList;
  }

  openDeliveryNoteList() {
    this.archiveList = !this.archiveList;
  }

  showArchiveList() {
    this.displayArchiveList = !this.displayArchiveList;
  }

  showDeliveryNoteList() {
    this.displayDeliveryNoteList = !this.displayDeliveryNoteList;
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
    this.intermediary.presentLoading()
    this.uploadService.deleteFile(item.id).subscribe(
      resp => {
        this.intermediary.presentToastSuccess('Archivo borrado exitosamente')
        arr.splice(index, 1);
        if (this.archives.length === 0) {
          this.openArchiveList()
        }
        if (this.delivery_notes.length === 0) {
          this.openDeliveryNoteList()
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
        if(this.isHistoric){
          this.router.navigateByUrl('/returns-historic')
        }else{
          this.router.navigateByUrl('/return-tracking-list')
        }
      }else{
        console.error(response);
      }
    }).catch(console.error);
  }

  load(returnId: number){
    this.returnService.postLoad({returnId: returnId}).then((response: LoadResponse) => {
      if (response.code == 200) {
        this.return = response.data;
        this.return.provider.brands = this.providers.filter(provider => provider.id == this.return.provider.id)[0].brands;
        this.archives = this.return.archives;
        this.delivery_notes = this.return.delivery_notes;
        if(this.archives.length > 0){
          this.displayArchiveList = true;
        }
        if(this.delivery_notes.length > 0){
          this.displayDeliveryNoteList = true;
        }
        this.initForm();
      } else {
        console.error(response);
      }
    }).catch((e) => {
      console.error(e);
    });
  }

  getOptions(){
    this.returnService.getOptions().then((response: OptionsResponse) => {
      if(response.code == 200){
        this.types = response.data.types;
        this.warehouses = response.data.warehouses;
        this.providers = response.data.providers;
      }else{
        console.error(response);
      }
    }).catch(console.error);
  }

  getStatusName(status: number): string{
    switch(status){
      case 0:
        return '';
      case 1:
        return 'Orden devolución';
      case 2:
        return 'Pendiente';
      case 3:
        return 'En proceso';
      case 4:
        return 'Preparado';
      case 5:
        return 'Pendiente recogida';
      case 6:
        return 'Recogido';
      case 7:
        return 'Facturado';
      default:
        return 'Desconocido'
    }
  }

  getBrandNameList(brands: Brand[]): string{
    return brands.map(brand => brand.name).join('/');
  }

  async changeStatus(status: number) {
    this.return.status = status;
    this.return.lastStatus = status;
    this.return.userLastStatus = await this.authenticationService.getCurrentUser();
    this.return.dateLastStatus = String(new Date());
  }

  allFieldsFilled(): boolean{
    return !!(this.return && this.return.type && this.return.warehouse && this.return.provider && this.return.brands && this.return.dateReturnBefore);
  }

  thereAreConditions(): boolean{
    if(this.return.provider){
      return this.return.provider.brands.filter(brand => brand.condition != null).length > 0;
    }else{
      return false;
    }
  }

  async selectCondition() {
    const modal = await this.modalController.create({
      component: SelectConditionComponent,
      componentProps: {
        provider: this.return.provider
      }
    });

    modal.onDidDismiss().then(response => {
      if (response.data) {
        const condition: SupplierCondition = response.data;
        this.return.email = condition.contact;
        this.return.observations = condition.observations;
      }
    });

    await modal.present();
  }

  public async openShowSelectableList(type: number) {
    switch (type) {
      case 1:
        this.listItemsSelected = this.types.map(v => {
          return {id: v.id, value: v.name}
        });
        this.itemForList = 'Tipo';
        break;
      case 2:
        this.listItemsSelected = this.warehouses.map(v => {
          return {id: v.id, value: `${v.reference} - ${v.name}`}
        });
        this.itemForList = 'Almacén';
        break;
      case 3:
        this.listItemsSelected = this.providers.map(v => {
          return {id: v.id, value: v.name}
        });
        this.itemForList = 'Proveedor';
        break;
    }

    const modal = await this.modalController.create({
      component: SelectableListComponent,
      componentProps: { listItemsSelected: this.listItemsSelected, itemForList: this.itemForList }
    });
    modal.onDidDismiss().then(result => {
      if (result && result.data != null) {
        switch (type) {
          case 1:
            this.return.type = this.types.find(v => v.id == result.data);
            break;
          case 2:
            this.return.warehouse = this.warehouses.find(v => v.id == result.data);
            break;
          case 3:
            this.return.provider = this.providers.find(v => v.id == result.data);
            break;
        }
      }
    });
    await modal.present();
  }

  public selectUnitiesItems() {
    let isDefective = false;
    if (this.return.type && this.return.type.defective) {
      isDefective = true;
    }

    const warehouseId = this.return.warehouse.id;
    const providerId = this.return.provider && this.return.provider.id;
    const brandIds = this.return.brands.map(b => b.id).join(',');

    this.router.navigate(['new-return', 'unities', this.return.id], { queryParams: {defective: isDefective, warehouse: warehouseId, provider: providerId, brands: brandIds} });
  }

  async searchArchive() {
    const modal = await this.modalController.create({
      component: DropFilesComponent,
      componentProps: {type: 'archive'}
    });
    await modal.present();
  }

  async searchDelivery_note() {
    const modal = await this.modalController.create({
      component: DropFilesComponent,
      componentProps: {type: 'delivery_note'}
    });
    await modal.present();
  }

  public formatDate(date: string) {
    return this.dateTimeParserService.dateMonthYear(date);
  }
}
