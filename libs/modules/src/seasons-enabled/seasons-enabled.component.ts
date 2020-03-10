import { BehaviorSubject, of, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import {
  ProductsService,
  FiltersService,
  FiltersModel,
  InventoryService,
  TypesService,
  WarehouseService,
  WarehousesService,
  IntermediaryService,
  UsersService,
  PermissionsModel,
} from '@suite/services';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';

import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { FilterButtonComponent } from "../components/filter-button/filter-button.component";

import { PermissionsService } from '../../../services/src/lib/endpoint/permissions/permissions.service';
import { SeasonsEnabledService } from '../../../services/src/lib/endpoint/seasons-enabled/seasons-enabled.service';


import { parse } from 'querystring';




@Component({
  selector: 'suite-seasons-enabled',
  templateUrl: './seasons-enabled.component.html',
  styleUrls: ['./seasons-enabled.component.scss']
})

export class SeasonsEnabledComponent implements OnInit {

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Temporada', 'Habilitada'];
  columns = {};
  dataSource;
  toUpdate: FormGroup = this.formBuilder.group({
    seasons: this.formBuilder.array([])
  });

  @ViewChild('filterButtonSeasons') filterButtonSeasons: FilterButtonComponent;
  @ViewChild('filterButtonEnableds') filterButtonEnableds: FilterButtonComponent;

  isFilteringSeasons: number = 0;
  isFilteringEnableds: number = 0;

  /**Filters */
  seasons: Array<TagsInputOption> = [];
  enableds: Array<TagsInputOption> = [];

  /** Filters save **/
  seasonsSelected: Array<any> = [];
  enabledsSelected: Array<any> = [];

  groups: Array<TagsInputOption> = [];
  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagerValues = [20, 50, 100];
  currentPageFilter = {
    order:{
      type: '',
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
      type: '2',
      order: "DESC"
    })
  });

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
    private seasonsEnabledService: SeasonsEnabledService
  ) {
  }

  ngOnInit(){
    this.initEntity()
    this.initForm()
    this.getFilters()
    this.getList(this.form)
    this.listenChanges()
    this.lastUsedFilter = '';
  }

  listenChanges() {
    let previousPageSize = this.form.value.pagination.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      this.saveFilters();
      /**true if only change the number of results */
      let flag = previousPageSize === page.pageSize;
      previousPageSize = page.pageSize;
      this.form.get("pagination").patchValue({
        limit: page.pageSize,
        page: flag ? page.pageIndex : 1
      });
      this.recoverFilters();
      this.getList(this.form)
    });
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.intermediaryService.presentLoading('Cargando Filtros...').then(() => {
        if (sort.direction == '') {
        this.form.get("orderby").patchValue({
          type: '2',
          order: "DESC"
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

  private saveFilters(){
    this.seasonsSelected = this.form.value.seasons;
    this.enabledsSelected = this.form.value.enableds;
  }

  private recoverFilters(){
    this.form.get("seasons").patchValue(this.seasonsSelected, { emitEvent: false });
    this.form.get("enableds").patchValue(this.enabledsSelected, { emitEvent: false });
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
      }, 0);
    })
  }

  async getList(form?: FormGroup){
    await this.intermediaryService.presentLoading();
    this.seasonsEnabledService.index(form.value).subscribe(
      (resp:any) => {
        this.toUpdate.removeControl("seasons");
        this.toUpdate.addControl("seasons", this.formBuilder.array(resp.results.map(season => {
          return this.formBuilder.group({
            id: season.id,
            name: season.name,
            selected: season.reception && season.reception.enabled ? season.reception.enabled : false,
            seasonReception: season.reception
          });
        })));
        this.dataSource = new MatTableDataSource<any>(resp.results);
        const paginator = resp.pagination;

        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.selectPage;
        this.paginator.lastPage = paginator.lastPage;

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
          if (season.checked) seasonsFiltered.push(season.id);
        }
        if (seasonsFiltered.length >= this.seasons.length) {
          this.form.value.seasons = [];
          this.isFilteringSeasons = this.seasons.length;
        } else {
          if (seasonsFiltered.length > 0) {
            this.form.value.seasons = seasonsFiltered;
            this.isFilteringSeasons = seasonsFiltered.length;
          } else {
            this.form.value.seasons = [];
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
      if(enabled.name == "1"){
        enabled.name = "1";
        enabled.value = "Si";
      }else{
        enabled.id = 0;
        enabled.name = "0";
        enabled.value = "No";
      }
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

  update() {
    let observable = new Observable(observer => observer.next());
    this.seasonsEnabledService.updateSeasons(this.toUpdate.value).subscribe(async result => {});
    this.intermediaryService.presentLoading();
    observable.subscribe(
      () => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess(
          'Temporada actualizada con exito'
        );
        this.getList(this.form);
      },
      () => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess('Error actualizando temporada');
      }
    );
  }

  refreshTable() {
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getList(this.form);
    this.listenChanges();
  }

}
