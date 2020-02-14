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
  warehouse:number,
  pagination:any,
  orderby:any,
  filters:any
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
  previousProductReferencePattern = null;
  productReferencePattern = null;
  pauseListenFormChange = false;
  permision:boolean;

  displayedColumns: string[] = ['reference', 'type', 'origin', 'destiny', 'dateSend', 'dateReceive'];
  pagerValues = [20, 50, 100];

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

  lastUsedFilter: string = '';
  isMobileApp: boolean = false;

  //For sorting
  lastOrder = [true, true, true, true, true, true];

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
      order: "DESC"
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
          this.showArrow(0, false);
        }
        else {
          this.form.value.orderby = { order: "ASC", type: 1 };
          this.showArrow(0, true);
        }
        this.lastOrder[0] = !this.lastOrder[0];
        break;
      }
      case 'type': {
        if (this.lastOrder[1]) {
          this.form.value.orderby = { order: "DESC", type: 2 };
          this.showArrow(1, false);
        }
        else {
          this.form.value.orderby = { order: "ASC", type: 2 };
          this.showArrow(1, true);
        }
        this.lastOrder[1] = !this.lastOrder[1];
        break;
      }
      case 'origin': {
        if (this.lastOrder[2]) {
          this.form.value.orderby = { order: "DESC", type: 3 };
          this.showArrow(2, false);
        }
        else {
          this.form.value.orderby = { order: "ASC", type: 3 };
          this.showArrow(2, true);
        }
        this.lastOrder[2] = !this.lastOrder[2];
        break;
      }
      case 'destiny': {
        if (this.lastOrder[3]) {
          this.form.value.orderby = { order: "DESC", type: 4 };
          this.showArrow(3, false);
        }
        else {
          this.form.value.orderby = { order: "ASC", type: 4 };
          this.showArrow(3, true);
        }
        this.lastOrder[3] = !this.lastOrder[3];
        break;
      }
      case 'dateSend': {
        if (this.lastOrder[4]) {
          this.form.value.orderby = { order: "DESC", type: 5 };
          this.showArrow(4, false);
        }
        else {
          this.form.value.orderby = { order: "ASC", type: 5 };
          this.showArrow(4, true);
        }
        this.lastOrder[4] = !this.lastOrder[4];
        break;
      }
      case 'dateReceive': {
        if (this.lastOrder[5]) {
          this.form.value.orderby = { order: "DESC", type: 6 };
          this.showArrow(5, false);
        }
        else {
          this.form.value.orderby = { order: "ASC", type: 6 };
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
      // if (object[key] === null || object[key] === "") {
      //   delete object[key];
      // }
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
      case 'datesSend':
        let datesSendFiltered: number[] = [];
        for (let dateSend of filters) {
          if (dateSend.checked) datesSendFiltered.push(dateSend);
        }
        if (datesSendFiltered.length >= this.datesSend.length) {
          if(datesSendFiltered.length > this.datesSend.length){
            this.form.value.datesSend = this.datesSend;
            this.isFilteringDatesSend = this.datesSend.length;
          }else{
            this.form.value.datesSend = datesSendFiltered;
            this.isFilteringDatesSend = datesSendFiltered.length;
          }
        } else {
          if (datesSendFiltered.length > 0) {
            this.form.value.datesSend = datesSendFiltered;
            this.isFilteringDatesSend = datesSendFiltered.length;
          } else {
            this.form.value.datesSend = null;
            this.isFilteringDatesSend = 0;
          }
        }
        break;
      case 'datesReceive':
        let datesReceiveFiltered: number[] = [];
        for (let dateReceive of filters) {
          if (dateReceive.checked) datesReceiveFiltered.push(dateReceive);
        }
        if (datesReceiveFiltered.length >= this.datesReceive.length) {
          if(datesReceiveFiltered.length > this.datesReceive.length){
            this.form.value.datesReceive = this.datesReceive;
            this.isFilteringDatesReceive = this.datesReceive.length;
          }else{
            this.form.value.datesReceive = datesReceiveFiltered;
            this.isFilteringDatesReceive = datesReceiveFiltered.length;
          }
        } else {
          if (datesReceiveFiltered.length > 0) {
            this.form.value.datesReceive = datesReceiveFiltered;
            this.isFilteringDatesReceive = datesReceiveFiltered.length;
          } else {
            this.form.value.datesReceive = null;
            this.isFilteringDatesReceive = 0;
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
      clearTimeout(this.requestTimeout);
      /**it the change of the form is in reference launch new timeout with request in it */
      if (this.productReferencePattern != this.previousProductReferencePattern) {
        /**Just need check the vality if the change happens in the reference */
        if (this.form.valid) {
          this.requestTimeout = setTimeout(() => {
            this.searchInContainer(this.sanitize(this.getFormValueCopy()));
          }, 1000);
        }
      } else {
        /**reset the paginator to the 0 page */
        this.searchInContainer(this.sanitize(this.getFormValueCopy()));
      }
      /**assign the current reference to the previous reference */
      this.previousProductReferencePattern = this.productReferencePattern;
    });
  }

  private saveFilters(){
    this.referencesSelected = this.form.value.references;
    this.typesSelected = this.form.value.types;
    this.originsSelected = this.form.value.origins;
    this.destiniesSelected = this.form.value.destinies;
    this.datesSendSelected = this.form.value.datesSend;
    this.datesReceiveSelected = this.form.value.datesReceive;
    this.orderbySelected = this.form.value.orderby;
  }

  private recoverFilters(){
    this.form.get("references").patchValue(this.referencesSelected, { emitEvent: false });
    this.form.get("types").patchValue( this.typesSelected, { emitEvent: false });
    this.form.get("origins").patchValue(this.originsSelected, { emitEvent: false });
    this.form.get("destinies").patchValue(this.destiniesSelected, { emitEvent: false });
    this.form.get("datesSend").patchValue(this.datesSendSelected, { emitEvent: false });
    this.form.get("datesReceive").patchValue(this.datesReceiveSelected, { emitEvent: false });
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
    this.selectedForm.addControl("toSelect", this.formBuilder.array(this.searchsInContainer.map(carrierMove => new FormControl(false))));
  }

  /**
   * search in container by criteria
   * @param parameters - parameters to search
   * @param applyFilter - parameters to search
   */
  searchInContainer(parameters, applyFilter: boolean = false): void {
    this.intermediaryService.presentLoading();
    if(applyFilter){
      parameters.pagination.page = 1;
    }
    let body: CallToService={
      warehouse: this.whsCode,
      pagination: parameters.pagination,
      orderby: parameters.orderby,
      filters: {
        references: parameters.references,
        types: parameters.types,
        origins: parameters.origins,
        destinies: parameters.destinies,
        datesSend: parameters.datesSend,
        datesReceive: parameters.datesReceive,
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
    if(this.isFilteringDatesSend == this.datesSend.length) {
      body.filters.datesSend = null;
    }
    if(this.isFilteringDatesReceive == this.datesReceive.length){
      body.filters.datesReceive = null;
    }

    this.carrierService.postMovementsHistory(body).subscribe(sql_result => {
      this.results = sql_result;
      this.dataSource = this.results['historyList'];
      this.nStore = `${this.results['warehouse']['reference']}`;
      this.jOnStore = this.results['carriesInWarehouse'];
      this.jOnTI = this.results['goingCarries'];
      this.jOnTV = this.results['returnCarries'];
      this.listHistory = this.results['listHistory'];
      this.initSelectForm();
      let paginator: any = this.results['pagination'];
      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.selectPage;
      this.paginator.lastPage = paginator.lastPage;
      this.getFilters();

        //Reduce all filters
        if (this.lastUsedFilter == 'references' && body.filters.references) {
          let filteredReferences = body.filters['references'];
          for (let index in this.references) {
            if(!filteredReferences.find(f => f.value == this.references[index].value)){
              this.references[index].checked = false;
            }
          }
          this.filterButtonReferences.listItems = this.references;
        }
        if (this.lastUsedFilter == 'types' && body.filters.types) {
          let filteredTypes = body.filters['types'];
          for (let index in this.types) {
            if(!filteredTypes.find(f => f.value == this.types[index].value)){
              this.types[index].checked = false;
            }
          }
          this.filterButtonTypes.listItems = this.types;
        }
        if (this.lastUsedFilter == 'origins' && body.filters.origins) {
          let filteredOrigins = body.filters['origins'];
          for (let index in this.origins) {
            if(!filteredOrigins.find(f => f.value == this.origins[index].value)){
              this.origins[index].checked = false;
            }
          }
          this.filterButtonOrigins.listItems = this.origins;
        }
        if (this.lastUsedFilter == 'destinies' && body.filters.destinies) {
          let filteredDestinies = body.filters['destinies'];
          for (let index in this.destinies) {
            if(!filteredDestinies.find(f => f.value == this.destinies[index].value)){
              this.destinies[index].checked = false;
            }
          }

          this.filterButtonDestinies.listItems = this.destinies;
        }
        if (this.lastUsedFilter == 'datesSend' && body.filters.datesSend) {
          let filteredDatesSend = body.filters['datesSend'];
          for (let index in this.datesSend) {
            if(!filteredDatesSend.find(f => f.value == this.datesSend[index].value)){
              this.datesSend[index].checked = false;
            }
          }

          this.filterButtonDatesSend.listItems = this.datesSend;
        }
        if (this.lastUsedFilter == 'datesReceive' && body.filters.datesReceive) {
          let filteredDatesReceive = body.filters['datesReceive'];
          for (let index in this.datesReceive) {
            if(!filteredDatesReceive.find(f => f.value == this.datesReceive[index].value)){
              this.datesReceive[index].checked = false;
            }
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
      this.intermediaryService.dismissLoading();
    }, () => {
      this.intermediaryService.dismissLoading();
    });
  }

  /**
   * get all filters to fill the selects
   */
  getFilters(stable: boolean = false): void {

    this.updateFilterSourceReferences(this.listHistory, stable);
    this.updateFilterSourceTypes(this.listHistory, stable);
    this.updateFilterSourceOrigins(this.listHistory, stable);
    this.updateFilterSourceDestinies(this.listHistory, stable);
    this.updateFilterSourceDatesSend(this.listHistory, stable);
    this.updateFilterSourceDatesReceive(this.listHistory, stable);
    this.updateFilterSourceIds(this.listHistory, stable);

    if(stable) {
      this.isFilteringReferences = this.form.value.references.length;
      this.isFilteringTypes = this.form.value.types.length;
      this.isFilteringOrigins = this.form.value.origins.length;
      this.isFilteringDestinies = this.form.value.destinies.length;
      this.isFilteringDatesSend = this.form.value.datesSend.length;
      this.isFilteringDatesReceive = this.form.value.datesReceive.length;
    }
  }

  private updateFilterSourceReferences(listHistory: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let referencesList: any[] = [];
    listHistory.forEach(key => {
      if(!referencesList.find( f => f.value == key['reference'])) {
        referencesList.push({value: key['reference']});
      }
    });
    if(stable == true) {
      this.references = referencesList;
      this.form.get("references").patchValue(this.references, {emitEvent: false});
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceTypes(listHistory: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let typesList: any[] = [];
    listHistory.forEach(key => {
      if(!typesList.find( f => f.value == key['type'])) {
        typesList.push({value: key['type'].name});
      }
    });
    if(stable == true) {
      this.types = typesList;
      this.form.get("types").patchValue(this.types, {emitEvent: false});
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceOrigins(listHistory: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let originsList: any[] = [];
    listHistory.forEach(key => {
      if(!originsList.find( f => f.value == key['originWarehouse'])){
        originsList.push({value: key['originWarehouse']});
      }
    });
    if(stable == true) {
      this.origins = originsList;

      this.form.get("origins").patchValue(this.origins, {emitEvent: false});
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceDestinies(listHistory: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let destiniesList: any[] = [];
    listHistory.forEach(key => {
      if(!destiniesList.find( f => f.value == key['destinyWarehouse'])) {
        destiniesList.push({value: key['destinyWarehouse']});
      }
    });
    if(stable == true) {
      this.destinies = destiniesList;

      this.form.get("destinies").patchValue(this.destinies, {emitEvent: false});
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceDatesSend(listHistory: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let datesSendList: any[] = [];
    listHistory.forEach(key => {
      if(!datesSendList.find( f => f.value == key['dateSend'])) {
        datesSendList.push({value: this.dateTimeParserService.dateTime(key['dateSend'])});
      }
    });
    if(stable == true) {
      this.datesSend = datesSendList;

      this.form.get("datesSend").patchValue(this.datesSend, {emitEvent: false});
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceDatesReceive(listHistory: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let datesReceiveList: any[] = [];
    listHistory.forEach(key => {
      if(!datesReceiveList.find( f => f.value == key['dateReceive'])) {
        datesReceiveList.push({value: this.dateTimeParserService.dateTime(key['dateReceive'])});
      }
    });
    if(stable == true) {
      this.datesReceive = datesReceiveList;

      this.form.get("datesReceive").patchValue(this.datesReceive, {emitEvent: false});
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceIds(listHistory: any, stable: boolean) {
    this.pauseListenFormChange = true;
    let idsList: any[] = [];
    listHistory.forEach(key => {
      if(!idsList.find( f => f.value == key['id'])) {
        idsList.push({value: key['id']});
      }
    });
    if(stable){
      this.previousProductReferencePattern = idsList;
    }
    this.productReferencePatternSelected = idsList;
    this.productReferencePattern = idsList;

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  // TODO METODO LLAMAR ARCHIVO EXCELL
  /**
   * @description Eviar parametros y recibe un archivo excell
   */
  async fileExcell() {
    this.intermediaryService.presentLoading('Descargando Archivo Excel');
    const formToExcel = this.sanitize(this.getFormValueCopy());
    if (formToExcel.pagination) {
      formToExcel.pagination.page = 1;
      formToExcel.pagination.limit = 0;
      formToExcel.warehouse = this.whsCode;
    }
    this.carrierService.getFileExcell(formToExcel).pipe(
      catchError(error => of(error)),
      // map(file => file.error.text)
    ).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      Filesave.saveAs(blob, `${Date.now()}.xlsx`);
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

  async getAllInfo() {
    this.getParamsFromForm();
    let body: CallToService={
      warehouse: this.whsCode,
      pagination: null,
      orderby: null,
      filters: null
    };
    this.intermediaryService.presentLoading();
    await this.carrierService.postMovementsHistory(body).subscribe(sql_result => {
      this.results = sql_result;
      this.dataSource = this.results['historyList'];
      this.nStore = `${this.results['warehouse']['reference']}`;
      this.jOnStore = this.results['carriesInWarehouse'];
      this.jOnTI = this.results['goingCarries'];
      this.jOnTV = this.results['returnCarries'];
      this.listHistory = this.results['listHistory'];
      this.initSelectForm();
      let paginator: any = this.results['pagination'];
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
        }

        this.filterButtonOrigins.listItems = this.origins;
      }
      if (this.lastUsedFilter != 'destinies') {
        for (let index in this.destinies) {
          this.destinies[index].hide = false;
          this.destinies[index].checked = true;
        }

        this.filterButtonDestinies.listItems = this.destinies;
      }
      if (this.lastUsedFilter != 'datesSend') {
        for (let index in this.datesSend) {
          this.datesSend[index].hide = false;
          this.datesSend[index].checked = true;
        }

        this.filterButtonDatesSend.listItems = this.datesSend;
      }
      if (this.lastUsedFilter != 'datesReceive') {
        for (let index in this.datesReceive) {
          this.datesReceive[index].hide = false;
          this.datesReceive[index].checked = true;
        }
        this.filterButtonDatesReceive.listItems = this.datesReceive;
      }
    });
    this.intermediaryService.dismissLoading();
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
