import { IntermediaryService } from './../../../services/src/lib/endpoint/intermediary/intermediary.service';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SupplierConditionsService } from '../../../services/src/lib/endpoint/supplier-conditions/supplier-conditions.service';
import { SupplierConditionModel } from '../../../services/src/models/endpoints/SupplierCondition';
import SupplierCondition = SupplierConditionModel.SupplierCondition;
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import {PaginatorComponent} from '../components/paginator/paginator.component';
import * as _ from 'lodash';
import {validators} from "../utils/validators";
import { of } from 'rxjs';
import * as Filesave from 'file-saver';
import { catchError } from 'rxjs/operators';
import { SupplierConditionDetailsComponent } from './modals/supplier-condition-details/supplier-condition-details.component';
import { SupplierConditionAddComponent } from './modals/supplier-condition-add/supplier-condition-add.component';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'suite-supplier-conditions',
  templateUrl: './supplier-conditions.component.html',
  styleUrls: ['./supplier-conditions.component.scss'],
})
export class SupplierConditionsComponent implements OnInit {

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  displayedColumns: string[] = ['select','providers','brands','noClaim','contacts','observations'];
  dataSourceOriginal;
  dataSource;
  selectionSupplierCondition = new SelectionModel<SupplierCondition>(true, []);
  selectionReserved = new SelectionModel<SupplierCondition>(true, []);

  columns = {};

  @ViewChild('filterButtonBrands') filterButtonBrands: FilterButtonComponent;
  @ViewChild('filterButtonProviders') filterButtonProviders: FilterButtonComponent;
  @ViewChild('filterButtonNoClaim') filterButtonNoClaim: FilterButtonComponent;
  @ViewChild('filterButtonContacts') filterButtonContacts: FilterButtonComponent;
  @ViewChild('filterButtonObservations') filterButtonObservations: FilterButtonComponent;


  isFilteringBrands: number = 0;
  isFilteringProviders: number = 0;
  isFilteringNoClaim: number = 0;
  isFilteringContacts: number = 0;

  /**Filters */
  brands: Array<TagsInputOption> = [];
  providers: Array<TagsInputOption> = [];
  noClaim: Array<TagsInputOption> = [];
  contacts: Array<TagsInputOption> = [];
  orderby: Array<TagsInputOption> = [];

  /** Filters save **/
  brandsSelected: Array<any> = [];
  providersSelected: Array<any> = [];
  noClaimSelected: Array<any> = [];
  contactsSelected: Array<any> = [];
  orderbySelected: Array<any> = [];

  groups: Array<TagsInputOption> = [];
  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  /**List of SearchInContainer */
  supplierConditions: Array<SupplierConditionModel.Results> = [];

  itemsIdSelected: Array<any> = [];
  itemsReferenceSelected: Array<any> = [];
  previousReferencePattern = '';
  /**timeout for send request */
  requestTimeout;
  //For sorting
  lastOrder = [true, true, true, true];
  hasDeleteSupplierCondition = false;
  selectProviders;

