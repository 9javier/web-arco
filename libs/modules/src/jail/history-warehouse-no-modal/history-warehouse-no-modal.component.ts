import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarrierService, IntermediaryService, WarehouseService } from '@suite/services';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import {DateTimeParserService} from "../../../../services/src/lib/date-time-parser/date-time-parser.service";
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import {PaginatorComponent} from "../../components/paginator/paginator.component";
import {
  ProductModel,
  ProductsService,
  FiltersService,
  FiltersModel,
  InventoryService,
  InventoryModel,
  TypesService,
  WarehousesService,
  UsersService,
  PermissionsModel
} from '@suite/services';
import { TagsInputOption } from '../../components/tags-input/models/tags-input-option.model';
import { FilterButtonComponent } from "../../components/filter-button/filter-button.component";
import { map, catchError } from 'rxjs/operators';
import * as Filesave from 'file-saver';
import { of } from 'rxjs';
import {validators} from "../../utils/validators";
import {PermissionsService} from "../../../../services/src/lib/endpoint/permissions/permissions.service";
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";
import { ModalController, AlertController } from '@ionic/angular';
import {CarrierModel} from "../../../../services/src/models/endpoints/carrier.model";

export interface CallToService{
  warehouse:number
}

@Component({
  selector: 'history-warehouse-nm',
  templateUrl: './history-warehouse-no-modal.component.html',
  styleUrls: ['./history-warehouse-no-modal.component.scss']
})

export class HistoryWarehouseNMComponent implements OnInit {
  title = 'Destinos';
  redirectTo = '/jails';

  /**timeout for send request */
  requestTimeout;

  /**previous reference to detect changes */
  previousProductReferencePattern = '';
  pauseListenFormChange = false;
  permision:boolean;

  displayedColumns: string[] = ['reference', 'type', 'origin', 'destiny', 'dateSend', 'dateReceive'];
  pagerValues = [50, 100, 500];

  /**List of SearchInContainer */
  searchsInContainer: Array<CarrierModel.Carrier> = [];

  /**Filters */
  references: Array<TagsInputOption> = [];
  types: Array<TagsInputOption> = [];
  origins: Array<TagsInputOption> = [];
  destinies: Array<TagsInputOption> = [];
  datesSend: Array<TagsInputOption> = [];
  datesReceive: Array<TagsInputOption> = [];

  /** Filters save **/
  referencesSelected: Array<any> = [];
  typesSelected: Array<any> = [];
  originsSelected: Array<any> = [];
  destiniesSelected: Array<any> = [];
  datesSendSelected: Array<any> = [];
  datesReceiveSelected: Array<any> = [];
  productReferencePatternSelected: Array<any> = [];
  orderbySelected: Array<any> = [];

  //For filter popovers
  isFilteringReferences: number = 0;
  isFilteringTypes: number = 0;
  isFilteringOrigins: number = 0;
  isFilteringDestinies: number = 0;
  isFilteringDatesSend: number = 0;
  isFilteringDatesReceive: number = 0;

  lastUsedFilter: string = 'types';
  isMobileApp: boolean = false;

  //For sorting
  lastOrder = [true, true, true, true, true, true, true, true];

  public datemin = "";
  public datemax = "";
  public whsCode = 0;
  public whs: any;
  public results:any;
  public typeMovement:any = [];
  validateDates = false;

  valueWarehouse;
  valueStarDate;
  valueEndDate;

  dataSource = new MatTableDataSource<any>();
  listHistory = [];
  nStore:string;
  jOnStore:string;
  jOnTI:string;
  jOnTV:string;
  formVar: FormGroup;
  endMinDate;

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild('filterButtonReferences') filterButtonReferences: FilterButtonComponent;
  @ViewChild('filterButtonTypes') filterButtonTypes: FilterButtonComponent;
  @ViewChild('filterButtonOrigins') filterButtonOrigins: FilterButtonComponent;
  @ViewChild('filterButtonDestinies') filterButtonDestinies: FilterButtonComponent;
  @ViewChild('filterButtonDatesSend') filterButtonDatesSend: FilterButtonComponent;
  @ViewChild('filterButtonDatesReceive') filterButtonDatesReceive: FilterButtonComponent;

  /**form to select elements to print or for anything */
  selectedForm: FormGroup = this.formBuilder.group({}, {
    validators: validators.haveItems("toSelect")
  });

