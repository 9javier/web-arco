import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, Sort } from '@angular/material';
import {
  ProductsService,
  FiltersService,
  FiltersModel,
  InventoryService,
  TypesService,
  WarehouseService,
  WarehousesService,
  IntermediaryService,
  UsersService
} from '@suite/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { FilterButtonComponent } from "../components/filter-button/filter-button.component";
import { PermissionsService } from '../../../services/src/lib/endpoint/permissions/permissions.service';
import { ProductsAvelonService } from '../../../services/src/lib/endpoint/products-avelon/products-avelon.service';
import { PredistributionModel } from '../../../services/src/models/endpoints/Predistribution';
import Predistribution = PredistributionModel.Predistribution;
import { SelectionModel } from '@angular/cdk/collections';
import * as _ from 'lodash';

@Component({
  selector: 'suite-products-avelon',
  templateUrl: './products-avelon.component.html',
  styleUrls: ['./products-avelon.component.scss']
})
export class ProductsAvelonComponent implements OnInit {

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterButtonProviders') filterButtonProviders: FilterButtonComponent;
  @ViewChild('filterButtonModels') filterButtonModels: FilterButtonComponent;
  @ViewChild('filterButtonProducts') filterButtonProducts: FilterButtonComponent;
  @ViewChild('filterButtonUsers') filterButtonUsers: FilterButtonComponent;
  @ViewChild('filterButtonColors') filterButtonColors: FilterButtonComponent;
  @ViewChild('filterButtonSizes') filterButtonSizes: FilterButtonComponent;
  @ViewChild('filterButtonBrands') filterButtonBrands: FilterButtonComponent;

  displayedColumns: string[] = ['select', 'Codigo', 'Ref. modelo', 'Talla', 'Color', 'Brand', 'Supplier', 'Usuario'];
  columns = {};
  selection = new SelectionModel<Predistribution>(true, []);
  results: any;
  dataSourceOriginal;
  dataSource;
  selectionPredistribution = new SelectionModel<Predistribution>(true, []);
  selectionReserved = new SelectionModel<Predistribution>(true, []);

  isFilteringReferences: number = 0;
  isFilteringModels: number = 0;
  isFilteringProducts: number = 0;
  isFilteringUsers: number = 0;
  isFilteringColors: number = 0;
  isFilteringSizes: number = 0;
  isFilteringWarehouses: number = 0;
  isFilteringProviders: number = 0;
  isFilteringBrands: number = 0;

