import { Component, OnInit, ViewChild } from '@angular/core';
import { COLLECTIONS } from 'config/base';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import {
  CarrierService,
  WarehouseModel,
  IntermediaryService,
  UsersService,
  FiltersService,
  TypesService, WarehousesService, ProductsService, FiltersModel, InventoryModel
} from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { WarehouseService } from 'libs/services/src/lib/endpoint/warehouse/warehouse.service';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UpdateComponent } from './update/update.component';
import { StoreComponent } from './store/store.component';
import { SendPackingComponent } from './send-packing/send-packing.component';
import { ShowDestinationsComponent } from './show-destionations/show-destinations.component';
import { AddDestinyComponent } from './add-destiny/add-destiny.component';
import { MultipleDestinationsComponent } from './multiple-destinations/multiple-destinations.component';
import { HistoryModalComponent } from './history-modal/history-modal.component';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import * as Filesave from 'file-saver';
import { validators } from '../utils/validators';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { FilterButtonComponent } from "../components/filter-button/filter-button.component";
import { catchError } from 'rxjs/operators';
import { PermissionsService } from '../../../services/src/lib/endpoint/permissions/permissions.service';

export interface CallToService{
  pagination:any,
  orderby:any,
  filters:any
}

@Component({
  selector: 'app-jail',
  templateUrl: './jail.component.html',
  styleUrls: ['./jail.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class JailComponent implements OnInit {

  pagerValues = [20, 50, 100];

  /**timeout for send request */
  requestTimeout;

  /**previous reference to detect changes */
  previousProductReferencePattern = '';
  pauseListenFormChange = false;
  permision:boolean;

  /**List of SearchInContainer */
  results: Array<CarrierModel.SearchInContainer> = [];
  allResults: Array<CarrierModel.SearchInContainer> = [];

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild('filterButtonReferences') filterButtonReferences: FilterButtonComponent;
  @ViewChild('filterButtonTypes') filterButtonTypes: FilterButtonComponent;
  @ViewChild('filterButtonOrigins') filterButtonOrigins: FilterButtonComponent;
  @ViewChild('filterButtonDestinies') filterButtonDestinies: FilterButtonComponent;
  @ViewChild('filterButtonProducts') filterButtonProducts: FilterButtonComponent;

  form: FormGroup = this.formBuilder.group({
    references: [],
    types: [],
    origins: [],
    destinies: [],
    products: [],
    packingReferencePattern: [],
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: null,
      order: "DESC"
    })
  });

  /**Filters */
  references: Array<TagsInputOption> = [];
  types: Array<TagsInputOption> = [];
  origins: Array<TagsInputOption> = [];
  destinies: Array<TagsInputOption> = [];
  products: Array<TagsInputOption> = [];

  /** Filters save **/
  referencesSelected: Array<any> = [];
  typesSelected: Array<any> = [];
  originsSelected: Array<any> = [];
  destiniesSelected: Array<any> = [];
  productsSelected: Array<any> = [];
  packingReferencePatternSelected: Array<any> = [];
  orderbySelected: Array<any> = [];

  itemsIdSelected: Array<any> = [];
  itemsReferenceSelected: Array<any> = [];

  isFirst: boolean = true;
  hasDeleteProduct = false;

  //For filter popovers
  isFilteringReferences: number = 0;
  isFilteringTypes: number = 0;
  isFilteringOrigins: number = 0;
  isFilteringDestinies: number = 0;
  isFilteringProducts: number = 0;

  lastUsedFilter: string = '';
  isMobileApp: boolean = false;

  //For sorting
  lastOrder = [true, true, true, true, true];

  public title = 'Jaulas';
  public columns: any[] = [{ name: 'ID', value: 'id' }, { name: 'Referencia', value: 'reference' }];
  public apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers').name;
  public routePath = '/jails';
  public jails: any[];

  displayedColumns = ['select', 'reference', 'packing', 'warehouse', 'destiny', 'products-status', 'sealed', 'isSend', "update", 'open-modal', 'buttons-print',];
  dataSource: any;
  listAllCarriers: any;
  expandedElement: CarrierModel.Carrier;

  carriers: Array<CarrierModel.Carrier> = [];
  warehouses: Array<WarehouseModel.Warehouse> = [];

  toDelete: FormGroup = this.formBuilder.group({
    jails: this.formBuilder.array([])
  });

/*  /!**form to select elements to print or for anything *!/
  selectedForm: FormGroup = this.formBuilder.group({}, {
    validators: validators.haveItems("toSelect")
  });*/

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private carrierService: CarrierService,
    private warehouseService: WarehouseService,
    private intermediaryService: IntermediaryService,
    private alertControler: AlertController,
    private printerService: PrinterService,
    private loadController: LoadingController,
    private historyModalComponent: HistoryModalComponent,
    private router: Router,
    private warehousesService: WarehousesService,
    private typeService: TypesService,
    private alertController: AlertController,
    private filterServices: FiltersService,
    private productsService: ProductsService,
    private modalController: ModalController,
    private usersService: UsersService,
    private permisionService: PermissionsService
  ) {
    this.isMobileApp = typeof window.cordova !== "undefined";
  }

  ngOnInit() {
    this.getTypePacking();
    this.getWarehouses();
    this.usersService.hasDeleteProductPermission().then((observable) => {
      observable.subscribe((response) => {
        this.hasDeleteProduct = response.body.data;
      })
    });
    this.getPermisionUser();
    this.getAllInfo();
  }

  async getAllInfo() {
    let body: CallToService={
      pagination: null,
      orderby: null,
      filters: null
    };
    this.intermediaryService.presentLoading();
    await this.carrierService.getFilters().subscribe(sql_filters_result => {
      this.listAllCarriers = sql_filters_result.data.filters;
    });

    await this.carrierService.searchInContainer(body).subscribe(sql_result => {
      this.results = sql_result.data.results;
      this.initSelectForm();
      this.dataSource = new MatTableDataSource<CarrierModel.SearchInContainer>(this.results);

      let paginator: any = sql_result.data.pagination;
      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.selectPage;
      this.paginator.lastPage = paginator.lastPage;
      this.getFilters(true);
      this.listenChanges();

      //Reduce all filters
      if (this.lastUsedFilter != 'references') {
        for (let index in this.references) {
          this.references[index].hide = false;
          this.references[index].checked = true;
        }
        this.filterButtonReferences.listItems = this.references;
      }
      if (this.lastUsedFilter != 'types') {
        for (let index in this.types) {
          this.types[index].hide = false;
          this.types[index].checked = true;
        }

        this.filterButtonTypes.listItems = this.types;
      }
      if (this.lastUsedFilter != 'origins') {
        for (let index in this.origins) {
          this.origins[index].hide = false;
          this.origins[index].checked = true;
          this.origins[index].value = '' + this.origins[index].reference + ' - '+this.origins[index].name+'';
        }
        this.filterButtonOrigins.listItems = this.origins;
      }
      if (this.lastUsedFilter != 'destinies') {
        for (let index in this.destinies) {
          this.destinies[index].hide = false;
          this.destinies[index].checked = true;
          this.destinies[index].value = '' + this.destinies[index].reference + ' - '+this.destinies[index].name+'';
        }

        this.filterButtonDestinies.listItems = this.destinies;
      }
      if (this.lastUsedFilter != 'products') {
        for (let index in this.products) {
          this.products[index].hide = false;
          this.products[index].checked = true;
        }

        this.filterButtonProducts.listItems = this.products;
      }
    });
    this.intermediaryService.dismissLoading();
  }

  eraseFilters() {
    this.form = this.formBuilder.group({
      references: [],
      types: [],
      origins: [],
      destinies: [],
      products: [],
      packingReferencePattern: [],
      pagination: this.formBuilder.group({
        page: 1,
        limit: this.pagerValues[0]
      }),
      orderby: this.formBuilder.group({
        type: null,
        order: "DESC"
      })
    });
    JailComponent.deleteArrow();
    this.lastUsedFilter = '';
    this.getFilters();
  }

  sort(column: string) {
    for (let i = 0; i < document.getElementsByClassName('title').length; i++) {
      let iColumn = document.getElementsByClassName('title')[i] as HTMLElement;
      if (iColumn.innerHTML.includes('🡇') || iColumn.innerHTML.includes('🡅')) {
        iColumn.innerHTML = iColumn.innerHTML.slice(0, -2);
      }
    }

    switch (column) {
      case 'reference': {
        if (this.lastOrder[0]) {
          this.form.value.orderby = { order: "DESC", type: 1 };
          JailComponent.showArrow(0, false);
        }
        else {
          this.form.value.orderby = { order: "ASC", type: 1 };
          JailComponent.showArrow(0, true);
        }
        this.lastOrder[0] = !this.lastOrder[0];
        break;
      }
      case 'type': {
        if (this.lastOrder[1]) {
          this.form.value.orderby = { order: "DESC", type: 2 };
          JailComponent.showArrow(1, false);
        }
        else {
          this.form.value.orderby = { order: "ASC", type: 2 };
          JailComponent.showArrow(1, true);
        }
        this.lastOrder[1] = !this.lastOrder[1];
        break;
      }
      case 'origin': {
        if (this.lastOrder[2]) {
          this.form.value.orderby = { order: "DESC", type: 3 };
          JailComponent.showArrow(2, false);
        }
        else {
          this.form.value.orderby = { order: "ASC", type: 3 };
          JailComponent.showArrow(2, true);
        }
        this.lastOrder[2] = !this.lastOrder[2];
        break;
      }
      case 'destiny': {
        if (this.lastOrder[3]) {
          this.form.value.orderby = { order: "DESC", type: 4 };
          JailComponent.showArrow(3, false);
        }
        else {
          this.form.value.orderby = { order: "ASC", type: 4 };
          JailComponent.showArrow(3, true);
        }
        this.lastOrder[3] = !this.lastOrder[3];
        break;
      }
      case 'product': {
        if (this.lastOrder[4]) {
          this.form.value.orderby = { order: "DESC", type: 5 };
          JailComponent.showArrow(4, false);
        }
        else {
          this.form.value.orderby = { order: "ASC", type: 5 };
          JailComponent.showArrow(4, true);
        }
        this.lastOrder[4] = !this.lastOrder[4];
        break;
      }
    }
    this.searchInContainer(this.sanitize(this.getFormValueCopy()));
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

  applyFilters(filtersResult, filterType) {
    const filters = filtersResult.filters;
    switch (filterType) {
      case 'references':
        let referencesFiltered: string[] = [];
        for (let reference of filters) {
          if (reference.checked) referencesFiltered.push(reference);
        }
        if (referencesFiltered.length >= this.references.length) {
          if(referencesFiltered.length > this.references.length){
            this.form.value.references = this.references;
            this.isFilteringReferences = this.references.length;
          }else{
            this.form.value.references = referencesFiltered;
            this.isFilteringReferences = referencesFiltered.length;
          }
        } else {
          if (referencesFiltered.length > 0) {
            this.form.value.references = referencesFiltered;
            this.isFilteringReferences = referencesFiltered.length;
          } else {
            this.form.value.references = null;
            this.isFilteringReferences = 0;
          }
        }
        break;
      case 'types':
        let typesFiltered: string[] = [];
        for (let type of filters) {
          if (type.checked) typesFiltered.push(type);
        }
        if (typesFiltered.length >= this.types.length) {
          if(typesFiltered.length > this.types.length){
            this.form.value.types = this.types;
            this.isFilteringTypes = this.types.length;
          }else{
            this.form.value.types = typesFiltered;
            this.isFilteringTypes = typesFiltered.length;
          }
        } else {
          if (typesFiltered.length > 0) {
            this.form.value.types = typesFiltered;
            this.isFilteringTypes = typesFiltered.length;
          } else {
            this.form.value.types = null;
            this.isFilteringTypes = 0;
          }
        }
        break;
      case 'origins':
        let originsFiltered: number[] = [];
        for (let origin of filters) {
          if (origin.checked) originsFiltered.push(origin);
        }
        if (originsFiltered.length >= this.origins.length) {
          if(originsFiltered.length > this.origins.length){
            this.form.value.origins = this.origins;
            this.isFilteringOrigins = this.origins.length;
          }else{
            this.form.value.origins = originsFiltered;
            this.isFilteringOrigins = originsFiltered.length;
          }
        } else {
          if (originsFiltered.length > 0) {
            this.form.value.origins = originsFiltered;
            this.isFilteringOrigins = originsFiltered.length;
          } else {
            this.form.value.origins = null;
            this.isFilteringOrigins = 0;
          }
        }
        break;
      case 'destinies':
        let destiniesFiltered: number[] = [];
        for (let destiny of filters) {
          if (destiny.checked) destiniesFiltered.push(destiny);
        }
        if (destiniesFiltered.length >= this.destinies.length) {
          if(destiniesFiltered.length > this.destinies.length){
            this.form.value.destinies = this.destinies;
            this.isFilteringDestinies = this.destinies.length;
          }else{
            this.form.value.destinies = destiniesFiltered;
            this.isFilteringDestinies = destiniesFiltered.length;
          }
        } else {
          if (destiniesFiltered.length > 0) {
            this.form.value.destinies = destiniesFiltered;
            this.isFilteringDestinies = destiniesFiltered.length;
          } else {
            this.form.value.destinies = null;
            this.isFilteringDestinies = 0;
          }
        }
        break;
      case 'products':
        let productsFiltered: number[] = [];
        for (let product of filters) {
          if (product.checked) productsFiltered.push(product);
        }
        if (productsFiltered.length >= this.products.length) {
          if(productsFiltered.length > this.products.length){
            this.form.value.products = this.products;
            this.isFilteringProducts = this.products.length;
          }else{
            this.form.value.products = productsFiltered;
            this.isFilteringProducts = productsFiltered.length;
          }
        } else {
          if (productsFiltered.length > 0) {
            this.form.value.products = productsFiltered;
            this.isFilteringProducts = productsFiltered.length;
          } else {
            this.form.value.products = null;
            this.isFilteringProducts = 0;
          }
        }
        break;
    }
    this.lastUsedFilter = filterType;
    let flagApply = true;
    this.searchInContainer(this.sanitize(this.getFormValueCopy()), flagApply);
  }

  /**
   * clear empty values of objecto to sanitize it
   * @param object Object to sanitize
   * @return the sanitized object
   */
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
      /*if (object[key] === null || object[key] === "") {
        delete object[key];
      }*/
    });
    return object;
  }

  /**
   * Select or unselect all visible products
   * @param event to check the status
   */
  selectAll(event): void {
    let value = event.detail.checked;
    (<FormArray>this.toDelete.value.jails).controls.forEach(control => {
      control.setValue(value);
    });

    if (value) {
      this.itemsIdSelected = this.results;
    } else {
      this.itemsIdSelected = [];
    }
  }

  /**
   * Listen changes in form to resend the request for search
   */
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
    });

    /**detect changes in the form */
    this.form.statusChanges.subscribe(change => {
      if (this.pauseListenFormChange) return;
      ///**format the reference */
      /**cant send a request in every keypress of reference, then cancel the previous request */
      clearTimeout(this.requestTimeout);
      /**it the change of the form is in reference launch new timeout with request in it */
      if (this.form.value.productReferencePattern != this.previousProductReferencePattern) {
        /**Just need check the vality if the change happens in the reference */
        if (this.form.valid)
          this.requestTimeout = setTimeout(() => {
            this.searchInContainer(this.sanitize(this.getFormValueCopy()));
          }, 1000);
      } else {
        /**reset the paginator to the 0 page */
        this.searchInContainer(this.sanitize(this.getFormValueCopy()));
      }
      /**assign the current reference to the previous reference */
      this.previousProductReferencePattern = this.form.value.productReferencePattern;
    });
  }

  private saveFilters(){
    this.referencesSelected = this.form.value.references;
    this.typesSelected = this.form.value.types;
    this.originsSelected = this.form.value.origins;
    this.destiniesSelected = this.form.value.destinies;
    this.productsSelected = this.form.value.products;
    this.packingReferencePatternSelected = this.form.value.packingReferencePattern;
    this.orderbySelected = this.form.value.orderby;
  }

  private recoverFilters(){
    this.form.get("references").patchValue(this.referencesSelected, { emitEvent: false });
    this.form.get("types").patchValue( this.typesSelected, { emitEvent: false });
    this.form.get("origins").patchValue(this.originsSelected, { emitEvent: false });
    this.form.get("destinies").patchValue(this.destiniesSelected, { emitEvent: false });
    this.form.get("products").patchValue(this.productsSelected, { emitEvent: false });
    this.form.get("packingReferencePattern").patchValue(this.packingReferencePatternSelected, { emitEvent: false });
    this.form.get("orderby").patchValue(this.orderbySelected, { emitEvent: false });
  }

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  /**
   * init selectForm controls
   */
  initSelectForm(): void {
    this.toDelete.removeControl("jails");
    this.toDelete.addControl("jails", this.formBuilder.array(this.results.map(carrier => {
      return this.formBuilder.group({
        id: carrier.id,
        reference: carrier.reference,
        selected: false
      });
    })));
/*    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect", this.formBuilder.array(this.searchsInContainer.map(carrier => new FormControl(false))));*/
  }

  /**
   * search carriers in container by criteria
   * @param parameters - parameters to search
   * @param applyFilter - parameters to search
   */
  searchInContainer(parameters, applyFilter: boolean = false): void {
    if(applyFilter){
      parameters.pagination.page = 1;
    }

    let body: CallToService={
      pagination: parameters.pagination,
      orderby: parameters.orderby,
      filters: {
        references: parameters.references,
        types: parameters.types,
        origins: parameters.origins,
        destinies: parameters.destinies,
        products: parameters.products,
      }
    };

    if(this.isFilteringReferences == this.references.length){
      body.filters.references = null;
    }
    if(this.isFilteringTypes == this.types.length){
      body.filters.types = null;
    }
    if(this.isFilteringOrigins == this.origins.length){
      body.filters.origins = null;
    }
    if(this.isFilteringDestinies == this.destinies.length){
      body.filters.destinies = null;
    }
    if(this.isFilteringProducts == this.products.length) {
      body.filters.products = null;
    }

    this.intermediaryService.presentLoading();
    this.carrierService.searchInContainer(body).subscribe(sql_result => {
      this.intermediaryService.dismissLoading();
      this.results = sql_result.data.results;
      this.dataSource = new MatTableDataSource<CarrierModel.SearchInContainer>(this.results);
      this.initSelectForm();
      let paginator: any = sql_result.data.pagination;

      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.selectPage;
      this.paginator.lastPage = paginator.lastPage;

      this.toDelete.removeControl("jails");
      this.toDelete.addControl("jails", this.formBuilder.array(this.results.map(carrier => {
        return this.formBuilder.group({
          id: carrier.id,
          reference: carrier.reference,
          selected: false
        });
      })));

      /*//Reduce all filters
      if (this.lastUsedFilter != 'references') {
        let filteredReferences = sql_result.data.filters['references'] as unknown as string[];
        for (let index in this.references) {
          this.references[index].hide = !filteredReferences.includes(this.references[index].value);
        }
        this.filterButtonReferences.listItems = this.references;
      }
      if (this.lastUsedFilter != 'types') {
        let filteredTypes = sql_result.data.filters['types'] as unknown as string[];
        for (let index in this.types) {
          this.types[index].hide = !filteredTypes.includes(this.types[index].value);
        }
        this.filterButtonTypes.listItems = this.types;
      }
      if (this.lastUsedFilter != 'origins') {
        let filteredOrigins = sql_result.data.filters['origins'] as unknown as string[];
        for (let index in this.origins) {
          this.origins[index].hide = !filteredOrigins.includes(this.origins[index].value);
        }
        this.filterButtonOrigins.listItems = this.origins;
      }
      if (this.lastUsedFilter != 'destinies') {
        let filteredDestinies = sql_result.data.filters['destinies'] as unknown as string[];
        for (let index in this.destinies) {
          this.destinies[index].hide = !filteredDestinies.includes(this.destinies[index].value);
        }
        this.filterButtonDestinies.listItems = this.destinies;
      }
      if (this.lastUsedFilter != 'products') {
        let filteredProducts = sql_result.data.filters['products'] as unknown as (string | number)[];
        for (let index in this.products) {
          this.products[index].hide = !filteredProducts.includes(this.products[index].reference);
        }
        this.filterButtonProducts.listItems = this.products;
      }*/

      if(applyFilter){
        this.saveFilters();
        this.form.get("pagination").patchValue({
          limit: this.form.value.pagination.limit,
          page: 1
        }, { emitEvent: false });
        this.recoverFilters();
      }
    }, () => {
      this.intermediaryService.dismissLoading();
    });
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
    this.carrierService.getFileExcell(this.sanitize(formToExcel)).pipe(
      catchError(error => of(error)),
      // map(file => file.error.text)
    ).subscribe((data) => {

      const blob = new Blob([data], { type: 'application/octet-stream' });
      Filesave.saveAs(blob, `${Date.now()}.xlsx`);
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess('Archivo descargado')
    }, error => console.log(error));
  }

  /**
   * get all filters to fill the selects
   */
  getFilters(stable: boolean = false) {

    this.updateFilterSourceReferences(this.listAllCarriers.references, stable);
    this.updateFilterSourceTypes(this.listAllCarriers.types, stable);
    this.updateFilterSourceOrigins(this.listAllCarriers.origins, stable);
    this.updateFilterSourceDestinies(this.listAllCarriers.destinies, stable);
    this.updateFilterSourceProducts(this.listAllCarriers.products, stable);

    this.isFilteringReferences = this.references.length;
    this.isFilteringTypes = this.types.length;
    this.isFilteringOrigins = this.origins.length;
    this.isFilteringDestinies = this.destinies.length;
    this.isFilteringProducts = this.products.length;

  }

  private getPermisionUser(){
    this.permisionService.getGestionPermision().then(obs =>{
      obs.subscribe(permision =>{
        this.permision = permision.body.data;
      })
    });
  }

  private updateFilterSourceReferences(references: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let referencesList: any[] = [];
    references.forEach(key => {
      if(!referencesList.find( f => f.value == key['reference'])) {
        referencesList.push({value: key['reference']});
      }
    });
    console.log("referencesList",referencesList);
    if(stable == true) {
      this.references = referencesList;
      this.form.get("references").patchValue(this.references, {emitEvent: false});
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceTypes(types: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let typesList: any[] = [];
    types.forEach(key => {
      if(!typesList.find( f => f.value == key['name'])) {
        typesList.push({value: key['name']});
      }
    });
    if(stable == true) {
      this.types = typesList;
      this.form.get("types").patchValue(this.types, {emitEvent: false});
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceOrigins(origins: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let originsList: any[] = [];
    origins.forEach(key => {
      if(!originsList.find( f => f.reference == key['reference'])){
        originsList.push({reference: key['reference'], name: key['name']});
      }
    });
    if(stable == true) {
      this.origins = originsList;
      this.form.get("origins").patchValue(this.origins, {emitEvent: false});
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceDestinies(destinies: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let destiniesList: any[] = [];
    destinies.forEach(key => {
          if (!destiniesList.find(f => f.reference == key['reference'])) {
            if(key['reference'] == null) {
              destiniesList.push({reference: 'Sin', name: 'Destino'});
            }else {
              destiniesList.push({reference: key['reference'], name: key['name']});
            }
          }
    });
    if(stable == true) {
      this.destinies = destiniesList;
      this.form.get("destinies").patchValue(this.destinies, {emitEvent: false});
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceProducts(products: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let productsList: any[] = [];
    products.forEach(key => {
      if(!productsList.find( f => f.value == key['reference'])) {
        productsList.push({value: key['reference']});
      }
    });
    if(stable == true) {
      this.products = productsList;
      this.form.get("products").patchValue(this.products, {emitEvent: false});
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  /**
   * Return a type
   * @param id - the id of type
   */
  typeById(id: number) {
    if (this.types) {
      return this.types.find(type => type.id == id);
    }
    return { name: '' };
  }

  prevent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Open modal to edit jail
   * @param event - to cancel it
   * @param jail - jail to be updated
   */
  async toUpdate(event, jail) {
    event.stopPropagation();
    event.preventDefault();

    let modal = (await this.modalCtrl.create({
      component: UpdateComponent,
      componentProps: {
        jail: jail
      }
    }));

    modal.onDidDismiss().then(() => {
      this.getCarriers();
    });

    modal.present();
  }

  /**
   * Open modal to edit jail
   * @param event - to cancel it
   * @param jail - jail to be updated
   */
  async toSend(event, jail) {
    event.stopPropagation();
    event.preventDefault();

    let modal = (await this.modalCtrl.create({
      component: SendPackingComponent,
      componentProps: {
        jail: jail
      }
    }));

    modal.onDidDismiss().then(() => {
      this.getCarriers();
    });

    modal.present();
  }

  /**
   * Open modal to store jail
   */
  async toStore() {
    let modal = (await this.modalCtrl.create({
      component: StoreComponent
    }));

    modal.onDidDismiss().then(() => {
      this.getCarriers();
    });

    modal.present();
  }

  getTypePacking() {
    this.intermediaryService.presentLoading();
    this.carrierService.getPackingTypes().subscribe(types => {
      this.types = types;
      this.intermediaryService.dismissLoading();
    })
  }

  loadCarriers(): void {
    let parameters = this.sanitize(this.getFormValueCopy());
    if(!parameters.orderby.type){
      parameters.orderby.type = null;
    }

    let body: CallToService={
      pagination: parameters.pagination,
      orderby: parameters.orderby,
      filters: {
        references: parameters.references,
        types: parameters.types,
        origins: parameters.origins,
        destinies: parameters.destinies,
        products: parameters.products,
      }
    };

    if(this.isFilteringReferences == this.references.length){
      body.filters.references = null;
    }
    if(this.isFilteringTypes == this.types.length){
      body.filters.types = null;
    }
    if(this.isFilteringOrigins == this.origins.length){
      body.filters.origins = null;
    }
    if(this.isFilteringDestinies == this.destinies.length){
      body.filters.destinies = null;
    }
    if(this.isFilteringProducts == this.products.length) {
      body.filters.products = null;
    }

    this.intermediaryService.presentLoading("Actualizando...");
    this.carrierService.searchInContainer(body).subscribe(sql_result => {
      this.results = sql_result.data.results;
      this.dataSource = new MatTableDataSource<CarrierModel.SearchInContainer>(this.results);
      this.initSelectForm();
      let paginator: any = sql_result.data.pagination;

      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.selectPage;
      this.paginator.lastPage = paginator.lastPage;

      this.toDelete.removeControl("jails");
      this.toDelete.addControl("jails", this.formBuilder.array(this.results.map(carrier => {
        return this.formBuilder.group({
          id: carrier.id,
          reference: carrier.reference,
          selected: false
        });
      })));
      this.intermediaryService.dismissLoading();
    });
  }

  delete() {
    let observable = new Observable(observer => observer.next());
    this.toDelete.value.jails.forEach(jail => {
      if (jail.selected)
        observable = observable.pipe(switchMap(resonse => {
          return this.carrierService.delete(jail.id)
        }))
    });
    this.intermediaryService.presentLoading();
    observable.subscribe(
      () => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess(
          'Jaula eliminada con exito'
        );
        this.getCarriers();
      },
      () => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess('Error eliminando jaula');
      }
    );
  }

  getCarriers(): void {
    this.intermediaryService.presentLoading();
    this.carrierService.getIndex().subscribe(carriers => {
      this.carriers = carriers;
      this.toDelete.removeControl("jails");
      this.toDelete.addControl("jails", this.formBuilder.array(carriers.map(carrier => {
        return this.formBuilder.group({
          id: carrier.id,
          reference: carrier.reference,
          selected: false
        });
      })));
      this.dataSource = new MatTableDataSource(carriers);
      this.intermediaryService.dismissLoading();
    })
  }

  isAvailableSend(carrier) {
    let isAvailable = carrier.product > 0 ? false : true;
    if (isAvailable) {
      return carrier.destiny.length == 0 || carrier.destiny.length == 1;
    }
    return false;
  }

  /**
   * check if have items to delete
   */
  hasToDelete(): boolean {
    return !!this.toDelete.value.jails.find(jail => jail.selected);
  }

  /**
   * copied function to show modal when user tap on print button
   * @param event
   * @param row
   */
  async print(event, row?: CarrierModel.Carrier) {
    event.stopPropagation();
    let listReferences: Array<string> = null;
    if (row && row.reference) {
      listReferences = [row.reference];
    } else if (!row) {
      listReferences = this.toDelete.value.jails.filter(jail => jail.selected).map(jail => jail.reference);
    }

    if (listReferences && listReferences.length > 0) {
      this.printReferencesList(listReferences);
    }
  }


  async newJail() {
    let lista: number[] = this.toDelete.value.jails.filter(jail => jail.selected).map(x => x.id);
    let newId: CarrierModel.Carrier = null;
    let listaCarrier: CarrierModel.Carrier[] = [];
    let listaSend: CarrierModel.Carrier[] = [];
    if (this.carriers.length > 1) {
    } else {
      this.carrierService.getIndex().subscribe(carriers => {
        this.carriers = carriers;
      })
    }
    lista.forEach(async (id) => {
      newId = this.carriers.find(x => x.id === id);

      if (newId) {
        listaCarrier.push(newId)
      }
    });

    if (listaCarrier.length > 0) {
      listaSend = listaCarrier.filter(x => {
        if (x.packingInventorys.length > 0 && x.status !== 4 && x.carrierWarehousesDestiny.length === 1) {
          return x;
        }
      });
      if (listaSend.length > 0) {
        listaSend.forEach(y => {
          listaCarrier = listaCarrier.filter(x => x.id !== y.id)
        })
      }
      this.presentAlert(listaCarrier, listaSend)
    }
  }

  async presentAlert(lista: CarrierModel.Carrier[], listaPresentada: CarrierModel.Carrier[]) {
    let listaRefereceJaulainviata = listaPresentada.map(x => x.reference);
    let listWithDestiny = [];
    let listWithNoDestiny = [];
    let newlistaPrint = [];
    listaPresentada.forEach(item => {
      //Lista llenada toda
      listWithDestiny.push({
        id: item.id,
        idWarehouse: item.warehouse.id,
        idWarehouseName: item.carrierWarehousesDestiny[0].warehouse.name,
        reference: item.reference,
        destiny: item.carrierWarehousesDestiny.length,
        status: item.status,
        products: item.packingInventorys.length,
      });
    });
    lista.forEach(item => {
      //Lista no llenada toda
      listWithNoDestiny.push({
        id: item.id,
        idWarehouse: item.warehouse.id,
        reference: item.reference,
        destiny: item.carrierWarehousesDestiny.length,
        products: item.packingInventorys.length,
        status: item.status
      });
    });

    let lstShow = "";
    newlistaPrint.map(x => {
      lstShow += `${x}</br>`;
      return `${x}</br>`
    });

    let lst = "";

    listaRefereceJaulainviata.map(x => {
      lst += `${x}</br>`;
      return `${x}</br>`
    });

    this.setMultipleDestinations(listWithDestiny, listWithNoDestiny);
  }

  private async printReferencesList(listReferences: Array<string>) {
    if ((<any>window).cordova) {
      this.printerService.print({ text: listReferences, type: 0 });
    } else {
      return await this.printerService.printBarcodesOnBrowser(listReferences);
    }
  }

  /**
   * Open modal to edit jail
   * @param event - to cancel it
   * @param jail - jail to be updated
   */
  async send(event, jail) {
    event.stopPropagation();
    event.preventDefault();

    let modal = (await this.modalCtrl.create({
      component: AddDestinyComponent,
      componentProps: {
        jail: jail
      },
      cssClass: 'modalStyles'
    }));

    modal.onDidDismiss().then(() => {
      this.getCarriers();
    });

    modal.present();
  }

  async viewCarrier(element) {
    let modal = (await this.modalCtrl.create({
      component: HistoryModalComponent,
      componentProps: { packingReference: element.reference }
    }));

    modal.present()
  }

  async callToHistory() {
    this.router.navigate(['jails/history/']);
  }

  async showDestinations(event, jail) {
    event.stopPropagation();
    event.preventDefault();

    let modal = (await this.modalCtrl.create({
      component: ShowDestinationsComponent,
      componentProps: {
        jail: jail
      }
    }));

    modal.onDidDismiss().then(() => {

    });

    modal.present();
  }

  getWarehouses() {
    this.intermediaryService.presentLoading();
    this.warehouseService.getIndex().then(observable => {
      observable.subscribe(response => {
        this.warehouses = (<any>response.body).data;
        this.intermediaryService.dismissLoading();
      });
    })
  }

  async setMultipleDestinations(listWithDestiny, listWithNoDestiny) {
    event.stopPropagation();
    event.preventDefault();

    let modal = await this.modalCtrl.create({
      component: MultipleDestinationsComponent,
      componentProps: {
        listWithNoDestiny: listWithNoDestiny,
        listWithDestiny: listWithDestiny
      }
    });

    modal.onDidDismiss().then((p) => {
      if (p && p.data) {
        this.getCarriers();
      }
    });

    modal.present();
  }
}
