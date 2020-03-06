import { BehaviorSubject, of, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import * as Filesave from 'file-saver';
import {
  ProductModel,
  ProductsService,
  FiltersService,
  FiltersModel,
  InventoryService,
  InventoryModel,
  TypesService,
  WarehouseService,
  WarehousesService,
  IntermediaryService,
  UsersService,
  PermissionsModel,
} from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { validators } from '../utils/validators';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { FilterButtonComponent } from "../components/filter-button/filter-button.component";
import { map, catchError, filter } from 'rxjs/operators';
import { PermissionsService } from '../../../services/src/lib/endpoint/permissions/permissions.service';
import { SeasonsEnabledService } from '../../../services/src/lib/endpoint/seasons-enabled/seasons-enabled.service';
import { PredistributionModel } from '../../../services/src/models/endpoints/Predistribution';
import Predistribution = PredistributionModel.Predistribution;
import { SelectionModel } from '@angular/cdk/collections';
import { PredistributionsService } from '../../../services/src/lib/endpoint/predistributions/predistributions.service';
import * as _ from 'lodash';
import { parse } from 'querystring';




@Component({
  selector: 'suite-seasons-enabled',
  templateUrl: './seasons-enabled.component.html',
  styleUrls: ['./seasons-enabled.component.scss']
})

export class SeasonsEnabledComponent implements OnInit, AfterViewInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Temporada', 'Habilitada'];
  // displayedColumns: string[] = [];
  columns = {};
  dataSourceOriginal;
  dataSource;
  toUpdate: FormGroup = this.formBuilder.group({
    enableds: this.formBuilder.array([])
  });
  selectionPredistribution = new SelectionModel<Predistribution>(true, []);
  selectionReserved = new SelectionModel<Predistribution>(true, []);
  @ViewChild('filterButtonSeasons') filterButtonSeasons: FilterButtonComponent;
  @ViewChild('filterButtonEnableds') filterButtonEnableds: FilterButtonComponent;


  isFilteringSeasons: number = 0;
  isFilteringEnableds: number = 0;

  /**Filters */
  seasons: Array<TagsInputOption> = [];
  enableds: Array<TagsInputOption> = [];

  groups: Array<TagsInputOption> = [];
  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  // pagerValues = [50, 100, 1000];
  pagerValues = [10, 20, 80];
  currentPageFilter = {
    order:{type: '',
    direction:''
  }
  };
  form: FormGroup = this.formBuilder.group({
    seasons: [],
    enableds: [],
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: '3',
      order: "ASC"
    })
  });
  length: any;

  isShow = false;
  seconds:any = {
    GlobalVariable_value: ''
  };


  constructor(
    private intermediaryService: IntermediaryService,
    private warehouseService: WarehouseService,
    private warehousesService: WarehousesService,
    private typeService: TypesService,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private inventoryServices: InventoryService,
    private filterServices: FiltersService,
    private productsService: ProductsService,
    private modalController: ModalController,
    private printerService: PrinterService,
    private usersService: UsersService,
    private permisionService: PermissionsService,
    private seasonsEnabledService: SeasonsEnabledService,
    private predistributionsService: PredistributionsService
  ) {
  }

  getSecondsAvelon(){
    this.intermediaryService.presentLoading('Actualizando Avelon').then(() => {
      this.seasonsEnabledService.GetSecondAvelon().subscribe(result => {
        let seconds = parseInt(result.GlobalVariable_value)/60
        seconds.toString();
        this.seconds.GlobalVariable_value = seconds ;
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess("Actualizacion exitosa.")
      },()=>{
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError("Actualizacion Fallida.");
      });
    });
  }

  notifyAvelonPredistribution(){
    this.intermediaryService.presentLoading('Notificando a avelon').then(() => {
      let body = {
        "force": true
      };
      this.seasonsEnabledService.notifyAvelonPredistribution(body).subscribe(result => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess("Notificacion enviada con exito.")
      },()=>{
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError("Notifiacion fallida.");
      });
    });
  }


  insertSecond(){
    this.intermediaryService.presentLoading('Actualizando tiempo de avelon').then(() => {
      let value = parseInt(this.seconds.GlobalVariable_value)*60;
      value.toString();
      let body = {
        "value": value
      };
      this.seasonsEnabledService.updateSecondAvelon(body).subscribe(result => {
        this.intermediaryService.dismissLoading();
        this.isShow = false;
        this.intermediaryService.presentToastSuccess("Actualizacion realizada con exito.")
      },()=>{
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError("Actualizacion fallida.");
      });
    });
  }


  showForm(){
    this.isShow = true;
  }

  ngOnInit(){
    this.initEntity()
    this.initForm()
    this.getFilters()
    this.getList(this.form)
    this.listenChanges()
    this.getSecondsAvelon();
  }
  listenChanges() {
    let previousPageSize = this.form.value.pagination.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      /**true if only change the number of results */
      let flag = previousPageSize === page.pageSize;
      previousPageSize = page.pageSize;
      this.form.get("pagination").patchValue({
        limit: page.pageSize,
        page: flag ? page.pageIndex : 1
      });
      this.getList(this.form)
    });
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.intermediaryService.presentLoading('Cargando Filtros...').then(() => {
        if (sort.direction == '') {
        this.form.get("orderby").patchValue({
          type: '1',
          order: "ASC"
        });
      } else {
        this.form.get("orderby").patchValue({
          type: this.columns[sort.active],
          order: sort.direction.toUpperCase()
        });
      }
        this.getList(this.form);
      });
    });
    this.intermediaryService.presentLoading('Cargando Filtros...').then(() => {
      this.getList(this.form);
    });
  }
  initEntity() {
    this.entities = {
      seasons: [],
      enableds: [],
      ordertypes: [],
    }
  }
  initForm() {
    this.form.patchValue({
      seasons: [],
      enableds: [],
      ordertypes: []
    })
  }


  ngAfterViewInit(): void {
    let This = this;
    console.log(this.dataSource);
    // setTimeout(() => {
    //   if(!!This.sort && !!this.dataSource)
    //     this.dataSource.sort = This.sort;
    //   if(!!This.paginator && !!this.dataSource)
    //     this.dataSource.paginator = This.paginator;
    // }, 2000)
  }

  getRangeLabel = (page: number, pageSize: number, length: number) =>  {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    return `${length} resultados / pág. ${page + 1} de ${Math.ceil(length / pageSize)}`;
  };

  isAllSelectedPredistribution() {
    if (this.dataSource) {
      const numSelected = this.selectionPredistribution.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    return false
  }

  isAllSelectedReserved() {
    if (this.dataSource) {
      const numSelected = this.selectionReserved.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    return false
  }

  predistributionToggle() {
    if (this.isAllSelectedPredistribution()) {
      this.dataSource.data.forEach(row => {
        row.distribution = false;
      });

      this.selectionPredistribution.clear()
    } else {
      this.dataSource.data.forEach(row => {
        row.distribution = true;
        this.selectionPredistribution.select(row);
      });
    }
  }

  reservedToggle() {
    if (this.isAllSelectedReserved()) {
      this.dataSource.data.forEach(row => {
        row.reserved = false;
      });
      this.selectionReserved.clear();
    } else {
      this.dataSource.data.forEach(row => {
        row.reserved = true;
        this.selectionReserved.select(row);
      });
    }
  }

  checkboxLabelPredistribution(row?): string {
    if (!row) {
      return `${this.isAllSelectedPredistribution() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionPredistribution.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  checkboxLabelReserved(row?): string {
    if (!row) {
      return `${this.isAllSelectedReserved() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionReserved.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  changePredistribution(row, position: number) {
    this.dataSource.data[position].distribution = !this.dataSource.data[position].distribution;
  }

  changeReserved(row, position: number) {
    this.dataSource.data[position].reserved = !this.dataSource.data[position].reserved;
  }

  async savePredistributions() {
    let list = [];

    this.dataSource.data.forEach((dataRow, index) => {
      if (this.dataSourceOriginal.data[index].distribution !== dataRow.distribution ||
        this.dataSourceOriginal.data[index].reserved !== dataRow.reserved) {
        list.push({
          distribution: !!dataRow.distribution,
          reserved: !!dataRow.reserved,
          modelId: dataRow.model.id,
          sizeId: dataRow.size.id,
          warehouseId: dataRow.warehouse.id,
          expeditionLineId: dataRow.expeditionLineId
        })
      }
    });


    this.intermediaryService.presentLoading();

    await this.predistributionsService.updateBlockReserved(list).subscribe((data) => {
      this.intermediaryService.presentToastSuccess("Actualizado predistribuciones correctamente");
      this.initEntity();
      this.initForm();
      this.getFilters();
      this.getList(this.form);
      this.listenChanges();
    }, (error) => {
      this.intermediaryService.presentToastError("Error Actualizado predistribuciones");
      this.intermediaryService.dismissLoading();
    }, () => {
      this.intermediaryService.dismissLoading();
    });
  }
  getFilters() {
    this.seasonsEnabledService.entities().subscribe(entities => {
      entities.ordertypes.forEach(element => {
          this.columns[element.name] = element.id;
      });
      this.updateFilterSourceSeasons(entities.seasons);
      this.updateFilterSourceEnableds(entities.enableds);
      this.updateFilterSourceOrdertypes(entities.ordertypes);
      this.reduceFilters(entities);
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
        // this.form.get("warehouses").patchValue([warehouse.id], { emitEvent: false });
        // this.form.get("orderby").get("type").patchValue("" + TypesService.ID_TYPE_ORDER_PRODUCT_DEFAULT, { emitEvent: false });
      }, 0);
    })

  }
  async getList(form?: FormGroup){
    await this.intermediaryService.presentLoading();
    this.seasonsEnabledService.index(form.value).subscribe(
      (resp:any) => {
        this.dataSource = new MatTableDataSource<any>(resp.results);
        const paginator = resp.pagination;

        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.selectPage;
        this.paginator.lastPage = paginator.lastPage;
        this.selectionPredistribution.clear();
        this.selectionReserved.clear();

        this.dataSource.data.forEach(row => {
        if (row.distribution) {
          this.selectionPredistribution.select(row);
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

  applyFilters(filtersResult, filterType) {
    const filters = filtersResult.filters;
    switch (filterType) {
      case 'seasons':
        let seasonsFiltered: string[] = [];
        for (let season of filters) {
          if (season.checked) seasonsFiltered.push(season.name);
        }
        if (seasonsFiltered.length >= this.seasons.length) {
          this.form.value.productReferencePattern = [];
          this.isFilteringSeasons = this.seasons.length;
        } else {
          if (seasonsFiltered.length > 0) {
            this.form.value.productReferencePattern = seasonsFiltered;
            this.isFilteringSeasons = seasonsFiltered.length;
          } else {
            this.form.value.productReferencePattern = [];
            this.isFilteringSeasons = this.seasons.length;
          }
        }
        break;
      case 'enableds':
        let enabledsFiltered: string[] = [];
        for (let enabled of filters) {
          if (enabled.checked) enabledsFiltered.push(enabled.id);
        }
        if (enabledsFiltered.length >= this.enableds.length) {
          this.form.value.enableds = [];
          this.isFilteringEnableds = this.enableds.length;
        } else {
          if (enabledsFiltered.length > 0) {
            this.form.value.enableds = enabledsFiltered;
            this.isFilteringEnableds = enabledsFiltered.length;
          } else {
            this.form.value.enableds = [];
            this.isFilteringEnableds = this.enableds.length;
          }
        }

        break;
    }
    this.lastUsedFilter = filterType;
    this.getList(this.form);
  }

  private reduceFilters(entities){
    if (this.lastUsedFilter !== 'seasons') {
      let filteredSeasons = entities['seasons'] as unknown as string[];
      for (let index in this.seasons) {
        this.seasons[index].hide = filteredSeasons.includes(this.seasons[index].value);
      }
      this.filterButtonSeasons.listItems = this.seasons;
    }
    if (this.lastUsedFilter !== 'enableds') {
      let filteredEnableds = entities['enableds'] as unknown as string[];
      for (let index in this.enableds) {
        this.enableds[index].hide = filteredEnableds.includes(this.enableds[index].value);
      }
      this.filterButtonEnableds.listItems = this.enableds;
    }
  }

  private updateFilterSourceSeasons(seasons: FiltersModel.Season[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("seasons").value;
    this.seasons = seasons.map(season => {
      season.value = season.name;
      season.checked = true;
      season.hide = false;
      return season;
    });

    if (value && value.length) {
      this.form.get("seasons").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceEnableds(enableds: FiltersModel.Enabled[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("enableds").value;
    this.enableds = enableds.map(enabled => {
      enabled.id = <number>(<unknown>enabled.reference);
      enabled.name = enabled.reference;
      enabled.value = enabled.name;
      enabled.checked = true;
      enabled.hide = false;
      return enabled;
    });

    if (value && value.length) {
      this.form.get("enableds").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceOrdertypes(ordertypes: FiltersModel.Group[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("orderby").get("type").value;
    this.groups = ordertypes;
    this.form.get("orderby").get("type").patchValue(value, { emitEvent: false });
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  // new
  public changeStatusBlocked( event:MatCheckboxChange, row) {
    this.dataSource.data.forEach(function(value){
      if(value.expeditionLineId === row.expeditionLineId) {
        value.distribution = event.checked;
      }
    });
  }
  public  isCheckedStatusBlocked( element) {
    return element.distribution;
  }
  public changeStatusBlockedAll( event:MatCheckboxChange) {
    this.dataSource.data.forEach(function(value){
      value.distribution = event.checked;
    });
  }
  public  isCheckedStatusBlockedAll() {
    let result = true;
    this.dataSource.data.forEach(function(value){
      result = result && value.distribution;
    });
    return result;
  }
  // reserved
  public changeStatusReserved(event:MatCheckboxChange, row) {
    this.dataSource.data.forEach(function(value){
      if(value.expeditionLineId === row.expeditionLineId) {
        value.distribution = !event.checked;
      }
    });
  }

  public isCheckedStatusReserved( element) {
    return !element.distribution;
  }

  public changeStatusReservedAll( event:MatCheckboxChange) {
    this.dataSource.data.forEach(function(value){
      value.distribution = !event.checked;
    });
  }
  public  isCheckedStatusReservedAll() {
    let result = true;
    this.dataSource.data.forEach(function(value){
      result = result && !value.distribution;
    });
    return result;
  }

  refreshTable() {
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getList(this.form);
    this.listenChanges();
  }

}
