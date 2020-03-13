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
import { InternalGroupsEnabledService } from '../../../services/src/lib/endpoint/internal-groups-enabled/internal-groups-enabled.service';


import { parse } from 'querystring';

@Component({
  selector: 'suite-internal-groups-enabled',
  templateUrl: './internal-groups-enabled.component.html',
  styleUrls: ['./internal-groups-enabled.component.scss']
})

export class InternalGroupsEnabledComponent implements OnInit {

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Campo Comercial', 'Habilitado'];
  columns = {};
  dataSource;
  toUpdate: FormGroup = this.formBuilder.group({
    internalGroups: this.formBuilder.array([])
  });

  @ViewChild('filterButtonInternalGroups') filterButtonInternalGroups: FilterButtonComponent;
  @ViewChild('filterButtonEnableds') filterButtonEnableds: FilterButtonComponent;

  isFilteringInternalGroups: number = 0;
  isFilteringEnableds: number = 0;

  /**Filters */
  internalGroups: Array<TagsInputOption> = [];
  enableds: Array<TagsInputOption> = [];

  /** Filters save **/
  internalGroupsSelected: Array<any> = [];
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
    internalGroups: [],
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
    private internalGroupsEnabledService: InternalGroupsEnabledService
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
      internalGroups: [],
      enableds: [],
      ordertypes: [],
    }
  }

  initForm() {
    this.form.patchValue({
      internalGroups: [],
      enableds: [],
      ordertypes: []
    })
  }

  private saveFilters(){
    this.internalGroupsSelected = this.form.value.internalGroups;
    this.enabledsSelected = this.form.value.enableds;
  }

  private recoverFilters(){
    this.form.get("internalGroups").patchValue(this.internalGroupsSelected, { emitEvent: false });
    this.form.get("enableds").patchValue(this.enabledsSelected, { emitEvent: false });
  }

  getFilters() {
    this.internalGroupsEnabledService.entities().subscribe(entities => {
      entities.ordertypes.forEach(element => {
          this.columns[element.name] = element.id;
      });
      this.updateFilterSourceInternalGroups(entities.internalGroups);
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
    this.internalGroupsEnabledService.index(form.value).subscribe(
      async (resp:any) => {
        this.toUpdate.removeControl("internalGroups");
        this.toUpdate.addControl("internalGroups", this.formBuilder.array(resp.results.map(internalGroup => {
          return this.formBuilder.group({
            id: internalGroup.id,
            name: internalGroup.name,
            selected: internalGroup.enabled && internalGroup.enabled.enabled ? internalGroup.enabled.enabled : false,
            internalGroupEnabled: internalGroup.enabled
          });
        })));
        this.dataSource = new MatTableDataSource<any>(resp.results);
        const paginator = resp.pagination;

        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.selectPage;
        this.paginator.lastPage = paginator.lastPage;
        await this.intermediaryService.dismissLoading()
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
      case 'internalGroups':
        let internalGroupsFiltered: string[] = [];
        for (let internalGroup of filters) {
          if (internalGroup.checked) internalGroupsFiltered.push(internalGroup.id);
        }
        if (internalGroupsFiltered.length >= this.internalGroups.length) {
          this.form.value.internalGroups = [];
          this.isFilteringInternalGroups = this.internalGroups.length;
        } else {
          if (internalGroupsFiltered.length > 0) {
            this.form.value.internalGroups = internalGroupsFiltered;
            this.isFilteringInternalGroups = internalGroupsFiltered.length;
          } else {
            this.form.value.internalGroups = [];
            this.isFilteringInternalGroups = this.internalGroups.length;
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
    if (this.lastUsedFilter !== 'internalGroups') {
      let filteredInternalGroups = entities['internalGroups'] as unknown as string[];
      for (let index in this.internalGroups) {
        this.internalGroups[index].hide = filteredInternalGroups.includes(this.internalGroups[index].value);
      }
      this.filterButtonInternalGroups.listItems = this.internalGroups;
    }
    if (this.lastUsedFilter !== 'enableds') {
      let filteredEnableds = entities['enableds'] as unknown as string[];
      for (let index in this.enableds) {
        this.enableds[index].hide = filteredEnableds.includes(this.enableds[index].value);
      }
      this.filterButtonEnableds.listItems = this.enableds;
    }
  }

  private updateFilterSourceInternalGroups(internalGroups: FiltersModel.InternalGroup[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("internalGroups").value;
    this.internalGroups = internalGroups.map(internalGroup => {
      internalGroup.value = internalGroup.name;
      internalGroup.checked = true;
      internalGroup.hide = false;
      return internalGroup;
    });

    if (value && value.length) {
      this.form.get("internalGroups").patchValue(value, { emitEvent: false });
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

  async update() {
    await this.intermediaryService.presentLoading();
    this.internalGroupsEnabledService.updateInternalGroups(this.toUpdate.value).subscribe(async result => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess(
          'Campos comerciales actualizadas con éxito'
        );
      },
      () => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess('Error actualizando campos comerciales');
      });
  }

  refreshTable() {
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getList(this.form);
    this.listenChanges();
  }

}
