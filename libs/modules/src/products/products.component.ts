import { BehaviorSubject, of } from 'rxjs';
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
  TypeModel,
  TypesService,
  WarehouseService,
  WarehousesService,
  IntermediaryService, UsersService

} from '@suite/services';

import { HttpResponse } from '@angular/common/http';

import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { ProductDetailsComponent } from './modals/product-details/product-details.component';
import { ModalController, AlertController } from '@ionic/angular';
import { validators } from '../utils/validators';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { TagsInputComponent } from "../components/tags-input/tags-input.component";
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { map, catchError } from 'rxjs/operators';
import { ProductRelocationComponent } from './modals/product-relocation/product-relocation.component';


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


  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;


  form: FormGroup = this.formBuilder.group({
    containers: [[]],
    brand: [[]],
    models: [[]],
    colors: [[]],
    sizes: [[]],
    productReferencePattern: '',
    warehouses: [[]],
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: '5',
      order: "asc"
    })
  });

  filterPriority: Array<number> = [];
  filterPriorityIndex: number;
  filtersToUpdate: Array<number> = []

  /**form to select elements to print or for anything */
  selectedForm: FormGroup = this.formBuilder.group({}, {
    validators: validators.haveItems("toSelect")
  });

  formValueChanges = new BehaviorSubject(this.form.value)
  formValueChanges$ = this.formValueChanges.asObservable()
  formCurrentValue = this.form.value;
  products: ProductModel.Product[] = [];
  displayedColumns: string[] = ['select', 'reference', 'model', 'color', 'size', 'warehouse', 'container', 'brands'];
  dataSource: any;

  /**Filters */
  brands: Array<TagsInputOption> = [];
  colors: Array<TagsInputOption> = [];
  containers: Array<TagsInputOption> = [];
  models: Array<TagsInputOption> = [];
  sizes: Array<TagsInputOption> = [];
  warehouses: Array<TagsInputOption> = [];
  groups: Array<TagsInputOption> = [];

  /**List of SearchInContainer */
  searchsInContainer: Array<InventoryModel.SearchInContainer> = [];

  itemsIdSelected: Array<any> = [];

  isFirst: boolean = true;
  hasDeleteProduct = false;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

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
  ) { }

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
    if (!object.orderby.order)
      delete object.orderby.order;
    if (object.productReferencePattern) {
      object.productReferencePattern = "%" + object.productReferencePattern + "%";
    }
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

    this.getFilters();
    this.observerChanges();

    this.formValueChanges$.subscribe(value => {
      const currentValue = JSON.stringify(this.formCurrentValue);
      const newValue = JSON.stringify(value);
      if (currentValue !== newValue) {
        if (value.containers.length > this.formCurrentValue.containers.length) {
          if (value.containers.length > 0 && this.filterPriority.find(e => e == Filter.CONTAINERS) === undefined) {
            this.filterPriority.push(Filter.CONTAINERS)
          }
          this.filterPriorityIndex = this.filterPriority.findIndex(e => e == Filter.CONTAINERS)
        }
        if (value.brand.length > this.formCurrentValue.brand.length) {
          if (value.brand.length > 0 && this.filterPriority.find(e => e == Filter.BRANDS) === undefined) {
            this.filterPriority.push(Filter.BRANDS)
          }
          this.filterPriorityIndex = this.filterPriority.findIndex(e => e == Filter.BRANDS)
        }
        if (value.models.length > this.formCurrentValue.models.length) {
          if (value.models.length > 0 && this.filterPriority.find(e => e == Filter.MODELS) === undefined) {
            this.filterPriority.push(Filter.MODELS)
          }
          this.filterPriorityIndex = this.filterPriority.findIndex(e => e == Filter.MODELS)
        }
        if (value.colors.length > this.formCurrentValue.colors.length) {
          if (value.colors.length > 0 && this.filterPriority.find(e => e == Filter.COLORS) === undefined) {
            this.filterPriority.push(Filter.COLORS)
          }
          this.filterPriorityIndex = this.filterPriority.findIndex(e => e == Filter.COLORS)

        }
        if (value.sizes.length > this.formCurrentValue.sizes.length) {
          if (value.sizes.length > 0 && this.filterPriority.find(e => e == Filter.SIZES) === undefined) {
            this.filterPriority.push(Filter.SIZES)
          }
          this.filterPriorityIndex = this.filterPriority.findIndex(e => e == Filter.SIZES)
        }
        if (value.productReferencePattern !== this.formCurrentValue.productReferencePattern) {
          if (value.productReferencePattern && value.productReferencePattern.length > 0 && this.filterPriority.find(e => e == Filter.MODELS) === undefined) {
            this.filterPriority.push(Filter.MODELS)
          }
          this.filterPriorityIndex = this.filterPriority.findIndex(e => e == Filter.MODELS)
        }
        if (value.warehouses.length > this.formCurrentValue.warehouses.length) {
          if (value.warehouses.length > 0 && this.filterPriority.find(e => e == Filter.WAREHOUSES) === undefined) {
            this.filterPriority.push(Filter.WAREHOUSES)
          }
          this.filterPriorityIndex = this.filterPriority.findIndex(e => e == Filter.WAREHOUSES)
        }
        this.formCurrentValue = value
        if (!this.isFirst) {
          this.getFilters()
        }
        if (this.isFirst) {
          this.isFirst = false;
        }
      }
    })

  }

  // TODO PORQUE?
  observerChanges(){
    this.form.valueChanges.subscribe(value => {

      this.formValueChanges.next(value)
    })
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
      // console.log(change);

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
    this.form.patchValue({
      productReferencePattern: `${this.form.value.productReferencePattern}`
    })
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
      // // console.log(this.dataSource);

      let paginator: any = searchsInContainer.data.pagination;

      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.selectPage;
      this.paginator.lastPage = paginator.lastPage;

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
        product: product
      }
    })).present();
  }

  // TODO METODO LLAMAR ARCHIVO EXCELL
  /**
   * @description Eviar parametros y recibe un archivo excell
   */
  async fileExcell(){
    this.intermediaryService.presentLoading('Descargando Archivo Excell');
    this.inventoryServices.getFileExcell(this.formCurrentValue).pipe(
      catchError(error => of(error)),
      // map(file => file.error.text)
    ).subscribe((data)=>{
      console.log(data);

      const blob = new Blob([data], { type: 'application/octet-stream' });
      Filesave.saveAs(blob,`${Date.now()}.xlsx`)
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess('Archivo descargado')
    },error => console.log(error));
  }

  // FIXES pro
  async deleteProducts(){
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
        // console.log(response);
        this.warehouses = (<any>response.body).data;
        let warehouseMain = (<any>response.body).data.filter(item => item.is_main)
        let warehouse = this.warehouses[0];
        if (warehouseMain.length > 0) {
          warehouse = warehouseMain[0];
        }
        let params;
        if (this.isFirst) {
          params = {};
        } else {
          if (this.form.value.productReferencePattern) {
            this.form.patchValue({
              productReferencePattern: this.form.value.productReferencePattern.toString()
            })
          } else {
            this.form.patchValue({
              productReferencePattern: ""
            })
          }
          params = this.form.value;
        }



        this.inventoryServices.searchFilters(params).subscribe(searchsInContainer => {
          // console.log(searchsInContainer);
          //TODO QUI DOBBIAMO CREARE IL METODO PER RESTITUIRE IL BRANDS
          /**
           */




          if (this.filterPriority.find(e => e == Filter.BRANDS) == undefined) {
            this.updateFiltersourceBrands(searchsInContainer.data.filters.brands);
          }
          if (this.filterPriority.find(e => e == Filter.COLORS) == undefined) {
            this.updateFilterSourceColors(searchsInContainer.data.filters.colors);
          }
          if (this.filterPriority.find(e => e == Filter.CONTAINERS) == undefined) {
            this.updateFilterSourceContainers(searchsInContainer.data.filters.containers);
          }
          if (this.filterPriority.find(e => e == Filter.MODELS) == undefined) {
            this.updateFilterSourceModels(searchsInContainer.data.filters.models);
          }
          if (this.filterPriority.find(e => e == Filter.SIZES) == undefined) {
            this.updateFilterSourceSizes(searchsInContainer.data.filters.sizes);
          }
          if (this.filterPriority.find(e => e == Filter.WAREHOUSES) == undefined) {
            this.updateFilterSourceWarehouses(searchsInContainer.data.filters.warehouses);
          }

          let i = this.filterPriorityIndex + 1
          if (i + 1 < this.filterPriority.length) {
            while (i < this.filterPriority.length) {
              if (this.filterPriority[i] == Filter.BRANDS) {
                this.updateFiltersourceBrands(searchsInContainer.data.filters.brands);
              }
              if (this.filterPriority[i] == Filter.COLORS) {
                this.updateFilterSourceColors(searchsInContainer.data.filters.colors);
              }
              if (this.filterPriority[i] == Filter.CONTAINERS) {
                this.updateFilterSourceContainers(searchsInContainer.data.filters.containers);
              }
              if (this.filterPriority[i] == Filter.MODELS) {
                this.updateFilterSourceModels(searchsInContainer.data.filters.models);
              }
              if (this.filterPriority[i] == Filter.SIZES) {
                this.updateFilterSourceSizes(searchsInContainer.data.filters.sizes);
              }
              if (this.filterPriority[i] == Filter.WAREHOUSES) {
                this.updateFilterSourceWarehouses(searchsInContainer.data.filters.warehouses);
              }
              i++;
            }
          }


          this.updateFilterSourceOrdertypes(searchsInContainer.data.filters.ordertypes);
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

  public getProductLocation(product): string {
    if (product) {
      if (product.locationType == 3) {
        return 'SORTER';
      } else {
        if (product.carrier && product.carrier.reference) {
          return product.carrier.reference;
        } else {
          if (product.container && product.container.reference) {
            return product.container.reference;
          }
        }
      }
    }

    return '';
  }

  private updateFiltersourceBrands(brands: FiltersModel.Brands[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("brand").value;
    // console.log(value);

    this.brands = brands;
    if (value && value.length) {
      this.form.get("brand").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceColors(colors: FiltersModel.Color[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("colors").value;
    this.colors = colors;
    if (value && value.length) {
      this.form.get("colors").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
    // // console.log(value);

  }

  private updateFilterSourceContainers(containers: FiltersModel.Container[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("containers").value;
    this.containers = containers.map(container => {
      container.name = container.reference;
      return container;
    });
    if (value && value.length) {
      this.form.get("containers").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceModels(models: FiltersModel.Model[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("productReferencePattern").value;
    this.models = models.map(model => {
      model.id = <number>(<unknown>model.reference);
      model.name = model.reference;
      return model;
    });
    if (value && value.length) {
      this.form.get("productReferencePattern").patchValue(value, { emitEvent: false });
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
      return warehouse;
    });
    if (value && value.length) {
      this.form.get("warehouses").patchValue(value, { emitEvent: false });
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
        products: this.itemsIdSelected
      },
      cssClass: 'modal-relocation'
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data.dismissed){
        this.getFilters();
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


