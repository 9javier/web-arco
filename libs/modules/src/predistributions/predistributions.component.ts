import { IntermediaryService } from './../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatCheckboxChange, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { PredistributionsService } from '../../../services/src/lib/endpoint/predistributions/predistributions.service';
import { PredistributionModel } from '../../../services/src/models/endpoints/Predistribution';
import Predistribution = PredistributionModel.Predistribution;
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import * as _ from 'lodash';
import { FilterTypes } from '../../../services/src/models/filter.types';

@Component({
  selector: 'suite-predistributions',
  templateUrl: './predistributions.component.html',
  styleUrls: ['./predistributions.component.scss'],
})
export class PredistributionsComponent implements OnInit, AfterViewInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['article','size','store','date_service','brand','provider','model','color','category','family','lifestyle', 'distribution', 'reserved'];
  // displayedColumns: string[] = ['select', 'article', 'store'];
  dataSourceOriginal;
  dataSource;
  selectionPredistribution = new SelectionModel<Predistribution>(true, []);
  selectionReserved = new SelectionModel<Predistribution>(true, []);

  @ViewChild('filterButtonReferences') filterButtonReferences: FilterButtonComponent;
  @ViewChild('filterButtonSizes') filterButtonSizes: FilterButtonComponent;
  @ViewChild('filterButtonWarehouses') filterButtonWarehouses: FilterButtonComponent;
  @ViewChild('filterButtonBrands') filterButtonBrands: FilterButtonComponent;
  @ViewChild('filterButtonProviders') filterButtonProviders: FilterButtonComponent;
  @ViewChild('filterButtonModels') filterButtonModels: FilterButtonComponent;
  @ViewChild('filterButtonColors') filterButtonColors: FilterButtonComponent;
  @ViewChild('filterButtonCategory') filterButtonCategory: FilterButtonComponent;
  @ViewChild('filterButtonFamily') filterButtonFamily: FilterButtonComponent;
  @ViewChild('filterButtonLifestyle') filterButtonLifestyle: FilterButtonComponent;


  isFilteringReferences: number = 0;
  isFilteringSizes: number = 0;
  isFilteringWarehouses: number = 0;
  isFilteringBrands: number = 0;
  isFilteringProviders: number = 0;
  isFilteringModels: number = 0;
  isFilteringColors: number = 0;
  isFilteringCategory: number = 0;
  isFilteringFamily: number = 0;
  isFilteringLifestyle: number = 0;

  /**Filters */
  references: Array<TagsInputOption> = [];
  sizes: Array<TagsInputOption> = [];
  warehouses: Array<TagsInputOption> = [];
  brands: Array<TagsInputOption> = [];
  providers: Array<TagsInputOption> = [];
  models: Array<TagsInputOption> = [];
  colors: Array<TagsInputOption> = [];
  category: Array<TagsInputOption> = [];
  family: Array<TagsInputOption> = [];
  lifestyle: Array<TagsInputOption> = [];

  groups: Array<TagsInputOption> = [];
  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  // pagerValues = [50, 100, 1000];
  pagerValues = [10, 20, 80];
  form: FormGroup = this.formBuilder.group({
    references: [],
    sizes: [],
    warehouses: [],
    brands: [],
    providers:[],
    models: [],
    colors: [],
    category: [],
    family: [],
    lifestyle: [],

    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: 1,
      order: "asc"
    })
  });
  length: any;


  constructor(
    private predistributionsService: PredistributionsService,
    private formBuilder: FormBuilder,
    private intermediaryService:IntermediaryService

  ) {}

  ngOnInit(): void {

    this.initEntity()
    this.initForm()
    this.getFilters()
    this.getList(this.form)
    this.listenChanges()
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
      references: [],
      sizes: [],
      warehouses: [],
      brands: [],
      providers:[],
      models: [],
      colors: [],
      category: [],
      family: [],
      lifestyle: [],
    }
  }
  initForm() {
    this.form.patchValue({
      references: [],
      sizes: [],
      warehouses: [],
      brands: [],
      providers:[],
      models: [],
      colors: [],
      category: [],
      family: [],
      lifestyle: [],
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
    this.predistributionsService.entities().subscribe(entities => {
      this.references = this.updateFilterSource(entities.references, 'references');
      this.sizes = this.updateFilterSource(entities.sizes, 'sizes');
      this.warehouses = this.updateFilterSource(entities.warehouses, 'warehouses');
      this.brands = this.updateFilterSource(entities.brands, 'brands');
      this.providers = this.updateFilterSource(entities.providers, 'providers');
      this.models = this.updateFilterSource(entities.models, 'models');
      this.colors = this.updateFilterSource(entities.colors, 'colors');
      this.category = this.updateFilterSource(entities.category, 'category');
      this.family = this.updateFilterSource(entities.family, 'family');
      this.lifestyle = this.updateFilterSource(entities.lifestyle, 'lifestyle');

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

    this.predistributionsService.index(form.value).subscribe(
      (resp:any) => {
        this.dataSource = new MatTableDataSource<PredistributionModel.Predistribution>(resp.results);
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

          if (reference.checked) referencesFiltered.push(reference.id);
        }

        if (referencesFiltered.length >= this.references.length) {
          this.form.value.references = [];
          this.isFilteringReferences = this.references.length;
        } else {
          if (referencesFiltered.length > 0) {
            this.form.value.references = referencesFiltered;
            this.isFilteringReferences = referencesFiltered.length;
          } else {
            this.form.value.references = ['99999'];
            this.isFilteringReferences = this.references.length;
          }
        }
        break;
      case 'category':
        let categoryFiltered: number[] = [];
        for (let category of filters) {
          if (category.checked) categoryFiltered.push(category.id);
        }
        if (categoryFiltered.length >= this.category.length) {
          this.form.value.category = [];
          this.isFilteringCategory = this.category.length;
        } else {
          if (categoryFiltered.length > 0) {
            this.form.value.category = categoryFiltered;
            this.isFilteringCategory = categoryFiltered.length;
          } else {
            this.form.value.category = ["99999"];
            this.isFilteringCategory = this.category.length;
          }
        }
        break;
      case 'family':
        let familyFiltered: number[] = [];
        for (let family of filters) {
          if (family.checked) familyFiltered.push(family.id);
        }
        if (familyFiltered.length >= this.family.length) {
          this.form.value.family = [];
          this.isFilteringFamily = this.family.length;
        } else {
          if (familyFiltered.length > 0) {
            this.form.value.family = familyFiltered;
            this.isFilteringFamily = familyFiltered.length;
          } else {
            this.form.value.family = ["99999"];
            this.isFilteringFamily = this.family.length;
          }
        }
        break;
      case 'lifestyle':
        let lifestyleFiltered: number[] = [];
        for (let lifestyle of filters) {
          if (lifestyle.checked) lifestyleFiltered.push(lifestyle.id);
        }
        if (lifestyleFiltered.length >= this.lifestyle.length) {
          this.form.value.lifestyle = [];
          this.isFilteringLifestyle = this.lifestyle.length;
        } else {
          if (lifestyleFiltered.length > 0) {
            this.form.value.lifestyle = lifestyleFiltered;
            this.isFilteringLifestyle = lifestyleFiltered.length;
          } else {
            this.form.value.lifestyle = ["99999"];
            this.isFilteringLifestyle = this.lifestyle.length;
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
            this.form.value.models = [99999];
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
        for (let provider of filters) {
          if (provider.checked) providersFiltered.push(provider.id);
        }
        if (providersFiltered.length >= this.providers.length) {
          this.form.value.providers = [];
          this.isFilteringProviders = this.providers.length;
        } else {
          if (providersFiltered.length > 0) {
            this.form.value.providers = providersFiltered;
            this.isFilteringProviders = providersFiltered.length;
          } else {
            this.form.value.providers = [99999];
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
    this.filterButtonReferences.listItems = this.reduceFilterEntities(this.references, entities,'references');
    this.filterButtonSizes.listItems = this.reduceFilterEntities(this.sizes, entities,'sizes');
    this.filterButtonWarehouses.listItems = this.reduceFilterEntities(this.warehouses, entities,'warehouses');
    this.filterButtonBrands.listItems = this.reduceFilterEntities(this.brands, entities,'brands');
    this.filterButtonProviders.listItems = this.reduceFilterEntities(this.providers, entities,'providers');
    this.filterButtonModels.listItems = this.reduceFilterEntities(this.models, entities,'models');
    this.filterButtonColors.listItems = this.reduceFilterEntities(this.colors, entities,'colors');
    this.filterButtonCategory.listItems = this.reduceFilterEntities(this.category, entities,'category');
    this.filterButtonFamily.listItems = this.reduceFilterEntities(this.family, entities,'family');
    this.filterButtonLifestyle.listItems = this.reduceFilterEntities(this.lifestyle, entities,'lifestyle');
  }

  private reduceFilterEntities(arrayEntity: any[], entities: any, entityName: string) {
    if (this.lastUsedFilter !== entityName) {
      let filteredEntity = entities[entityName] as unknown as string[];

      arrayEntity.forEach((item) => {
        item.hide = filteredEntity.includes(item.value);
      });

      return arrayEntity;
    }
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

  refreshPredistributions() {
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getList(this.form);
    this.listenChanges();
  }

  async sortData(event: Sort) {
    console.log(event);
    let type = 1;
    switch (event.active) {
      case 'article':
        type = FilterTypes.REFERENCES;
        break;
      case 'size':
        type = FilterTypes.SIZES;
        break;
      case 'store':
        type = FilterTypes.WAREHOUSES;
        break;
      case 'date_service':
        type = FilterTypes.DATESERVICES;
        break;
      case 'brand':
        type = FilterTypes.BRANDS;
        break;
      case 'provider':
        type = FilterTypes.PROVIDERS;
        break;
      case 'model':
        type = FilterTypes.MODELS;
        break;
      case 'color':
        type = FilterTypes.COLORS;
        break;
      case 'category':
        type = FilterTypes.CATEGORY;
        break;
      case 'family':
        type = FilterTypes.FAMILY;
        break;
      case 'lifestyle':
        type = FilterTypes.LIFESTYLE;
        break;
    }

    this.form.value.orderby.type = type;
    this.form.value.orderby.order = event.direction;
    await this.getList(this.form);
  }
}