  form: FormGroup = this.formBuilder.group({
    references: [],
    types: [],
    origins: [],
    destinies: [],
    datesSend: [],
    datesReceive: [],
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: '',
      order: "asc"
    })
  });

  constructor(
    private route: ActivatedRoute,
    private carrierService: CarrierService,
    private warehouseService:WarehouseService,
    private intermediaryService: IntermediaryService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private dateTimeParserService: DateTimeParserService,
    private formBuilder: FormBuilder,
    private filterServices: FiltersService,
    private inventoryServices: InventoryService,
    private warehousesService: WarehousesService,
    private typeService: TypesService,
    private alertController: AlertController,
    private productsService: ProductsService,
    private modalController: ModalController,
    private printerService: PrinterService,
    private usersService: UsersService,
    private permisionService: PermissionsService
  ) {}

  ngOnInit() {
    this.getCarriers();
    this.setForms();
    this.getMovementTypeFromService();
  }

  eraseFilters() {
    this.form = this.formBuilder.group({
      references: [],
      types: [],
      origins: [],
      destinies: [],
      datesSend: [],
      datesReceive: [],
      pagination: this.formBuilder.group({
        page: 1,
        limit: this.pagerValues[0]
      }),
      orderby: this.formBuilder.group({
        type: '',
        order: "asc"
      })
    });
    this.deleteArrow();
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
          this.form.value.orderby = { order: "desc", type: 6 };
          this.showArrow(0, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 6 };
          this.showArrow(0, true);
        }
        this.lastOrder[0] = !this.lastOrder[0];
        break;
      }
      case 'type': {
        if (this.lastOrder[1]) {
          this.form.value.orderby = { order: "desc", type: 3 };
          this.showArrow(1, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 3 };
          this.showArrow(1, true);
        }
        this.lastOrder[1] = !this.lastOrder[1];
        break;
      }
      case 'origin': {
        if (this.lastOrder[2]) {
          this.form.value.orderby = { order: "desc", type: 1 };
          this.showArrow(2, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 1 };
          this.showArrow(2, true);
        }
        this.lastOrder[2] = !this.lastOrder[2];
        break;
      }
      case 'destiny': {
        if (this.lastOrder[3]) {
          this.form.value.orderby = { order: "desc", type: 2 };
          this.showArrow(3, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 2 };
          this.showArrow(3, true);
        }
        this.lastOrder[3] = !this.lastOrder[3];
        break;
      }
      case 'dateSend': {
        if (this.lastOrder[4]) {
          this.form.value.orderby = { order: "desc", type: 8 };
          this.showArrow(4, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 8 };
          this.showArrow(4, true);
        }
        this.lastOrder[4] = !this.lastOrder[4];
        break;
      }
      case 'dateReceive': {
        if (this.lastOrder[5]) {
          this.form.value.orderby = { order: "desc", type: 4 };
          this.showArrow(5, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 4 };
          this.showArrow(5, true);
        }
        this.lastOrder[5] = !this.lastOrder[5];
        break;
      }
    }
    this.searchInContainer(this.sanitize(this.getFormValueCopy()));
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
      if (object[key] === null || object[key] === "") {
        delete object[key];
      }
    });
    return object;
  }

  showArrow(colNumber, dirDown) {
    let htmlColumn = document.getElementsByClassName('title')[colNumber] as HTMLElement;
    if (dirDown) htmlColumn.innerHTML += ' 🡇';
    else htmlColumn.innerHTML += ' 🡅';
  }

  deleteArrow() {
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
          if (reference.checked) referencesFiltered.push(reference.reference);
        }
        if (referencesFiltered.length >= this.references.length) {
          this.form.value.productReferencePattern = [];
          this.isFilteringReferences = this.references.length;
        } else {
          if (referencesFiltered.length > 0) {
            this.form.value.productReferencePattern = referencesFiltered;
            this.isFilteringReferences = referencesFiltered.length;
          } else {
            this.form.value.productReferencePattern = ['99999'];
            this.isFilteringReferences = this.references.length;
          }
        }
        break;
      case 'types':
        let typesFiltered: string[] = [];
        for (let type of filters) {
          if (type.checked) typesFiltered.push(type.id);
        }
        if (typesFiltered.length >= this.types.length) {
          this.form.value.types = [];
          this.isFilteringTypes = this.types.length;
        } else {
          if (typesFiltered.length > 0) {
            this.form.value.types = typesFiltered;
            this.isFilteringTypes = typesFiltered.length;
          } else {
            this.form.value.types = [99999];
            this.isFilteringTypes = this.types.length;
          }
        }
        break;
      case 'origins':
        let originsFiltered: number[] = [];
        for (let origin of filters) {
          if (origin.checked) originsFiltered.push(origin.id);
        }
        if (originsFiltered.length >= this.origins.length) {
          this.form.value.origins = [];
          this.isFilteringOrigins = this.origins.length;
        } else {
          if (originsFiltered.length > 0) {
            this.form.value.origins = originsFiltered;
            this.isFilteringOrigins = originsFiltered.length;
          } else {
            this.form.value.origins = [99999];
            this.isFilteringOrigins = this.origins.length;
          }
        }
        break;
      case 'destinies':
        let destiniesFiltered: number[] = [];
        for (let destiny of filters) {
          if (destiny.checked) destiniesFiltered.push(destiny.value);
        }
        if (destiniesFiltered.length >= this.destinies.length) {
          this.form.value.destinies = [];
          this.isFilteringDestinies = this.destinies.length;
        } else {
          if (destiniesFiltered.length > 0) {
            this.form.value.destinies = destiniesFiltered;
            this.isFilteringDestinies = destiniesFiltered.length;
          } else {
            this.form.value.destinies = ["99999"];
            this.isFilteringDestinies = this.destinies.length;
          }
        }
        break;
      case 'datesSend':
        let datesSendFiltered: number[] = [];
        for (let dateSend of filters) {
          if (dateSend.checked) datesSendFiltered.push(dateSend.id);
        }
        if (datesSendFiltered.length >= this.datesSend.length) {
          this.form.value.datesSend = [];
          this.isFilteringDatesSend = this.datesSend.length;
        } else {
          if (datesSendFiltered.length > 0) {
            this.form.value.datesSend = datesSendFiltered;
            this.isFilteringDatesSend = datesSendFiltered.length;
          } else {
            this.form.value.datesSend = [99999];
            this.isFilteringDatesSend = this.datesSend.length;
          }
        }
        break;
      case 'datesReceive':
        let datesReceiveFiltered: number[] = [];
        for (let dateReceive of filters) {
          if (dateReceive.checked) datesReceiveFiltered.push(dateReceive.id);
        }
        if (datesReceiveFiltered.length >= this.datesReceive.length) {
          this.form.value.datesReceive = [];
          this.isFilteringDatesReceive = this.datesReceive.length;
        } else {
          if (datesReceiveFiltered.length > 0) {
            this.form.value.datesReceive = datesReceiveFiltered;
            this.isFilteringDatesReceive = datesReceiveFiltered.length;
          } else {
            this.form.value.datesReceive = [99999];
            this.isFilteringDatesReceive = this.datesReceive.length;
          }
        }
        break;
    }
    this.lastUsedFilter = filterType;
    let flagApply = true;
    this.searchInContainer(this.sanitize(this.getFormValueCopy()), flagApply);
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
      clearTimeout(this.requestTimeout)
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
    this.datesSendSelected = this.form.value.datesSend;
    this.datesReceiveSelected = this.form.value.datesReceive;
    this.productReferencePatternSelected = this.form.value.productReferencePattern;
    this.orderbySelected = this.form.value.orderby;
  }

  private recoverFilters(){
    this.form.get("references").patchValue(this.referencesSelected, { emitEvent: false });
    this.form.get("types").patchValue( this.typesSelected, { emitEvent: false });
    this.form.get("origins").patchValue(this.originsSelected, { emitEvent: false });
    this.form.get("destinies").patchValue(this.destiniesSelected, { emitEvent: false });
    this.form.get("datesSend").patchValue(this.datesSendSelected, { emitEvent: false });
    this.form.get("datesReceive").patchValue(this.datesReceiveSelected, { emitEvent: false });
    this.form.get("productReferencePattern").patchValue(this.productReferencePatternSelected, { emitEvent: false });
    this.form.get("orderby").patchValue(this.orderbySelected, { emitEvent: false });
  }

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  /**
   * init selectForm controls
   */
  initSelectForm(): void {
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect", this.formBuilder.array(this.searchsInContainer.map(product => new FormControl(false))));
  }

  /**
   * search products in container by criteria
   * @param parameters - parameters to search
   * @param applyFilter - parameters to search
   */
  searchInContainer(parameters, applyFilter: boolean = false): void {
    if(applyFilter){
      parameters.pagination.page = 1;
    }
    this.intermediaryService.presentLoading();
    this.carrierService.postMovementsHistory(parameters).subscribe(searchsInContainer => {
      this.intermediaryService.dismissLoading();
      this.searchsInContainer = searchsInContainer;
      this.initSelectForm();
      this.dataSource = new MatTableDataSource<CarrierModel.Carrier>(this.searchsInContainer);
      let paginator: any = searchsInContainer;
      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.selectPage;
      this.paginator.lastPage = paginator.lastPage;

      //Reduce all filters
      if (this.lastUsedFilter != 'references') {
        let filteredReferences = searchsInContainer.data.filters['references'] as unknown as string[];
        for (let index in this.references) {
          this.references[index].hide = !filteredReferences.includes(this.references[index].value);
        }
        this.filterButtonReferences.listItems = this.references;
      }
      if (this.lastUsedFilter != 'types') {
        let filteredTypes = searchsInContainer.data.filters['types'] as unknown as string[];
        for (let index in this.types) {
          this.types[index].hide = !filteredTypes.includes(this.types[index].value);
        }
        this.filterButtonTypes.listItems = this.types;
      }
      if (this.lastUsedFilter != 'origins') {
        let filteredOrigins = searchsInContainer.data.filters['origins'] as unknown as string[];
        for (let index in this.origins) {
          this.origins[index].hide = !filteredOrigins.includes(this.origins[index].value);
        }
        this.filterButtonOrigins.listItems = this.origins;
      }
      if (this.lastUsedFilter != 'destinies') {
        let filteredDestinies = searchsInContainer.data.filters['destinies'] as unknown as string[];
        for (let index in this.destinies) {
          this.destinies[index].hide = !filteredDestinies.includes(this.destinies[index].value);
        }
        this.filterButtonDestinies.listItems = this.destinies;
      }
      if (this.lastUsedFilter != 'datesSend') {
        let filteredDatesSend = searchsInContainer.data.filters['datesSend'] as unknown as (string | number)[];
        for (let index in this.datesSend) {
          this.datesSend[index].hide = !filteredDatesSend.includes(this.datesSend[index].reference);
        }
        this.filterButtonDatesSend.listItems = this.datesSend;
      }
      if (this.lastUsedFilter != 'datesReceive') {
        let filteredDatesReceive = searchsInContainer.data.filters['datesReceive'] as unknown as string[];
        for (let index in this.datesReceive) {
          this.datesReceive[index].hide = !filteredDatesReceive.includes(this.datesReceive[index].value);
        }
        this.filterButtonDatesReceive.listItems = this.datesReceive;
      }
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
      Filesave.saveAs(blob, `${Date.now()}.xlsx`)
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess('Archivo descargado')
    }, error => console.log(error));
  }

  getCarriers(): void {
    this.intermediaryService.presentLoading();
    this.warehouseService.getIndex().then(observable=>{
      observable.subscribe(carriers => {
        this.whs = (<any>carriers.body).data;
        this.intermediaryService.dismissLoading();
      })
    })
  }

  getAllInfo():void{
    this.getParamsFromForm();
    let body: CallToService={
      warehouse:this.whsCode,
    };
    this.carrierService.postMovementsHistory(body).subscribe(sql_result => {
      this.results = sql_result;
      this.dataSource = this.results['historyList'];
      this.nStore = `${this.results['warehouse']['reference']}`;
      this.jOnStore = this.results['carriesInWarehouse'];
      this.jOnTI = this.results['goingCarries'];
      this.jOnTV = this.results['returnCarries'];
      this.listHistory = this.results['listHistory'];
    });
  }

  getMovementTypeFromService():void{
    this.carrierService.getMovementType().subscribe(result => {
      this.typeMovement = result;
    });
  }

  public setMovementType(type:any):string{
    let name = '';
    let typesMov = (this.typeMovement);
    typesMov.forEach(function(v){
      if(type === v['id'])
        name = v['name'];
    });
    return name;
  }

  getParamsFromForm(){
    this.whsCode = this.formVar.value['warehouse'];
    this.datemin = this.datePipe.transform(this.formVar.value['beginDate'],"yyyy-MM-dd");
    this.datemax = this.datePipe.transform(this.formVar.value['endDate'],"yyyy-MM-dd");
  }

  setForms():void{
    this.formVar = this.fb.group({
      warehouse: this.whsCode,
      beginDate: this.datemin,
      endDate: this.datemax
    });
  }

  onDate(type, event) {
    this.validateRangeDate();
    if (type === 'start') {
      this.endMinDate = new Date(event.value);
    }
  }

  validateRangeDate() {
    if (this.valueStarDate && this.valueEndDate && this.valueWarehouse) {
      return this.validateDates = this.valueStarDate.getTime() <= this.valueEndDate.getTime();
    }

    return this.validateDates = false;
  }
}
