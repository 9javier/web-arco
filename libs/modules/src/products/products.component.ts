import { BehaviorSubject, of, Observable } from 'rxjs';
import { Filter } from './enums/filter.enum';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
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
  PermissionsModel
} from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ProductDetailsComponent } from './modals/product-details/product-details.component';
import { ModalController, AlertController } from '@ionic/angular';
import { validators } from '../utils/validators';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { FilterButtonComponent } from "../components/filter-button/filter-button.component";
import { map, catchError } from 'rxjs/operators';
import { ProductRelocationComponent } from './modals/product-relocation/product-relocation.component';
import { PermissionsService } from '../../../services/src/lib/endpoint/permissions/permissions.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {

  pagerValues = [50, 100, 1000];

  /**timeout for send request */
  requestTimeout;

  /**previous reference to detect changes */
  previousProductReferencePattern = '';
  pauseListenFormChange = false;
  permision:boolean;

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild('filterButtonReferences') filterButtonReferences: FilterButtonComponent;
  @ViewChild('filterButtonModels') filterButtonModels: FilterButtonComponent;
  @ViewChild('filterButtonColors') filterButtonColors: FilterButtonComponent;
  @ViewChild('filterButtonSizes') filterButtonSizes: FilterButtonComponent;
  @ViewChild('filterButtonWarehouses') filterButtonWarehouses: FilterButtonComponent;
  @ViewChild('filterButtonContainers') filterButtonContainers: FilterButtonComponent;
  @ViewChild('filterButtonBrands') filterButtonBrands: FilterButtonComponent;
  @ViewChild('filterButtonSuppliers') filterButtonSuppliers: FilterButtonComponent;

  form: FormGroup = this.formBuilder.group({
    suppliers: [],
    brands: [],
    references: [],
    containers: [],
    models: [],
    colors: [],
    sizes: [],
    productReferencePattern: [],
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

  /**form to select elements to print or for anything */
  selectedForm: FormGroup = this.formBuilder.group({}, {
    validators: validators.haveItems("toSelect")
  });

  products: ProductModel.Product[] = [];
  displayedColumns: string[] = ['select', 'reference', 'model', 'color', 'size', 'warehouse', 'container', 'brand', 'supplier'];
  dataSource: any;

  /**Filters */
  references: Array<TagsInputOption> = [];
  models: Array<TagsInputOption> = [];
  colors: Array<TagsInputOption> = [];
  sizes: Array<TagsInputOption> = [];
  warehouses: Array<TagsInputOption> = [];
  containers: Array<TagsInputOption> = [];
  brands: Array<TagsInputOption> = [];
  suppliers: Array<TagsInputOption> = [];
  groups: Array<TagsInputOption> = [];

  /**List of SearchInContainer */
  searchsInContainer: Array<InventoryModel.SearchInContainer> = [];

  itemsIdSelected: Array<any> = [];

  isFirst: boolean = true;
  hasDeleteProduct = false;

  //For filter popovers
  isFilteringReferences: number = 0;
  isFilteringModels: number = 0;
  isFilteringColors: number = 0;
  isFilteringSizes: number = 0;
  isFilteringWarehouses: number = 0;
  isFilteringContainers: number = 0;
  isFilteringBrands: number = 0;
  isFilteringSuppliers: number = 0;

  lastUsedFilter: string = 'warehouses';
  isMobileApp: boolean = false;

  //For sorting
  lastOrder = [true, true, true, true, true, true, true, true];

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
    private permisionService: PermissionsService
  ) {
    this.isMobileApp = typeof window.cordova !== "undefined";
  }

  eraseFilters() {
    this.form = this.formBuilder.group({
      suppliers: [],
      brands: [],
      references: [],
      containers: [],
      models: [],
      colors: [],
      sizes: [],
      productReferencePattern: [],
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
    this.lastUsedFilter = 'warehouses';
    this.getFilters();
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
      case 'model': {
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
      case 'color': {
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
      case 'size': {
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
      case 'warehouse': {
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
      case 'container': {
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
      case 'brand': {
        if (this.lastOrder[6]) {
          this.form.value.orderby = { order: "desc", type: 9 };
          this.showArrow(6, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 9 };
          this.showArrow(6, true);
        }
        this.lastOrder[6] = !this.lastOrder[6];
        break;
      }
      case 'supplier': {
        if (this.lastOrder[7]) {
          this.form.value.orderby = { order: "desc", type: 10 };
          this.showArrow(7, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 10 };
          this.showArrow(7, true);
        }
        this.lastOrder[7] = !this.lastOrder[7];
        break;
      }
    }
    this.searchInContainer(this.sanitize(this.getFormValueCopy()));
  }

  showArrow(colNumber, dirDown) {
    let htmlColumn = document.getElementsByClassName('title')[colNumber] as HTMLElement;
    if (dirDown) htmlColumn.innerHTML += ' 🡇';
    else htmlColumn.innerHTML += ' 🡅';
  }

  applyFilters(filters, filterType) {
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
          if (model.checked) modelsFiltered.push(model.reference);
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
          if (size.checked) sizesFiltered.push(size.value);
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
      case 'containers':
        let containersFiltered: number[] = [];
        for (let container of filters) {
          if (container.checked) containersFiltered.push(container.id);
        }
        if (containersFiltered.length >= this.containers.length) {
          this.form.value.containers = [];
          this.isFilteringContainers = this.containers.length;
        } else {
          if (containersFiltered.length > 0) {
            this.form.value.containers = containersFiltered;
            this.isFilteringContainers = containersFiltered.length;
          } else {
            this.form.value.containers = [99999];
            this.isFilteringContainers = this.containers.length;
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
            this.form.value.brands = [99999];
            this.isFilteringBrands = this.brands.length;
          }
        }
        break;
      case 'suppliers':
        let suppliersFiltered: string[] = [];
        for (let supplier of filters) {
          if (supplier.checked) suppliersFiltered.push(supplier.value);
        }
        if (suppliersFiltered.length >= this.suppliers.length) {
          this.form.value.suppliers = [];
          this.isFilteringSuppliers = this.suppliers.length;
        } else {
          if (suppliersFiltered.length > 0) {
            this.form.value.suppliers = suppliersFiltered;
            this.isFilteringSuppliers = suppliersFiltered.length;
          } else {
            this.form.value.suppliers = ['99999'];
            this.isFilteringSuppliers = this.suppliers.length;
          }
        }
        break;
    }
    this.lastUsedFilter = filterType;
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

  /**
   * Select or unselect all visible products
   * @param event to check the status
   */
  selectAll(event): void {
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control => {
      control.setValue(value);
    });

    if (value) {
      this.itemsIdSelected = this.searchsInContainer;
    } else {
      this.itemsIdSelected = [];
    }
  }

  /**
   * Print the label for selected products
   */
  printLabelProducts(): void {
    let references = this.selectedForm.value.toSelect.map((product, i) => product ? this.searchsInContainer[i].productShoeUnit.reference : false).filter(product => product);
    this.intermediaryService.presentLoading("Imprimiendo los productos seleccionados");
    this.printerService.printTagBarcode(references).subscribe(result => {
      this.intermediaryService.dismissLoading();
    }, error => {
      this.intermediaryService.dismissLoading();
    });
  }

  /**
 * Print the price for selected products
 */
  printPriceProducts(): void {
    let references = this.selectedForm.value.toSelect.map((product, i) => product ? this.searchsInContainer[i].productShoeUnit.reference : false).filter(product => product);
    this.intermediaryService.presentLoading("Imprimiendo los productos seleccionados");
    this.printerService.printTagPrices(references).subscribe(result => {
      this.intermediaryService.dismissLoading();
    }, error => {
      this.intermediaryService.dismissLoading();
    });
  }

  ngOnInit() {
    this.usersService.hasDeleteProductPermission().then((observable) => {
      observable.subscribe((response) => {
        this.hasDeleteProduct = response.body.data;
      })
    });
    this.getPermisionUser()

    this.getFilters();
    this.listenChanges();
  }

  /**
   * Listen changes in form to resend the request for search
   */
  listenChanges(): void {
    let previousPageSize = this.form.value.pagination.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.form.get("pagination").patchValue({
        limit: page.pageSize,
        page: flag ? page.pageIndex : 1
      });
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

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  /**
   * Cancel event and stop it propagation
   * @params e - the event to cancel
   */
  prevent(e): void {
    e.preventDefault();
    e.stopPropagation();
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
   */
  searchInContainer(parameters): void {
    this.intermediaryService.presentLoading();
    this.inventoryServices.searchInContainer(parameters).subscribe(searchsInContainer => {
      this.intermediaryService.dismissLoading();
      this.searchsInContainer = searchsInContainer.data.results;
      this.initSelectForm();
      this.dataSource = new MatTableDataSource<InventoryModel.SearchInContainer>(this.searchsInContainer);
      let paginator: any = searchsInContainer.data.pagination;

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
      if (this.lastUsedFilter != 'models') {
        let filteredModels = searchsInContainer.data.filters['models'] as unknown as string[];
        for (let index in this.models) {
          this.models[index].hide = !filteredModels.includes(this.models[index].value);
        }
        this.filterButtonModels.listItems = this.models;
      }
      if (this.lastUsedFilter != 'colors') {
        let filteredColors = searchsInContainer.data.filters['colors'] as unknown as string[];
        for (let index in this.colors) {
          this.colors[index].hide = !filteredColors.includes(this.colors[index].value);
        }
        this.filterButtonColors.listItems = this.colors;
      }
      if (this.lastUsedFilter != 'sizes') {
        let filteredSizes = searchsInContainer.data.filters['sizes'] as unknown as string[];
        for (let index in this.sizes) {
          this.sizes[index].hide = !filteredSizes.includes(this.sizes[index].value);
        }
        this.filterButtonSizes.listItems = this.sizes;
      }
      if (this.lastUsedFilter != 'warehouses') {
        let filteredWarehouses = searchsInContainer.data.filters['warehouses'] as unknown as (string | number)[];
        for (let index in this.warehouses) {
          this.warehouses[index].hide = !filteredWarehouses.includes(this.warehouses[index].reference);
        }
        this.filterButtonWarehouses.listItems = this.warehouses;
      }
      if (this.lastUsedFilter != 'containers') {
        let filteredContainers = searchsInContainer.data.filters['containers'] as unknown as string[];
        for (let index in this.containers) {
          this.containers[index].hide = !filteredContainers.includes(this.containers[index].value);
        }
        this.filterButtonContainers.listItems = this.containers;
      }
      if (this.lastUsedFilter != 'brands') {
        let filteredBrands = searchsInContainer.data.filters['brands'] as unknown as string[];
        for (let index in this.brands) {
          this.brands[index].hide = !filteredBrands.includes(this.brands[index].value);
        }
        this.filterButtonBrands.listItems = this.brands;
      }
      if (this.lastUsedFilter != 'suppliers') {
        let filteredSuppliers = searchsInContainer.data.filters['suppliers'] as unknown as string[];
        for (let index in this.suppliers) {
          this.suppliers[index].hide = !filteredSuppliers.includes(this.suppliers[index].value);
        }
        this.filterButtonSuppliers.listItems = this.suppliers;
      }
    }, () => {
      this.intermediaryService.dismissLoading();
    });
  }

  /**
   * go to details modal
   * @param id - the id of the product
   */
  async goDetails(product: InventoryModel.SearchInContainer) {
    return (await this.modalController.create({
      component: ProductDetailsComponent,
      componentProps: {
        product: product,
        permision: this.permision
      }
    })).present();
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
    this.inventoryServices.getFileExcell(this.sanitize(formToExcel)).pipe(
      catchError(error => of(error)),
      // map(file => file.error.text)
    ).subscribe((data) => {
      console.log(data);

      const blob = new Blob([data], { type: 'application/octet-stream' });
      Filesave.saveAs(blob, `${Date.now()}.xlsx`)
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess('Archivo descargado')
    }, error => console.log(error));
  }

  // FIXES pro
  async deleteProducts() {
    let id = this.selectedForm.value.toSelect.map((product, i) =>
      product ? this.searchsInContainer[i].productShoeUnit.id : false)
      .filter(product => product);

    await this.intermediaryService.presentLoading('Borrando productos');
    this.inventoryServices.delete_Products(id).subscribe(async result => {
      this.getFilters();
      console.log(result);
    }, async error => {
      await this.intermediaryService.dismissLoading();
    });
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
            this.initSelectForm();
          }
        }, {
          text: 'Si',
          handler: async () => {
            await this.deleteProducts();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * get all filters to fill the selects
   */
  getFilters(): void {
    this.intermediaryService.presentLoading();
    this.warehouseService.getIndex().then(observable => {
      observable.subscribe(response => {
        this.warehouses = (<any>response.body).data;
        let warehouseMain = (<any>response.body).data.filter(item => item.is_main)
        let warehouse = this.warehouses[0];
        if (warehouseMain.length > 0) {
          warehouse = warehouseMain[0];
        }

        this.inventoryServices.searchFilters({}).subscribe(searchsInContainer => {
          this.updateFilterSourceReferences(searchsInContainer.data.filters.references);
          this.updateFilterSourceModels(searchsInContainer.data.filters.models);
          this.updateFilterSourceColors(searchsInContainer.data.filters.colors);
          this.updateFilterSourceSizes(searchsInContainer.data.filters.sizes);
          this.updateFilterSourceWarehouses(searchsInContainer.data.filters.warehouses);
          this.updateFilterSourceContainers(searchsInContainer.data.filters.containers);
          this.updateFilterSourceBrands(searchsInContainer.data.filters.brands);
          this.updateFilterSourceSuppliers(searchsInContainer.data.filters.suppliers);
          this.updateFilterSourceOrdertypes(searchsInContainer.data.filters.ordertypes);

          for (let index in this.warehouses) {
            this.warehouses[index].checked = false;
          }
          this.warehouses[0].checked = true;

          this.isFilteringReferences = this.references.length;
          this.isFilteringModels = this.models.length;
          this.isFilteringColors = this.colors.length;
          this.isFilteringSizes = this.sizes.length;
          this.isFilteringWarehouses = 1;
          this.isFilteringContainers = this.containers.length;
          this.isFilteringBrands = this.brands.length;
          this.isFilteringSuppliers = this.suppliers.length;

          setTimeout(() => {
            this.pauseListenFormChange = false;
            this.pauseListenFormChange = true;
            this.form.get("warehouses").patchValue([warehouse.id], { emitEvent: false });
            this.form.get("orderby").get("type").patchValue("" + TypesService.ID_TYPE_ORDER_PRODUCT_DEFAULT, { emitEvent: false });
            setTimeout(() => {
              this.pauseListenFormChange = false;
              this.searchInContainer(this.sanitize(this.getFormValueCopy()));
            }, 0);
          }, 0);
        }, () => {
          this.intermediaryService.dismissLoading();
        });
      }, () => {
        this.intermediaryService.dismissLoading();
      });
    });
  }

  public getProductLocation(product) : string {
    let location: string = '';
    switch(product.locationType){
      case 1:
        if(product.container != null) location = product.container.reference;
        break;
      case 2:
        if(product.carrier != null) location = product.carrier.reference;
        break;
      case 3:
        location = 'SORTER';
        break;
    }
    return location;
  }

  /**
   * @description regresa Permisos de User
   * @author Gaetano Sabino
   */
  private getPermisionUser(){
    this.permisionService.getGestionPermision().then(obs =>{
      obs.subscribe(permision =>{
        this.permision = permision.body.data;
      })
    });
    
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

  private updateFilterSourceModels(models: FiltersModel.Model[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("productReferencePattern").value;
    this.models = models.map(model => {
      model.id = <number>(<unknown>model.reference);
      model.name = model.reference;
      model.value = model.name;
      model.checked = true;
      model.hide = false;
      return model;
    });
    if (value && value.length) {
      this.form.get("productReferencePattern").patchValue(value, { emitEvent: false });
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

  private updateFilterSourceSizes(sizes: FiltersModel.Size[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("sizes").value;
    this.sizes = sizes
      .filter((value, index, array) => array.findIndex(x => x.name == value.name) === index)
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
      warehouse.name = warehouse.reference + " - " + warehouse.name;
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

  private updateFilterSourceContainers(containers: FiltersModel.Container[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("containers").value;
    this.containers = containers.map(container => {
      container.name = container.reference;
      container.value = container.name;
      container.checked = true;
      container.hide = false;
      return container;
    });
    if (value && value.length) {
      this.form.get("containers").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
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

  private updateFilterSourceSuppliers(suppliers: FiltersModel.Supplier[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("suppliers").value;
    this.suppliers = suppliers.map(supplier => {
      supplier.value = supplier.name;
      supplier.checked = true;
      supplier.hide = false;
      return supplier;
    });
    if (value && value.length) {
      this.form.get("suppliers").patchValue(value, { emitEvent: false });
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

  async presentAlertRelocation() {
    let modal = await this.modalController.create({
      component: ProductRelocationComponent,
      componentProps: {
        products: this.itemsIdSelected,
        permision:this.permision
      },
      cssClass: 'modal-relocation'
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data.dismissed) {
        this.searchInContainer(this.sanitize(this.getFormValueCopy()));
        this.itemsIdSelected = [];
      }else if(!data.data.dismissed){
        this.selectedForm.controls.toSelect.reset()
        this.itemsIdSelected = [];
      }
    });
    modal.present();
  }

  itemSelected(product) {

    const index = this.itemsIdSelected.indexOf(product, 0);
    if (index > -1) {
      this.itemsIdSelected.splice(index, 1);
    } else {
      this.itemsIdSelected.push(product);
    }
    
  }
}