  /**Filters */
  references: Array<TagsInputOption> = [];
  models: Array<TagsInputOption> = [];
  products: Array<TagsInputOption> = [];
  users: Array<TagsInputOption> = [];
  colors: Array<TagsInputOption> = [];
  sizes: Array<TagsInputOption> = [];
  warehouses: Array<TagsInputOption> = [];
  providers: Array<TagsInputOption> = [];
  brands: Array<TagsInputOption> = [];
  groups: Array<TagsInputOption> = [];
  suppliers: Array<TagsInputOption> = [];
  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagerValues = [20, 50, 100];
  form: FormGroup = this.formBuilder.group({
    warehouses: [],
    models: [],
    products: [],
    users: [],
    colors: [],
    sizes: [],
    brands: [],
    suppliers: [],
    categories:[],
    families:[],
    lifestyles:[],
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
    private productAvelonService: ProductsAvelonService
  ) {}

  getSecondsAvelon(){
    this.productAvelonService.GetSecondAvelon().subscribe(result => {
      let seconds = result && result.GlobalVariable_value ? parseInt(result.GlobalVariable_value)/60 : 0;
      seconds.toString();
      this.seconds.GlobalVariable_value = seconds ;
    },()=>{
      this.seconds.GlobalVariable_value = "0";
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
      let value = parseInt(this.seconds.GlobalVariable_value)*60;
      value.toString();
      let body = {
        "value": value
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
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getList(this.form);
    this.listenChanges();
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
/*    this.intermediaryService.presentLoading('Cargando Filtros...').then(() => {
      this.getList(this.form);
    });*/
  }

  initEntity() {
    this.entities = {
      models: [],
      products: [],
      users: [],
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
      products: [],
      users: [],
      colors: [],
      sizes: [],
      brands: [],
      ordertypes: [],
      suppliers: [],
      categories  :[],
      families  :[],
      lifestyles  :[],
    })
  }

  getFilters() {
    this.productAvelonService.entities().subscribe(entities => {
      entities.ordertypes.forEach(element => {
          this.columns[element.name] = element.id;
      });
      this.updateFilterSourceBrands(entities.brands);
      this.updateFilterSourceModels(entities.models);
      this.updateFilterSourceProducts(entities.products);
      this.updateFilterSourceUsers(entities.users);
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
        this.results = resp.results;
        this.dataSource = new MatTableDataSource<any>(this.results);
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
      case 'products':
        let productsFiltered: string[] = [];
        for (let product of filters) {

          if (product.checked) productsFiltered.push(product.id);
        }

        if (productsFiltered.length >= this.products.length) {
          this.form.value.products = [];
          this.isFilteringProducts = this.products.length;
        } else {
          if (productsFiltered.length > 0) {
            this.form.value.products = productsFiltered;
            this.isFilteringProducts = productsFiltered.length;
          } else {
            this.form.value.products = [];
            this.isFilteringProducts = this.products.length;
          }
        }

        break;
      case 'users':
        let usersFiltered: string[] = [];
        for (let user of filters) {

          if (user.checked) usersFiltered.push(user.id);
        }

        if (usersFiltered.length >= this.users.length) {
          this.form.value.users = [];
          this.isFilteringUsers = this.users.length;
        } else {
          if (usersFiltered.length > 0) {
            this.form.value.users = usersFiltered;
            this.isFilteringUsers = usersFiltered.length;
          } else {
            this.form.value.users = [];
            this.isFilteringUsers = this.users.length;
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
    if (this.lastUsedFilter !== 'products') {
      let filteredProducts = entities['products'] as unknown as string[];
      for (let index in this.products) {
        this.products[index].hide = filteredProducts.includes(this.products[index].value);
      }
      this.filterButtonProducts.listItems = this.products;
    }
    if (this.lastUsedFilter !== 'users') {
      let filteredUsers = entities['users'] as unknown as string[];
      for (let index in this.users) {
        this.users[index].hide = filteredUsers.includes(this.users[index].name);
      }
      this.filterButtonUsers.listItems = this.users;
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
      warehouse.value = warehouse.reference;
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
      model.name = model.name;
      model.value = model.reference;
      model.checked = true;
      model.hide = false;
      return model;
    });

    if (value && value.length) {
      this.form.get("models").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceProducts(products: FiltersModel.Product[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("products").value;
    this.products = products.map(product => {
      product.id = <number>(<unknown>product.id);
      product.value = product.reference;
      product.checked = true;
      product.hide = false;
      return product;
    });

    if (value && value.length) {
      this.form.get("products").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceUsers(users: FiltersModel.User[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("users").value;
    this.users = users.map(user => {
      user.id = <number>(<unknown>user.id);
      user.name = user.name;
      user.value = user.name;
      user.checked = true;
      user.hide = false;
      return user;
    });

    if (value && value.length) {
      this.form.get("users").patchValue(value, { emitEvent: false });
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

  refreshTable() {
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getList(this.form);
    this.listenChanges();
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  async presentAlertDeleteConfirm() {
    const alert = await this.alertController.create({
      header: '¡Confirmar eliminación!',
      message: '¿Deseas eliminar los productos seleccionados?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.selection.clear();
          }
        }, {
          text: 'Si',
          handler: async () => {
            await this.deleteProductReceptions();
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteProductReceptions() {
    let id = this.selection.selected.map((product) =>
      product ? product.id : null)
      .filter(product => product);
    await this.intermediaryService.presentLoading('Borrando productos');
    this.productAvelonService.delete_Product_Receptions(id).subscribe(async result => {
      this.getFilters();
      this.getList(this.form);
      this.selection.clear();
    }, async error => {
      await this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError('Ha ocurrido un error el cargar los datos del sevidor')
    });
  }
}
