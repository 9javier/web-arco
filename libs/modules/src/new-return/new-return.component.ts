import {Component, OnInit, ViewChild} from '@angular/core';
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
import {AlertController, ModalController} from "@ionic/angular";
import {SelectConditionComponent} from "./select-condition/select-condition.component";
import {SupplierConditionModel} from "../../../services/src/models/endpoints/SupplierCondition";
import SupplierCondition = SupplierConditionModel.SupplierCondition;
import {SelectableListComponent} from "./modals/selectable-list/selectable-list.component";
import {DropFilesComponent} from "../drop-files/drop-files.component";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {DropFilesService} from "../../../services/src/lib/endpoint/drop-files/drop-files.service";
import { ModalReviewComponent } from '../components/modal-defective/ModalReview/modal-review.component';
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import JsPdf from "jspdf";
import 'jspdf-autotable';
import {TimesToastType} from "../../../services/src/models/timesToastType";
import {ProductsComponent} from "../new-return-unities/products/products.component";
import {DefectiveProductsComponent} from "../new-return-unities/defective-products/defective-products.component";
import {PositionsToast} from "../../../services/src/models/positionsToast.type";
import {AvailableItemsGroupedComponent} from "./modals/avaiable-items-grouped/available-items-grouped.component";

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
  includePhotos: boolean;

  private listItemsSelected: any[] = [];
  private itemForList: string = null;

  public ReturnStatus = ReturnModel.Status;
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

  productsByBrand;

  public availableUnities: ReturnModel.AvailableProductsGrouped[]|ReturnModel.AssignedProductsGrouped[] = null;
  public assignedItems: boolean = false;

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
    private alertController: AlertController,
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
        operatorObservations: "",
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
        delivery_notes: [],
        products: []
      };

      this.listStatusAvailable = this.ReturnStatusNames.filter(r => r.id != this.ReturnStatus.UNKNOWN);

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
        warehouse: [this.return.warehouse],
        products: [this.return.products]
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

  async save(customLoadingMsg: string, showToast: boolean = true) {
    await this.intermediary.presentLoadingNew(customLoadingMsg || 'Guardando devolución...');

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

    this.return.archives = this.incidenceForm.value.archivesFileIds ? this.incidenceForm.value.archivesFileIds : [];
    this.return.delivery_notes = this.incidenceForm.value.delivery_notesFileIds ? this.incidenceForm.value.delivery_notesFileIds : [];

    if(this.return.brands){
      for (let brand of this.return.brands) {
        if(brand.name) delete brand.name;
        if(brand.condition) delete brand.condition;
      }
    }
    if(this.return.provider && this.return.provider.brands){
      for (let pbrand of this.return.provider.brands) {
        if(pbrand.name) delete pbrand.name;
        if(pbrand.condition) delete pbrand.condition;
      }
    }

    this.returnService.postSave(this.return).then((response: SaveResponse) => {
      this.intermediary.dismissLoadingNew();
      if (response.code == 200) {
        this.return.id = response.data.id;
        if (showToast) this.intermediary.presentToastSuccess('Devolución guardada', TimesToastType.DURATION_SUCCESS_TOAST_3750);
      } else {
        console.error(response);
      }
    }).catch((e) => {
      console.error(e);
      this.intermediary.dismissLoadingNew();
    });
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

        switch (this.return.status) {
          case this.ReturnStatus.IN_PROCESS:
          case this.ReturnStatus.PREPARED:
          case this.ReturnStatus.PENDING_PICKUP:
          case this.ReturnStatus.PICKED_UP:
          case this.ReturnStatus.BILLED:
            this.listStatusAvailable = this.ReturnStatusNames.filter(r => r.id > this.return.status && r.id != this.ReturnStatus.UNKNOWN);
            break;
          default:
            this.listStatusAvailable = this.ReturnStatusNames.filter(r => r.id != this.ReturnStatus.UNKNOWN);
        }

        this.initForm();

        this.returnService
          .getGetAssignedProductsGrouped(this.return.id)
          .subscribe(res => {
            if (res.code == 200 && res.data.items && res.data.items.length > 0) {
              this.availableUnities = res.data.items;
              this.assignedItems = true;
            }
          });
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

  allFieldsFilled(): boolean{
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
            this.preloadOfAvailabilities();
            break;
          case 2:
            this.return.warehouse = this.warehouses.find(v => v.id == result.data);
            this.preloadOfAvailabilities();
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

    this.returnService
      .postCheckProductsToAssignReturn({
        returnId: this.return.id,
        provider: providerId,
        warehouse: warehouseId,
        brands: this.return.brands.map(b => b.id),
        defective: isDefective
      })
      .subscribe((res) => {
        if (res.code == 200 && res.data.available_products) {
          this.router.navigate(['new-return', 'unities', this.return.id], { queryParams: {defective: isDefective, warehouse: warehouseId, provider: providerId, brands: brandIds} });
        } else {
          this.intermediary.presentWarning('No hay unidades disponibles para asignar a la devolución.', null);
        }
      }, (e) => {
        this.intermediary.presentToastError('Ha ocurrido un error al intentar comprobar si hay unidades disponibles que asignar.', PositionsToast.TOP, TimesToastType.DURATION_ERROR_TOAST);
      });

  }

  async searchArchive() {
    const modal = await this.modalController.create({
      component: DropFilesComponent,
      componentProps: {type: 'archive', images: this.archives }
    });
    await modal.present();
  }

  async searchDelivery_note() {
    const modal = await this.modalController.create({
      component: DropFilesComponent,
      componentProps: {type: 'delivery_note', images: this.delivery_notes, showSaveButton: true }
    });

    modal.onDidDismiss().then(data => {
      if (data && data.data.save) {
        this.save('Asociando recursos...', false);
      }
    });

    await modal.present();
  }

  public formatDate(date: string) {
    return this.dateTimeParserService.dateMonthYear(date);
  }

  public getCountProductsScanned(productsList: any[]) {
    return productsList.filter(p => p.status == 2).length;
  }

  public getPackingNames(packingList: ReturnModel.ReturnPacking[]) {
    return packingList.map(p => p.packing.reference).join(', ');
  }

  private preloadOfAvailabilities() {
    if (this.return && !this.return.id) {
      if (this.return.type && this.return.warehouse) {
        this.returnService
          .postGetAvailableProductsGrouped({
            warehouse: this.return.warehouse.id,
            defective: this.return.type.defective
          })
          .subscribe(res => {
            if (res.code == 200 && res.data.available_products && res.data.available_products.length > 0) {
              this.availableUnities = res.data.available_products;
            } else {
              this.availableUnities = null;
            }
          }, error => this.availableUnities = null);
      } else {
        this.availableUnities = null;
      }
    }
  }

  public async showAvailableUnities() {
    const modal = await this.modalController.create({
      component: AvailableItemsGroupedComponent,
      componentProps: {listUnitiesGrouped: this.availableUnities, assigned: this.assignedItems}
    });

    await modal.present();
  }

  async deliveryNote(){
    const alert = await this.alertController.create({
      header: 'Incluir Fotos',
      message: '¿Desea incluir las fotos?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.includePhotos = true;
            this.pureJsPdf();
          }
        }, {
          text: 'No',
          handler: () => {
            this.includePhotos = false;
            this.pureJsPdf();
          }
        }
      ]
    });
    await alert.present();
  }

  async pureJsPdf() {
    let doc = new JsPdf();
    let currentHeight: number = 20;
    let currentWidth: number = 15;
    let imageRows: boolean[] = [];

    //Title
    doc.setFontSize(20);
    doc.text(`Albarán de Devolución - ${this.return.provider.name}`, currentWidth, currentHeight);
    currentHeight += 10;
    doc.setFontSize(18);
    let datePickupFormatted = this.return.datePickup ? this.formatDate(this.return.datePickup) : '';
    doc.text(`Almacén: ${this.return.warehouse.reference} ${this.return.warehouse.name}`, currentWidth, currentHeight);
    currentHeight += 10;
    doc.text(`Transportista: ${this.return.shipper}`, currentWidth, currentHeight);
    currentHeight += 10;
    doc.text(`Bultos: ${this.return.amountPackages}`, currentWidth, currentHeight);
    currentHeight += 10;
    doc.text(`Fecha recogida: ${datePickupFormatted}`, currentWidth, currentHeight);
    currentHeight += 10;

    //Table
    let head: string[][];
    let body: string[][];
    if (this.return.type.defective) {
      head = [['Artículo', 'Talla', 'Unidades', 'Motivo Defecto']];
      if (this.includePhotos) {
        body = (() => {
          let result: string[][] = [];
          for (let product of this.return.products) {
            const defects: string[] = [];
            if (product.defect.defectTypeParent && product.defect.defectTypeParent.includeInDeliveryNote) {
              defects.push(product.defect.defectTypeParent.name);
            }
            if (product.defect.defectTypeChild && product.defect.defectTypeChild.includeInDeliveryNote) {
              defects.push(product.defect.defectTypeChild.name);
            }
            if (product.defect.defectZoneParent && product.defect.defectZoneParent.includeInDeliveryNote) {
              defects.push(product.defect.defectZoneParent.name);
            }
            if (product.defect.defectZoneChild && product.defect.defectZoneChild.includeInDeliveryNote) {
              defects.push(product.defect.defectZoneChild.name);
            }
            let data = [
              product.model.reference,
              product.size.name,
              '1',
              defects.join('/')
            ];
            result.push(data);
            if (product.defect.photos.length > 0) {
              result.push(['', '', '', '']);
              result.push(['', '', '', '']);
              result.push(['', '', '', '']);
              imageRows.push(true);
            } else {
              imageRows.push(false);
            }
          }
          return result;
        })();
      } else {
        body = (() => {
          let result: string[][] = [];
          for (let product of this.return.products) {
            const defects: string[] = [];
            if (product.defect.defectTypeParent && product.defect.defectTypeParent.includeInDeliveryNote) {
              defects.push(product.defect.defectTypeParent.name);
            }
            if (product.defect.defectTypeChild && product.defect.defectTypeChild.includeInDeliveryNote) {
              defects.push(product.defect.defectTypeChild.name);
            }
            if (product.defect.defectZoneParent && product.defect.defectZoneParent.includeInDeliveryNote) {
              defects.push(product.defect.defectZoneParent.name);
            }
            if (product.defect.defectZoneChild && product.defect.defectZoneChild.includeInDeliveryNote) {
              defects.push(product.defect.defectZoneChild.name);
            }
            let data = [
              product.model.reference,
              product.size.name,
              '1',
              defects.join('/')
            ];
            result.push(data);
            imageRows.push(false);
          }
          return result;
        })();
      }
    } else {
      head = [['Artículo', 'Talla', 'Unidades']];
      body = (() => {
        let result: string[][] = [];
        const modelIds = this.return.products.map(prod => prod.model.id).filter((elem, index, self) => {
          return index === self.indexOf(elem);
        });
        for (let modelId of modelIds) {
          const sizeIds = this.return.products.filter(prod => prod.model.id == modelId).map(prod => prod.size.id).filter((elem, index, self) => {
            return index === self.indexOf(elem);
          });
          for (let sizeId of sizeIds) {
            const products = this.return.products.filter(prod => prod.model.id == modelId && prod.size.id == sizeId);
            let data = [
              products[0].model.reference,
              products[0].size.name,
              products.length.toString()
            ];
            result.push(data);
            imageRows.push(false);
          }
        }
        return result;
      })();
    }
    doc.autoTable({startY: currentHeight, head: head, body: body, styles: {halign: 'center', fontSize: 15}});
    currentHeight += 10;

    //Table images
    if (this.includePhotos) {
      for (let row = 0; row < imageRows.length; row++) {
        currentHeight += 10;
        if (imageRows[row]) {
          currentHeight -= 2;
          let counter: number = 0;
          for (let photo of this.return.products[row].defect.photos) {
            if (counter == 3) {
              break;
            }
            let img: any = await this.getMeta(this.baseUrlPhoto + photo.pathMedium);
            let dimensions: { width: number, height: number } = NewReturnComponent.checkImageAndResize(img.naturalWidth, img.naturalHeight);
            doc.addImage(img, "PNG", currentWidth + (61 * counter), currentHeight, dimensions.width, dimensions.height);
            counter++;
          }
          currentHeight += 32;
        }
      }
      currentHeight += 5;
    } else {
      currentHeight += (10 * body.length) + 5;
    }

    //Images
    if (this.includePhotos) {
      doc.setFontSize(16);
      doc.text(`Fotos`, currentWidth, currentHeight);
      currentHeight += 5;
      let counter: number = 0;
      for (let photo of this.return.archives) {
        if (counter == 3) {
          counter = 0;
          currentHeight += 32;
        }
        let img: any = await this.getMeta(this.baseUrlPhoto + photo.pathMedium);
        let dimensions: { width: number, height: number } = NewReturnComponent.checkImageAndResize(img.naturalWidth, img.naturalHeight);
        doc.addImage(img, "PNG", currentWidth + (61 * counter), currentHeight, dimensions.width, dimensions.height);
        counter++;
      }
    }

    doc.save('albaran.pdf');
  }

  getMeta(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  static checkImageAndResize(width: number, height: number): {width: number, height: number}{
    let ratio: number;
    if( (width/height) == 2 ){
      ratio = 58/width;
    }else{
      if( (width/height) > 2 ){
        ratio = 58/width;
      }else{
        ratio = 29/height;
      }
    }
    return {width: width*ratio, height: height*ratio};
  }
}
