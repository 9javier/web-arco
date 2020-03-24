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
import { BrandsEnabledReceptionService } from '../../../services/src/lib/endpoint/brands-enabled-reception/brands-enabled-reception.service';
import { parse } from 'querystring';

@Component({
  selector: 'suite-brands-enabled-reception',
  templateUrl: './brands-enabled-reception.component.html',
  styleUrls: ['./brands-enabled-reception.component.scss']
})

export class BrandsEnabledReceptionComponent implements OnInit {

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Marca', 'Habilitada'];
  columns = {};
  dataSource;
  toUpdate: FormGroup = this.formBuilder.group({
    brands: this.formBuilder.array([])
  });

  @ViewChild('filterButtonBrands') filterButtonBrands: FilterButtonComponent;
  @ViewChild('filterButtonEnableds') filterButtonEnableds: FilterButtonComponent;

  isFilteringBrands: number = 0;
  isFilteringEnableds: number = 0;

  /**Filters */
  brands: Array<TagsInputOption> = [];
  enableds: Array<TagsInputOption> = [];

  /** Filters save **/
  brandsSelected: Array<any> = [];
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
    brands: [],
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
    private brandsEnabledReceptionService: BrandsEnabledReceptionService
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
        this.saveFilters();
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
        this.recoverFilters();
        this.getList(this.form);
      });
    });
  }

  initEntity() {
    this.entities = {
      brands: [],
      enableds: [],
      ordertypes: [],
    }
  }

  initForm() {
    this.form.patchValue({
      brands: [],
      enableds: [],
      ordertypes: []
    })
  }

  private saveFilters(){
    this.brandsSelected = this.form.value.brands;
    this.enabledsSelected = this.form.value.enableds;
  }

  private recoverFilters(){
    this.form.get("brands").patchValue(this.brandsSelected, { emitEvent: false });
    this.form.get("enableds").patchValue(this.enabledsSelected, { emitEvent: false });
  }

  getFilters() {
    this.brandsEnabledReceptionService.entities().subscribe(entities => {
      entities.ordertypes.forEach(element => {
          this.columns[element.name] = element.id;
      });
      this.updateFilterSourceBrands(entities.brandsEnabledReception);
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
    this.brandsEnabledReceptionService.index(form.value).subscribe(
      async (resp:any) => {
        this.toUpdate.removeControl("brands");
        this.toUpdate.addControl("brands", this.formBuilder.array(resp.results.map(brand => {
          return this.formBuilder.group({
            id: brand.id,
            name: brand.name,
            selected: brand.brandsEnabledReception && brand.brandsEnabledReception.enabled ? brand.brandsEnabledReception.enabled : false,
            brands: brand.brandsEnabledReception
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
      case 'brands':
        let brandsFiltered: string[] = [];
        for (let brand of filters) {
          if (brand.checked) brandsFiltered.push(brand.id);
        }
        if (brandsFiltered.length >= this.brands.length) {
          this.form.value.brands = [];
          this.isFilteringBrands = this.brands.length;
        } else {
          if (brandsFiltered.length > 0) {
            this.form.value.brands = brandsFiltered;
            this.isFilteringBrands = brandsFiltered.length;
          } else {
            this.form.value.brands = [];
            this.isFilteringBrands = this.brands.length;
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
    if (this.lastUsedFilter !== 'brands') {
      let filteredBrands = entities['brands'] as unknown as string[];
      if(filteredBrands){
        for (let index in this.brands) {
          this.brands[index].hide = filteredBrands.includes(this.brands[index].value);
        }
      }
      this.filterButtonBrands.listItems = this.brands;
    }
    if (this.lastUsedFilter !== 'enableds') {
      let filteredEnableds = entities['enableds'] as unknown as string[];
      if(filteredEnableds){
        for (let index in this.enableds) {
          this.enableds[index].hide = filteredEnableds.includes(this.enableds[index].value);
        }
      }
      this.filterButtonEnableds.listItems = this.enableds;
    }
  }

  private updateFilterSourceBrands(brands: FiltersModel.Brand[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("brands").value;
    this.brands = brands.map(brand => {
      brand.value = brand.name;
      brand.checked = true;
      brand.hide = false;
      return brand;
    });

    if (value && value.length) {
      this.form.get("brands").patchValue(value, { emitEvent: false });
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
    this.brandsEnabledReceptionService.update(this.toUpdate.value).subscribe(async result => {
        this.getList(this.form);
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess(
          'Marcas actualizadas con éxito'
        );
      },
      () => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess('Error actualizando marcas');
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