  pagerValues = [10, 50, 100];
  form: FormGroup = this.formBuilder.group({
    brand: [],
    provider:[],
    noClaim: [],
    contact: [],
    observations: [],
    referencePattern: [],
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: 1,
      order: "asc"
    })
  });

  /**form to select elements to print or for anything */
  selectedForm: FormGroup = this.formBuilder.group({}, {
    validators: validators.haveItems("toSelect")
  });

  length: any;

  constructor(
    private supplierConditionsService: SupplierConditionsService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private intermediaryService:IntermediaryService,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.initEntity();
    this.initForm();
    this.getFilters();
    /*this.getProviders();*/
    this.getColumns(this.form);
    this.getList(this.form);
    this.listenChanges();
  }

  listenChanges(): void {
    let previousPageSize = this.form.value.pagination.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      this.saveFilters();
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.form.get("pagination").patchValue({
        limit: page.pageSize,
        page: flag ? page.pageIndex : 1
      });
      this.recoverFilters();
      this.getList(this.form);
    });

    /**detect changes in the form */
    this.form.statusChanges.subscribe(change => {
      if (this.pauseListenFormChange) return;
      ///**format the reference */
      /**cant send a request in every keypress of reference, then cancel the previous request */
      clearTimeout(this.requestTimeout);
      /**it the change of the form is in reference launch new timeout with request in it */
      if (this.form.value.referencePattern != this.previousReferencePattern) {
        /**Just need check the vality if the change happens in the reference */
        if (this.form.valid)
          this.requestTimeout = setTimeout(() => {
            this.getList(this.sanitize(this.getFormValueCopy()));
          }, 1000);
      } else {
        /**reset the paginator to the 0 page */
        this.getList(this.sanitize(this.getFormValueCopy()));
      }
      /**assign the current reference to the previous reference */
      this.previousReferencePattern = this.form.value.referencePattern;
    });
  }

  initEntity() {
    this.entities = {
      brand: [],
      provider:[],
      noClaim: [],
      contact: [],
      observations: [],
      referencePattern: []
    }
  }
  initForm() {
    this.form.patchValue({
      brand: [],
      provider:[],
      noClaim: [],
      contact: [],
      observations: [],
      referencePattern: [],
      pagination: this.formBuilder.group({
        page: 1,
        limit: this.pagerValues[0]
      }),
    })
  }

  isAllSelectedSupplierCondition() {
    if (this.dataSource) {
      const numSelected = this.selectionSupplierCondition.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    return false
  }

  SupplierConditionToggle() {
    if (this.isAllSelectedSupplierCondition()) {
      this.dataSource.data.forEach(row => {
        row.distribution = false;
      });

      this.selectionSupplierCondition.clear()
    } else {
      this.dataSource.data.forEach(row => {
        row.distribution = true;
        this.selectionSupplierCondition.select(row);
      });
    }
  }

  checkboxLabelSupplierCondition(row?): string {
    if (!row) {
      return `${this.isAllSelectedSupplierCondition() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionSupplierCondition.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  changeSupplierCondition(row, position: number) {
    this.dataSource.data[position].distribution = !this.dataSource.data[position].distribution;
  }

  getFilters() {
    this.supplierConditionsService.entities().subscribe(entities => {
      this.brands = this.updateFilterSource(entities.brands, 'brand');
      this.providers = this.updateFilterSource(entities.providers, 'provider');
      this.noClaim = this.updateFilterSource(entities.noClaim, 'noClaim');
      this.contacts = this.updateFilterSource(entities.contacts, 'contact');

      this.reduceFilters(entities);
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
      }, 0);
    })
  }

  async getList(form?: FormGroup){
    this.supplierConditionsService.index(form.value).subscribe(
      (resp:any) => {
        this.dataSource = new MatTableDataSource<SupplierConditionModel.SupplierCondition>(resp.results);
        const paginator = resp.pagination;
        this.paginator.cantSelect = paginator.limit;
        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.selectPage;
        this.paginator.lastPage = paginator.lastPage;
        this.supplierConditions = resp.results;
        this.initSelectForm();

        this.selectionSupplierCondition.clear();
        this.selectionReserved.clear();
        this.dataSource.data.forEach(row => {
          if (row.distribution) {
            this.selectionSupplierCondition.select(row);
          }
          if (row.reserved) {
             this.selectionReserved.select(row);
          }
          this.dataSourceOriginal = _.cloneDeep(this.dataSource)
        });
      },
      async err => {
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.dismissLoading()
      }
    )
  }

  static showArrow(colNumber, dirDown) {
    let htmlColumn = document.getElementsByClassName('title')[colNumber] as HTMLElement;
    if (dirDown) htmlColumn.innerHTML += ' 🡇';
    else htmlColumn.innerHTML += ' 🡅';
  }

  static deleteArrow() {
    for (let i = 0; i < document.getElementsByClassName('title').length; i++) {
      let iColumn = document.getElementsByClassName('title')[i] as HTMLElement;
      if (iColumn.innerHTML.includes('🡇') || iColumn.innerHTML.includes('🡅')) {
        iColumn.innerHTML = iColumn.innerHTML.slice(0, -2);
      }
    }
  }

  async applyFilters(filtersResult, filterType) {
    await this.intermediaryService.presentLoading();
    const filters = filtersResult.filters;
    switch (filterType) {
      case 'providers':
        let providersFiltered: number[] = [];
        for (let provider of filters) {
          if (provider.checked) providersFiltered.push(provider.id);
        }
        if (providersFiltered.length >= this.providers.length) {
          this.form.value.provider = [];
          this.isFilteringProviders = this.providers.length;
        } else {
          if (providersFiltered.length > 0) {
            this.form.value.provider = providersFiltered;
            this.isFilteringProviders = providersFiltered.length;
          } else {
            this.form.value.provider = [99999];
            this.isFilteringProviders = this.providers.length;
          }
        }
        break;
      case 'brands':
        let brandsFiltered: number[] = [];
        for (let brand of filters) {
          if (brand.checked) brandsFiltered.push(brand.id);
        }
        if (brandsFiltered.length >= this.brands.length) {
          this.form.value.brand = [];
          this.isFilteringBrands = this.brands.length;
        } else {
          if (brandsFiltered.length > 0) {
            this.form.value.brand = brandsFiltered;
            this.isFilteringBrands = brandsFiltered.length;
          } else {
            this.form.value.brand = [99999];
            this.isFilteringBrands = this.brands.length;
          }
        }
        break;
      case 'noClaim':
        let noClaimFiltered: string[] = [];
        for (let noClaim of filters) {

          if (noClaim.checked) noClaimFiltered.push(noClaim.id);
        }

        if (noClaimFiltered.length >= this.noClaim.length) {
          this.form.value.noClaim = [];
          this.isFilteringNoClaim = this.noClaim.length;
        } else {
          if (noClaimFiltered.length > 0) {
            this.form.value.noClaim = noClaimFiltered;
            this.isFilteringNoClaim = noClaimFiltered.length;
          } else {
            this.form.value.noClaim = ['99999'];
            this.isFilteringNoClaim = this.noClaim.length;
          }
        }
        break;
      case 'contacts':
        let contactsFiltered: string[] = [];
        for (let contacts of filters) {

          if (contacts.checked) contactsFiltered.push(contacts.id);
        }

        if (contactsFiltered.length >= this.contacts.length) {
          this.form.value.contact = [];
          this.isFilteringContacts = this.contacts.length;
        } else {
          if (contactsFiltered.length > 0) {
            this.form.value.contact = contactsFiltered;
            this.isFilteringContacts = contactsFiltered.length;
          } else {
            this.form.value.contact = [99999];
            this.isFilteringContacts = this.contacts.length;
          }
        }
        break;
    }
    this.lastUsedFilter = filterType;
    this.getList(this.form);
  }

  private reduceFilters(entities){
    this.filterButtonBrands.listItems = this.reduceFilterEntities(this.brands, entities,'brands');
    this.filterButtonProviders.listItems = this.reduceFilterEntities(this.providers, entities,'providers');
    this.filterButtonNoClaim.listItems = this.reduceFilterEntities(this.noClaim, entities,'noClaim');
    this.filterButtonContacts.listItems = this.reduceFilterEntities(this.contacts, entities,'contacts');
  }

  private saveFilters(){
    this.brandsSelected = this.form.value.brand;
    this.providersSelected = this.form.value.provider;
    this.noClaimSelected = this.form.value.noClaim;
    this.contactsSelected = this.form.value.contact;
    this.orderbySelected = this.form.value.orderby;
  }

  private recoverFilters(){
    this.form.get("brand").patchValue(this.brandsSelected, { emitEvent: false });
    this.form.get("provider").patchValue(this.providersSelected, { emitEvent: false });
    this.form.get("noClaim").patchValue(this.noClaimSelected, { emitEvent: false });
    this.form.get("orderby").patchValue(this.orderbySelected, { emitEvent: false });
    this.form.get("contact").patchValue(this.contactsSelected, { emitEvent: false });
  }

  sanitize(object) {
    /**mejorable */
    object = JSON.parse(JSON.stringify(object));
    if (!object.orderby.type) {
      delete object.orderby.type;
    } else {
      object.orderby.type = parseInt(object.orderby.type);
    }
    if (!object.orderby.order) delete object.orderby.order;
    Object.keys(object).forEach(key => {
      if (object[key] instanceof Array) {
        if (object[key][0] instanceof Array) {
          object[key] = object[key][0];
        } else {
          for (let i = 0; i < object[key].length; i++) {
            if (object[key][i] === null || object[key][i] === "") {
              object[key].splice(i, 1);
            }
          }
        }
      }
      if (object[key] === null || object[key] === "") {
        delete object[key];
      }
    });
    return object;
  }

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  private reduceFilterEntities(arrayEntity: any[], entities: any, entityName: string) {
    if (this.lastUsedFilter !== entityName) {
      let filteredEntity = entities[entityName] as unknown as string[];

      arrayEntity.forEach((item) => {
        item.hide = filteredEntity.includes(item.value);
      });
    }

    return arrayEntity;
  }

  private updateFilterSource(dataEntity: FiltersModel.Default[], entityName: string) {
    let resultEntity;

    this.pauseListenFormChange = true;
    let dataValue = this.form.get(entityName).value;
    resultEntity = dataEntity.map(entity => {
      entity.id = <number>(<unknown>entity.id);
      entity.name = entity.name;
      entity.value = entity.name;
      entity.checked = true;
      entity.hide = false;
      return entity;
    });

    if (dataValue && dataValue.length) {
      this.form.get(entityName).patchValue(dataValue, { emitEvent: false });
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);

    return resultEntity;
  }

  async getColumns(form?: FormGroup){
    // await this.intermediaryService.presentLoading();
    this.supplierConditionsService.index(form.value).subscribe(
      (resp:any) => {
        resp.filters.forEach((element) => {
          this.columns[element.name] = element.id;
        });
      },
      async err => {
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.dismissLoading()
      }
    )
  }

/*  getProviders(){
    this.supplierConditionsService.getProviders(true).subscribe(providers => {
      this.selectProviders = providers;
    });
  }*/

  prevent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  async addSupplierConditions(event) {
    event.stopPropagation();
    event.preventDefault();
    this.intermediaryService.presentLoading('', (async() => {
      let modal = (await this.modalController.create({
        component: SupplierConditionAddComponent
        /*      componentProps: {
                selectProviders: this.selectProviders
              }*/
      }));

      modal.onDidDismiss().then(() => {
        this.refreshSupplierConditions();
      });

      await modal.present();
    }));
  }

  async updateSupplierConditions(event, supplierCondition: SupplierConditionModel.Results) {
    event.stopPropagation();
    event.preventDefault();
    this.intermediaryService.presentLoading('', (async() => {
      let modal = (await this.modalController.create({
        component: SupplierConditionDetailsComponent,
        componentProps: {
          supplierCondition: supplierCondition
          //selectProviders: this.selectProviders
        }
      }));

      modal.onDidDismiss().then(() => {
        this.refreshSupplierConditions();
      });

      await modal.present();
    }));
  }

  async deleteSupplierConditions() {
    let ids = this.selectedForm.value.toSelect.map((element, i) =>
      element ? this.supplierConditions[i].id : false)
      .filter(element => element);

    await this.intermediaryService.presentLoading('Borrando condiciones de proveedores');
    this.supplierConditionsService.delete(ids).subscribe(async result => {
      this.refreshSupplierConditions();
      await this.intermediaryService.dismissLoading();
    }, async error => {
      await this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError('Ha ocurrido un error el cargar los datos del sevidor')
    });
  }

  async presentAlertDeleteConfirm() {
    const alert = await this.alertController.create({
      header: '¡Confirmar eliminación!',
      message: '¿Deseas eliminar las condiciones de proveedor seleccionadoas?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.initSelectForm();
          }
        }, {
          text: 'Si',
          handler: async () => {
            await this.deleteSupplierConditions();
          }
        }
      ]
    });

    await alert.present();
  }

  refreshSupplierConditions() {
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getList(this.form);
    this.listenChanges();
  }

  sort(column: string) {
    for (let i = 0; i < document.getElementsByClassName('title').length; i++) {
      let iColumn = document.getElementsByClassName('title')[i] as HTMLElement;
      if (iColumn.innerHTML.includes('🡇') || iColumn.innerHTML.includes('🡅')) {
        iColumn.innerHTML = iColumn.innerHTML.slice(0, -2);
      }
    }

    switch (column) {
      case 'provider': {
        if (this.lastOrder[0]) {
          this.form.value.orderby = { order: "desc", type: 1 };
          SupplierConditionsComponent.showArrow(0, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 1 };
          SupplierConditionsComponent.showArrow(0, true);
        }
        this.lastOrder[0] = !this.lastOrder[0];
        break;
      }
      case 'brand': {
        if (this.lastOrder[1]) {
          this.form.value.orderby = { order: "desc", type: 2 };
          SupplierConditionsComponent.showArrow(1, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 2 };
          SupplierConditionsComponent.showArrow(1, true);
        }
        this.lastOrder[1] = !this.lastOrder[1];
        break;
      }
      case 'noClaim': {
        if (this.lastOrder[2]) {
          this.form.value.orderby = { order: "desc", type: 3 };
          SupplierConditionsComponent.showArrow(2, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 3 };
          SupplierConditionsComponent.showArrow(2, true);
        }
        this.lastOrder[2] = !this.lastOrder[2];
        break;
      }
      case 'contact': {
        if (this.lastOrder[3]) {
          this.form.value.orderby = { order: "desc", type: 4 };
          SupplierConditionsComponent.showArrow(3, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 4 };
          SupplierConditionsComponent.showArrow(3, true);
        }
        this.lastOrder[3] = !this.lastOrder[3];
        break;
      }
    }
    this.getList(this.form);
  }

  // TODO METODO LLAMAR ARCHIVO EXCELL
  /**
   * @description Eviar parametros y recibe un archivo excell
   */
  async fileExcell() {
    this.intermediaryService.presentLoading('Descargando Archivo Excel');
    const formToExcel = this.getFormValueCopy();
    if (formToExcel.pagination) {
      formToExcel.pagination.page = 1;
      formToExcel.pagination.limit = 0;
    }
    this.supplierConditionsService.getFileExcell(this.sanitize(formToExcel)).pipe(
      catchError(error => of(error)),
      // map(file => file.error.text)
    ).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      Filesave.saveAs(blob, `${Date.now()}.xlsx`);
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess('Archivo descargado')
    }, error => console.log(error));
  }

  initSelectForm(): void {
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect", this.formBuilder.array(this.supplierConditions.map(element => new FormControl(false))));
  }

  selectAll(event): void {
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control => {
      control.setValue(value);
    });

    if (value) {
      this.itemsIdSelected = this.supplierConditions;
    } else {
      this.itemsIdSelected = [];
    }
  }

  itemSelected(product) {
    const index = this.itemsIdSelected.indexOf(product, 0);
    if (index > -1) {
      this.itemsIdSelected.splice(index, 1);
    } else {
      this.itemsIdSelected.push(product);
    }
  }
}
