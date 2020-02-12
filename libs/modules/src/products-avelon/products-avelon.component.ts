import { BehaviorSubject, of, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange } from '@angular/material';
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
import { ProductsAvelonService } from '../../../services/src/lib/endpoint/products-avelon/products-avelon.service';
import { PredistributionModel } from '../../../services/src/models/endpoints/Predistribution';
import Predistribution = PredistributionModel.Predistribution;
import { SelectionModel } from '@angular/cdk/collections';
import { PredistributionsService } from '../../../services/src/lib/endpoint/predistributions/predistributions.service';
import * as _ from 'lodash';




@Component({
  selector: 'suite-products-avelon',
  templateUrl: './products-avelon.component.html',
  styleUrls: ['./products-avelon.component.scss']
})

export class ProductsAvelonComponent implements OnInit, AfterViewInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['model', 'size', 'color', 'brand', 'provider', 'warehouseDestiny'];
  dataSourceOriginal;
  dataSource;
  selectionPredistribution = new SelectionModel<Predistribution>(true, []);
  selectionReserved = new SelectionModel<Predistribution>(true, []);
  @ViewChild('filterButtonWarehouses') filterButtonWarehouses: FilterButtonComponent;
  @ViewChild('filterButtonProviders') filterButtonProviders: FilterButtonComponent;
  @ViewChild('filterButtonModels') filterButtonModels: FilterButtonComponent;
  @ViewChild('filterButtonColors') filterButtonColors: FilterButtonComponent;
  @ViewChild('filterButtonSizes') filterButtonSizes: FilterButtonComponent;
  @ViewChild('filterButtonBrands') filterButtonBrands: FilterButtonComponent;


  isFilteringReferences: number = 0;
  isFilteringModels: number = 0;
  isFilteringColors: number = 0;
  isFilteringSizes: number = 0;
  isFilteringWarehouses: number = 0;
  isFilteringProviders: number = 0;
  isFilteringBrands: number = 0;

  /**Filters */
  references: Array<TagsInputOption> = [];
  models: Array<TagsInputOption> = [];
  colors: Array<TagsInputOption> = [];
  sizes: Array<TagsInputOption> = [];
  warehouses: Array<TagsInputOption> = [];
  providers: Array<TagsInputOption> = [];
  brands: Array<TagsInputOption> = [];
  groups: Array<TagsInputOption> = [];
  suppliers: Array<TagsInputOption> = [];
  entities
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  // pagerValues = [50, 100, 1000];
  pagerValues = [10, 20, 80];
  form: FormGroup = this.formBuilder.group({
    warehouses: [],
    models: [],
    colors: [],
    sizes: [],
    brands: [],
    suppliers: [],
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: '1',
      order: "desc"
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
    private productAvelonService: ProductsAvelonService,
    private predistributionsService: PredistributionsService
  ) {
  }

  
 

  getSecondsAvelon(){
    this.intermediaryService.presentLoading('Actualizando Avelon').then(() => {
      this.productAvelonService.GetSecondAvelon().subscribe(result => {
        this.seconds= result;
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
      this.productAvelonService.notifyAvelonPredistribution(body).subscribe(result => {
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
      let body = {
        "value": this.seconds.GlobalVariable_value
      };
      this.productAvelonService.updateSecondAvelon(body).subscribe(result => {
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
  }
  initEntity() {
    this.entities = {
      models: [],
      colors: [],
      sizes: [],
      warehouses: [],
      ordertypes: [],
      brands: [],
      suppliers: [],
    }
  }
  initForm() {
    this.form.patchValue({
      warehouses: [],
      models: [],
      colors: [],
      sizes: [],
      brands: [],
      ordertypes: [],
      suppliers: [],
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
    this.productAvelonService.entities().subscribe(entities => {
      this.updateFilterSourceBrands(entities.brands);
      this.updateFilterSourceModels(entities.models);
      this.updateFilterSourceSizes(entities.sizes);
      this.updateFilterSourceColors(entities.colors);
      this.updateFilterSourceWarehouses(entities.warehouses);
      this.updateFilterSourceProviders(entities.suppliers);
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
    this.productAvelonService.index(form.value).subscribe(
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
            this.form.value.productReferencePattern = [];
            this.isFilteringReferences = this.references.length;
          }
        }
        break;
      case 'models':
        let modelsFiltered: string[] = [];
        for (let model of filters) {

          if (model.checked) modelsFiltered.push(model.id);
        }

        if (modelsFiltered.length >= this.models.length) {
          this.form.value.models = [];
          this.isFilteringModels = this.models.length;
        } else {
          if (modelsFiltered.length > 0) {
            this.form.value.models = modelsFiltered;
            this.isFilteringModels = modelsFiltered.length;
          } else {
            this.form.value.models = [];
            this.isFilteringModels = this.models.length;
          }
        }

        break;
      case 'colors':
        let colorsFiltered: number[] = [];
        for (let color of filters) {
          if (color.checked) colorsFiltered.push(color.id);
        }
        if (colorsFiltered.length >= this.colors.length) {
          this.form.value.colors = [];
          this.isFilteringColors = this.colors.length;
        } else {
          if (colorsFiltered.length > 0) {
            this.form.value.colors = colorsFiltered;
            this.isFilteringColors = colorsFiltered.length;
          } else {
            this.form.value.colors = [];
            this.isFilteringColors = this.colors.length;
          }
        }
        break;
      case 'sizes':
        let sizesFiltered: number[] = [];
        for (let size of filters) {
          if (size.checked) sizesFiltered.push(size.id);
        }
        if (sizesFiltered.length >= this.sizes.length) {
          this.form.value.sizes = [];
          this.isFilteringSizes = this.sizes.length;
        } else {
          if (sizesFiltered.length > 0) {
            this.form.value.sizes = sizesFiltered;
            this.isFilteringSizes = sizesFiltered.length;
          } else {
            this.form.value.sizes = [];
            this.isFilteringSizes = this.sizes.length;
          }
        }
        break;
      case 'warehouses':
        let warehousesFiltered: number[] = [];
        for (let warehouse of filters) {
          if (warehouse.checked) warehousesFiltered.push(warehouse.id);
        }

        if (warehousesFiltered.length >= this.warehouses.length) {
          this.form.value.warehouses = [];
          this.isFilteringWarehouses = this.warehouses.length;
        } else {
          if (warehousesFiltered.length > 0) {
            this.form.value.warehouses = warehousesFiltered;
            this.isFilteringWarehouses = warehousesFiltered.length;
          } else {
            this.form.value.warehouses = [];
            this.isFilteringWarehouses = this.warehouses.length;
          }
        }
        break;
      case 'providers':
        let providersFiltered: number[] = [];
        for (let providers of filters) {
          if (providers.checked) providersFiltered.push(providers.value);
        }
        if(providersFiltered.length === this.providers.length){
          this.form.value.suppliers = [];
          this.isFilteringProviders = this.providers.length;
        }
        if (providersFiltered.length >= this.providers.length) {
          this.form.value.providers = [];
          this.isFilteringProviders = this.providers.length;
        } else {
          if (providersFiltered.length > 0) {
            this.form.value.suppliers = providersFiltered;
            this.isFilteringProviders = providersFiltered.length;
          } else {
            this.form.value.suppliers = [];
            this.isFilteringProviders = this.providers.length;
          }
        }
        break;
      case 'brands':
        let brandsFiltered: number[] = [];
        for (let brand of filters) {
          if (brand.checked) brandsFiltered.push(brand.value);
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
    }
    this.lastUsedFilter = filterType;
    this.getList(this.form);
  }
  private reduceFilters(entities){
    if (this.lastUsedFilter !== 'models') {
      let filteredModels = entities['models'] as unknown as string[];
      for (let index in this.models) {
        this.models[index].hide = filteredModels.includes(this.models[index].value);
      }
      this.filterButtonModels.listItems = this.models;
    }
    if (this.lastUsedFilter !== 'colors') {
      let filteredColors = entities['colors'] as unknown as string[];
      for (let index in this.colors) {
        this.colors[index].hide = filteredColors.includes(this.colors[index].value);
      }
      this.filterButtonColors.listItems = this.colors;
    }
    if (this.lastUsedFilter !== 'sizes') {
      let filteredSizes = entities['sizes'] as unknown as string[];
      for (let index in this.sizes) {
        this.sizes[index].hide = filteredSizes.includes(this.sizes[index].value);
      }
      this.filterButtonSizes.listItems = this.sizes;
    }
    if (this.lastUsedFilter !== 'warehouses') {
      let filteredWarehouses = entities['warehouses'] as unknown as (string | number)[];
      for (let index in this.warehouses) {
        this.warehouses[index].hide = filteredWarehouses.includes(this.warehouses[index].reference);
      }
      this.filterButtonWarehouses.listItems = this.warehouses;
    }
    if (this.lastUsedFilter !== 'brands') {
      let filteredBrands = entities['brands'] as unknown as string[];
      for (let index in this.brands) {
        this.brands[index].hide = filteredBrands.includes(this.brands[index].value);
      }
      this.filterButtonBrands.listItems = this.brands;
    }
    if (this.lastUsedFilter !== 'providers') {
      let filteredProviders = entities['suppliers'] as unknown as string[];
      for (let index in this.providers) {
        this.providers[index].hide = filteredProviders.includes(this.providers[index].value);
      }
      this.filterButtonProviders.listItems = this.providers;
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
  private updateFilterSourceSizes(sizes: FiltersModel.Size[]) {
    this.pauseListenFormChange = true;
    let valueSize = this.form.get("sizes").value;
    this.sizes = sizes
      .filter((value, index, array) => array.findIndex(x => x.name === value.name) === index)
      .map(size => {
        size.id = <number>(<unknown>size.id);
        size.value = size.name;
        size.checked = true;
        size.hide = false;
        return size;
      })
      ;
    if (valueSize && valueSize.length) {
      this.form.get("sizes").patchValue(valueSize, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }
  private updateFilterSourceWarehouses(warehouses: FiltersModel.Warehouse[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("warehouses").value;
    this.warehouses = warehouses.map(warehouse => {
      warehouse.name = warehouse.name;
      warehouse.value = warehouse.name;
      warehouse.checked = true;
      warehouse.hide = false;
      return warehouse;
    });
    if (value && value.length) {
      this.form.get("warehouses").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }


  private updateFilterSourceModels(models: FiltersModel.Model[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("models").value;
    this.models = models.map(model => {
      model.id = <number>(<unknown>model.reference);
      model.name = model.reference;
      model.value = model.name;
      model.checked = true;
      model.hide = false;
      return model;
    });

    if (value && value.length) {
      this.form.get("models").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }
  private updateFilterSourceProviders(providers: FiltersModel.Supplier[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("suppliers").value;
    this.providers = providers.map(provider => {
      provider.id = <number>(<unknown>provider.id);
      provider.name = provider.name;
      provider.value = provider.name;
      provider.checked = true;
      provider.hide = false;
      return provider;
    });
    if (value && value.length) {
      this.form.get("suppliers").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }
  private updateFilterSourceColors(colors: FiltersModel.Color[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("colors").value;
    this.colors = colors.map(color => {
      color.value = color.name;
      color.checked = true;
      color.hide = false;
      return color;
    });
    if (value && value.length) {
      this.form.get("colors").patchValue(value, { emitEvent: false });
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


  private updateFilterSourceReferences(references: FiltersModel.Reference[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("references").value;
    this.references = references.map(reference => {
      reference.id = <number>(<unknown>reference.reference);
      reference.name = reference.reference;
      reference.value = reference.name;
      reference.checked = true;
      reference.hide = false;
      return reference;
    });
    if (value && value.length) {
      this.form.get("references").patchValue(value, { emitEvent: false });
    }
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
