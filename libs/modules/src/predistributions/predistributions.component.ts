import { IntermediaryService } from './../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatCheckboxChange } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { PredistributionsService } from '../../../services/src/lib/endpoint/predistributions/predistributions.service';
import { PredistributionModel } from '../../../services/src/models/endpoints/Predistribution';
import Predistribution = PredistributionModel.Predistribution;
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { PaginatorComponent } from '../components/paginator/paginator.component';

@Component({
  selector: 'suite-predistributions',
  templateUrl: './predistributions.component.html',
  styleUrls: ['./predistributions.component.scss'],
})
export class PredistributionsComponent implements OnInit, AfterViewInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select', 'article','model','store','size','brand','color','provider', 'date_service', 'distribution', 'reserved'];
  // displayedColumns: string[] = ['select', 'article', 'store'];
  dataSource
  selection = new SelectionModel<Predistribution>(true, []);
  selectionPredistribution = new SelectionModel<Predistribution>(true, []);
  selectionReserved = new SelectionModel<Predistribution>(true, []);

  @ViewChild('filterButtonReferences') filterButtonReferences: FilterButtonComponent;
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
  entities
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  // pagerValues = [50, 100, 1000];
  pagerValues = [10, 20, 80];
  form: FormGroup = this.formBuilder.group({
    brands: [],
    references: [],
    models: [],
    colors: [],
    sizes: [],
    providers:[],
    warehouses: [],
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: '',
      order: "asc"
    })
  });
  length: any;


  constructor(
    private predistributionsService: PredistributionsService,
    private formBuilder: FormBuilder,
    private intermediaryService:IntermediaryService

  ) {

    // this.predistributionsService.getIndex().then((ELEMENT_DATA) => {
    //   console.log(ELEMENT_DATA);
    //   this.dataSource = new MatTableDataSource<Predistribution>(ELEMENT_DATA);
    // });
  }

  ngOnInit(): void {

    this.initEntity()
    this.initForm()
    this.getFilters()
    this.getList(this.form)
    this.listenChanges()
    // this.paginator._intl.itemsPerPageLabel = 'Ver';
    // this.paginator._intl.getRangeLabel = this.getRangeLabel;
    // this.dataSource.results.forEach(row => {
    //   if (row.distribution) {
    //     this.selectionPredistribution.select(row);
    //   }

    //   if (row.reserved) {
    //     this.selectionReserved.select(row);
    //   }
    // });
  }
  listenChanges() {
    let previousPageSize = this.form.value.pagination.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      /**true if only change the number of results */
      console.log(page);
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
      brands: [],
      colors: [],
      destinyShop: [],
      models: [],
      provider: [],
      sizes:[]
    }
  }
  initForm() {
    this.form.patchValue({
      brands:[],
      colors:[],
      models:[],
      providers:[],
      references:[],
      sizes:[],
      warehouses:[],
    })
  }
  ngAfterViewInit(): void {
    let This = this;
    setTimeout(() => {
      if(!!This.sort && !!this.dataSource)
        this.dataSource.sort = This.sort;
      if(!!This.paginator && !!this.dataSource)
        this.dataSource.paginator = This.paginator;
    }, 2000)
  }

  getRangeLabel = (page: number, pageSize: number, length: number) =>  {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    return `${length} resultados / pág. ${page + 1} de ${Math.ceil(length / pageSize)}`;
  };

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelectedPredistribution() {
    let result = true;

    this.dataSource.data.forEach(row => {
      if (row && !row.distribution) {
        result = false;
      }
    });

    return result;
  }

  isAllSelectedReserved() {
    let result = true;
    this.dataSource.data.forEach(row => {
      if (row && !row.reserved) {
        result = false;
      }
    });

    return result;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  predistributionToggle() {
    if (this.isAllSelectedPredistribution()) {
      this.dataSource.data.forEach(row => {
        row.distribution = false;
        this.selectionPredistribution.clear();
      })
    } else {
      this.dataSource.data.forEach(row => {
        row.distribution = true;
        this.selectionPredistribution.select(row);
        row.reserved = false;
        this.selectionReserved.clear();
      });
    }
  }

  reservedToggle() {
    if (this.isAllSelectedReserved()) {
      this.dataSource.data.forEach(row => {
        row.reserved = false;
        this.selectionReserved.clear();
      });
    } else {
      this.dataSource.data.forEach(row => {
        row.reserved = true;
        this.selectionReserved.select(row);
        row.distribution = false;
        this.selectionPredistribution.clear();
      });
    }
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  checkboxLabelPredistribution(row?): string {
    if (!row) {
      return `${this.isAllSelectedPredistribution() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionPredistribution.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  checkboxLabelReserved(row?: Predistribution): string {
    if (!row) {
      return `${this.isAllSelectedReserved() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionReserved.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  changePredistribution(row: Predistribution) {
    if (this.selectionPredistribution.isSelected(row)) {
      this.selectionReserved.deselect(row);
    }

    this.dataSource.data.forEach(dataRow => {
      if (dataRow && dataRow.id === row.id) {
        if (dataRow.distribution) {
          dataRow.distribution = false;
        } else {
          dataRow.distribution = true;
          dataRow.reserved = false;
        }
      }
    });
  }

  changeReserved(row: Predistribution) {
    if (this.selectionReserved.isSelected(row)) {
      this.selectionPredistribution.deselect(row);
    }

    this.dataSource.data.forEach(dataRow => {
      if (dataRow && dataRow.id === row.id) {
        if (dataRow.reserved) {
          dataRow.reserved = false;
        } else {
          dataRow.reserved = true;
          dataRow.distribution = false;
        }
      }
    });
  }

  async savePredistributions() {
    let list = [];
    this.dataSource.data.forEach(dataRow => {
      list.push({
        distribution: dataRow.distribution,
        reserved: !dataRow.distribution,
        modelId: dataRow.model.id,
        sizeId: dataRow.size.id,
        warehouseId: dataRow.warehouse.id
      })
    });
    // call to services ..
    this.intermediaryService.presentLoading();
    let This = this;
    await this.predistributionsService.updateBlockReserved(list).subscribe(function(data){
      This.intermediaryService.presentToastSuccess("Actualizado predistribuciones correctamente");
      console.log('debug', data);
      // reload page
      This.initEntity()
      This.initForm()
      This.getFilters()
      This.getList(This.form)
      This.listenChanges()
    }, (error) => {
      This.intermediaryService.presentToastError("Error Actualizado predistribuciones");
      This.intermediaryService.dismissLoading();
    }, () => {
      This.intermediaryService.dismissLoading();
    });
  }

  getFilters() {
    this.predistributionsService.entities().subscribe(entities => {
      console.log(entities)
      this.updateFilterSourceBrands(entities.brands)
      this.updateFilterSourceModels(entities.models)
      this.updateFilterSourceSizes(entities.sizes)
      this.updateFilterSourceColors(entities.colors)
      this.updateFilterSourceWarehouses(entities.destinyShop)
      this.updateFilterSourceProviders(entities.provider)
      this.reduceFilters(entities)
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
        // this.form.get("warehouses").patchValue([warehouse.id], { emitEvent: false });
        // this.form.get("orderby").get("type").patchValue("" + TypesService.ID_TYPE_ORDER_PRODUCT_DEFAULT, { emitEvent: false });
      }, 0);
    })

  }
  async getList(form?: FormGroup){
    await this.intermediaryService.presentLoading()
    this.predistributionsService.index(form.value).subscribe(
      (resp:any) => {
        console.log(resp);
        this.dataSource = new MatTableDataSource<PredistributionModel.Predistribution>(resp.results)
        const paginator = resp.pagination;
        console.log(paginator);

        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.selectPage;
        this.paginator.lastPage = paginator.lastPage;
        this.dataSource.data.forEach(row => {
        if (row.distribution) {
          this.selectionPredistribution.select(row);
        }
        if (row.reserved) {
           this.selectionReserved.select(row);
        }
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
            this.form.value.productReferencePattern = ['99999'];
            this.isFilteringReferences = this.references.length;
          }
        }
        break;
      case 'models':
        let modelsFiltered: string[] = [];
        for (let model of filters) {
          console.log(model);

          if (model.checked) modelsFiltered.push(model.id);
        }
        console.log(modelsFiltered);
          console.log(modelsFiltered.length, '>=' ,this.models.length);

        if (modelsFiltered.length >= this.models.length) {
          console.log('entre en model');

          this.form.value.models = [];
          this.isFilteringModels = this.models.length;
        } else {
          if (modelsFiltered.length > 0) {
            this.form.value.models = modelsFiltered;
            this.isFilteringModels = modelsFiltered.length;
          } else {
            this.form.value.models = [99999];
            this.isFilteringModels = this.models.length;
          }
        }
        console.log(this.form.value);

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
            this.form.value.colors = [99999];
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
            this.form.value.sizes = ["99999"];
            this.isFilteringSizes = this.sizes.length;
          }
        }
        break;
      case 'warehouses':
        let warehousesFiltered: number[] = [];
        for (let warehouse of filters) {
          if (warehouse.checked) warehousesFiltered.push(warehouse.id);
        }
        console.log(warehousesFiltered.length, '>=' ,this.warehouses.length);

        if (warehousesFiltered.length >= this.warehouses.length) {
          this.form.value.warehouses = [];
          this.isFilteringWarehouses = this.warehouses.length;
        } else {
          if (warehousesFiltered.length > 0) {
            this.form.value.warehouses = warehousesFiltered;
            this.isFilteringWarehouses = warehousesFiltered.length;
          } else {
            this.form.value.warehouses = [99999];
            this.isFilteringWarehouses = this.warehouses.length;
          }
        }
        break;
      case 'providers':
        let providersFiltered: number[] = [];
        for (let providers of filters) {
          if (providers.checked) providersFiltered.push(providers.id);
        }
        if (providersFiltered.length >= this.providers.length) {
          this.form.value.providers = [];
          this.isFilteringProviders = this.providers.length;
        } else {
          if (providersFiltered.length > 0) {
            this.form.value.providers = providersFiltered;
            this.isFilteringProviders = providersFiltered.length;
          } else {
            this.form.value.containers = [99999];
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
          this.form.value.brands = [];
          this.isFilteringBrands = this.brands.length;
        } else {
          if (brandsFiltered.length > 0) {
            this.form.value.brands = brandsFiltered;
            this.isFilteringBrands = brandsFiltered.length;
          } else {
            this.form.value.brands = [99999];
            this.isFilteringBrands = this.brands.length;
          }
        }
    }
    this.lastUsedFilter = filterType;
    this.getList(this.form);
  }
  private reduceFilters(entities){
    // if (this.lastUsedFilter != 'references') {
    //   let filteredReferences = entities['references'] as unknown as string[];
    //   for (let index in this.references) {
    //     this.references[index].hide = !filteredReferences.includes(this.references[index].value);
    //   }
    //   this.filterButtonReferences.listItems = this.references;
    // }
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
      let filteredWarehouses = entities['destinyShop'] as unknown as (string | number)[];
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
      let filteredProviders = entities['provider'] as unknown as string[];
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
    console.log(this.brands);

    if (value && value.length) {
      this.form.get("brands").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }
  private updateFilterSourceSizes(sizes: FiltersModel.Size[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("sizes").value;
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
    if (value && value.length) {
      this.form.get("sizes").patchValue(value, { emitEvent: false });
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
      model.id = <number>(<unknown>model.id);
      model.name = model.name;
      model.value = model.name;
      model.checked = true;
      model.hide = false;
      return model;
    });
    console.log(this.models);

    if (value && value.length) {
      this.form.get("models").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }
  private updateFilterSourceProviders(providers: FiltersModel.Model[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("providers").value;
    this.providers = providers.map(provider => {
      provider.id = <number>(<unknown>provider.id);
      provider.name = provider.name;
      provider.value = provider.name;
      provider.checked = true;
      provider.hide = false;
      return provider;
    });
    if (value && value.length) {
      this.form.get("providers").patchValue(value, { emitEvent: false });
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
}
