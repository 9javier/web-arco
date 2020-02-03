import {Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { HolderTooltipText } from '../../../services/src/lib/tooltipText/holderTooltipText.service';

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
  IntermediaryService,
} from '@suite/services';

import {HttpResponse} from '@angular/common/http';

import { FormBuilder,FormGroup, FormControl, FormArray } from '@angular/forms';

import { ProductDetailsAlComponent } from './modals-al/product-details-al/product-details-al.component';
import { ModalController } from '@ionic/angular';
import { validators } from '../utils/validators';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { TagsInputComponent } from "../components/tags-input/tags-input.component";
import { PaginatorComponent } from '../components/paginator/paginator.component';

@Component({
  selector: 'app-products',
  templateUrl: './products-al.component.html',
  styleUrls: ['./products-al.component.scss']
})



export class ProductsAlComponent implements OnInit {



  pagerValues = [50, 100, 1000];

  /**timeout for send request */
  requestTimeout;
  /**previous reference to detect changes */
  previousProductReferencePattern = '';
  pauseListenFormChange = false;


  @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;


  form:FormGroup = this.formBuilder.group({
    containers: [],
    models: [],
    colors: [],
    sizes: [],
    productReferencePattern: [],
    warehouses:[],
    pagination: this.formBuilder.group({
        page: 1,
        limit: this.pagerValues[0]
    }),
    orderby:this.formBuilder.group( {
        type: '',
        order: "asc"
    })
  });

  /**form to select elements to print or for anything */
  selectedForm:FormGroup = this.formBuilder.group({},{
    validators:validators.haveItems("toSelect")
  });



  products: ProductModel.Product[] = [];
  displayedColumns: string[] = ['select', 'reference', 'model', 'color', 'size', 'warehouse', 'container'];
  dataSource: any;
  flagPageChange: boolean = false;
  flagSizeChange: boolean = false;

  /**Filters */
  colors:Array<TagsInputOption> = [];
  containers:Array<TagsInputOption> = [];
  models:Array<TagsInputOption> = [];
  sizes:Array<TagsInputOption> = [];
  warehouses:Array<TagsInputOption> = [];
  groups:Array<TagsInputOption> = [];

  /**List of SearchInContainer */
  searchsInContainer:Array<InventoryModel.SearchInContainer> = [];



  // @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

  public showFiltersMobileVersion: boolean = false;

  constructor(
    private intermediaryService:IntermediaryService,
    private warehouseService:WarehouseService,
    private warehousesService:WarehousesService,
    private typeService:TypesService,
    private formBuilder:FormBuilder,
    private inventoryServices:InventoryService,
    private filterServices:FiltersService,
    private productsService: ProductsService,
    private modalController:ModalController,
    private printerService:PrinterService,
    private holderTooltipText: HolderTooltipText,
  ) {}


  btnOnClick(idElement:string, txtElement?:string){
    this.holderTooltipText.setTootlTip(idElement,true,txtElement);
  }

  openFiltersMobile() {
    this.showFiltersMobileVersion = !this.showFiltersMobileVersion;
  }




  /**
   * clear empty values of objecto to sanitize it
   * @param object Object to sanitize
   * @return the sanitized object
   */
  sanitize(object){
    /**mejorable */
    object = JSON.parse(JSON.stringify(object));
    if(!object.orderby.type){
      delete object.orderby.type;
    }else{
      object.orderby.type = parseInt(object.orderby.type);
    }
    if(!object.orderby.order)
      delete object.orderby.order;
    Object.keys(object).forEach(key=>{
      if(object[key] instanceof Array){
        if(object[key][0] instanceof Array){
          object[key] = object[key][0];
        } else {
          for(let i = 0;i<object[key].length;i++) {
            if(object[key][i] === null || object[key][i] === "") {
              object[key].splice(i,1);
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
  selectAll(event):void{
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control=>{
      control.setValue(value);
    });
  }

  /**
   * Print the label for selected products
   */
  printLabelProducts():void{
    let references = this.selectedForm.value.toSelect.map((product,i)=>product?this.searchsInContainer[i].productShoeUnit.reference:false).filter(product=>product);
    this.intermediaryService.presentLoading("Imprimiendo los productos seleccionados");
    this.printerService.printTagBarcode(references).subscribe(result=>{
      this.intermediaryService.dismissLoading();
    },error=>{
      this.intermediaryService.dismissLoading();
    });
  }

    /**
   * Print the price for selected products
   */
  printPriceProducts():void{
    let references = this.selectedForm.value.toSelect.map((product,i)=>product?this.searchsInContainer[i].productShoeUnit.reference:false).filter(product=>product);
    this.intermediaryService.presentLoading("Imprimiendo los productos seleccionados");
    this.printerService.printTagPrices(references).subscribe(result=>{
      if(result && typeof result !== "boolean"){
        result.subscribe(r=>{});
      }
      this.intermediaryService.dismissLoading();
    },error=>{
      this.intermediaryService.dismissLoading();
    });
  }


  ngOnInit() {
    this.getFilters();
    this.listenChanges();
  }

  /**
   * Listen changes in form to resend the request for search
   */
  listenChanges():void{
    let previousPageSize = this.form.value.pagination.limit;
    let previousPageIndex = this.form.value.pagination.page;
    /**detect changes in the paginator */
    this.paginatorComponent.page.subscribe(page=>{
      /**true if only change the number of results */
      let flagSize = previousPageSize != page.pageSize;
      let flagIndex = previousPageIndex != page.pageIndex;
      this.flagSizeChange = flagSize;
      this.flagPageChange = flagIndex;
      previousPageSize = page.pageSize;
      previousPageIndex = page.pageIndex;
      if(flagIndex){
        this.form.get("pagination").patchValue({
          limit: previousPageSize,
          page: page.pageIndex
        });
      }else if(flagSize){
        this.form.get("pagination").patchValue({
          limit: page.pageSize,
          page: 1
        });
      }else{
        this.form.get("pagination").patchValue({
          limit: previousPageSize,
          page: previousPageIndex
        });
      }
    });

    /**detect changes in the form */
    this.form.statusChanges.subscribe(change=>{
      if(this.flagSizeChange || this.flagPageChange){
        if (this.pauseListenFormChange) return;
        ///**format the reference */
        /**cant send a request in every keypress of reference, then cancel the previous request */
        clearTimeout(this.requestTimeout)
        /**it the change of the form is in reference launch new timeout with request in it */
        if(this.form.value.productReferencePattern != this.previousProductReferencePattern){
          /**Just need check the vality if the change happens in the reference */
          if(this.form.valid){
            this.requestTimeout = setTimeout(() => {
              this.searchInContainer(this.sanitize(this.getFormValueCopy()));
            }, 1000);
          }
        }else{
          /**reset the paginator to the 0 page */
          this.searchInContainer(this.sanitize(this.getFormValueCopy()));
        }
        /**assign the current reference to the previous reference */
        this.previousProductReferencePattern = this.form.value.productReferencePattern;
        this.flagPageChange = false;
        this.flagSizeChange = false;
      }else{
        return;
      }
    });
  }

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  /**
   * Cancel event and stop it propagation
   * @params e - the event to cancel
   */
  prevent(e):void{
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * init selectForm controls
   */
  initSelectForm():void{
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect",this.formBuilder.array(this.searchsInContainer.map(product=>new FormControl(false))));
  }

  /**
   * search products in container by criteria
   * @param parameters - parameters to search
   * @param applyFilter - parameters to search
   */
  searchInContainer(parameters, applyFilter: boolean = false): void {
    if(applyFilter){
      parameters.pagination.page = 1;
    }
    this.intermediaryService.presentLoading();
    this.inventoryServices.searchInContainer(parameters).subscribe(searchsInContainer=>{
      this.showFiltersMobileVersion = false;
      this.intermediaryService.dismissLoading();
      this.searchsInContainer = searchsInContainer.data.results;
      this.initSelectForm();
      this.dataSource = new MatTableDataSource<InventoryModel.SearchInContainer>(this.searchsInContainer);
      let paginator: any = searchsInContainer.data.pagination;

      this.paginatorComponent.length = paginator.totalResults;
      this.paginatorComponent.pageIndex = paginator.selectPage;
      this.paginatorComponent.lastPage = paginator.lastPage;

      if(applyFilter){
        //this.saveFilters();
        this.form.get("pagination").patchValue({
          limit: this.form.value.pagination.limit,
          page: 1
        }, { emitEvent: false });
        //this.recoverFilters();
      }
    },()=>{
      this.intermediaryService.dismissLoading();
    });
  }

  /**
   * go to details modal
   * @param id - the id of the product
   */
    async goDetails(product:InventoryModel.SearchInContainer){
      return (await this.modalController.create({
        component:ProductDetailsAlComponent,
        componentProps:{
          product:product
        }
      })).present();
    }


  /**
   * get all filters to fill the selects
   */
  getFilters():void{
    this.intermediaryService.presentLoading();
    this.warehouseService.getIndex().then(observable=>{
      observable.subscribe(response=>{
        this.warehouses = (<any>response.body).data;
        let warehouseMain = (<any>response.body).data.filter(item => item.is_main)
        let warehouse = this.warehouses[0];
        if(warehouseMain.length > 0) {
          warehouse = warehouseMain[0];
        }

        this.inventoryServices.searchFilters({}).subscribe(searchsInContainer=>{
          this.updateFilterSourceWarehouses(searchsInContainer.data.filters.warehouses);
          this.updateFilterSourceColors(searchsInContainer.data.filters.colors);
          this.updateFilterSourceContainers(searchsInContainer.data.filters.containers);
          this.updateFilterSourceModels(searchsInContainer.data.filters.models);
          this.updateFilterSourceSizes(searchsInContainer.data.filters.sizes);
          this.updateFilterSourceOrdertypes(searchsInContainer.data.filters.ordertypes);
          setTimeout(() => {
            this.pauseListenFormChange = false;
            this.pauseListenFormChange = true;
            this.form.get("warehouses").patchValue([warehouse.id], {emitEvent: false});
            this.form.get("orderby").get("type").patchValue("" + TypesService.ID_TYPE_ORDER_PRODUCT_DEFAULT, {emitEvent: false});
            setTimeout(() => {
              this.pauseListenFormChange = false;
              this.searchInContainer(this.sanitize(this.getFormValueCopy()));
            }, 0);
          }, 0);
        },()=>{
          this.intermediaryService.dismissLoading();
        });
      },()=>{
        this.intermediaryService.dismissLoading();
      });
    });
  }

  public getProductLocation(product) : string {
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

  private updateFilterSourceColors(colors: FiltersModel.Color[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("colors").value;
    this.colors = colors;
    if (value && value.length) {
      this.form.get("colors").patchValue(value, {emitEvent: false});
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceContainers(containers: FiltersModel.Container[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("containers").value;
    this.containers = containers.map(container => {
      container.name = container.reference;
      return container;
    });
    if (value && value.length) {
      this.form.get("containers").patchValue(value, {emitEvent: false});
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
      this.form.get("productReferencePattern").patchValue(value, {emitEvent: false});
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
      this.form.get("sizes").patchValue(value, {emitEvent: false});
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
      this.form.get("warehouses").patchValue(value, {emitEvent: false});
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  private updateFilterSourceOrdertypes(ordertypes: FiltersModel.Group[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("orderby").get("type").value;
    this.groups = ordertypes;
    this.form.get("orderby").get("type").patchValue(value, {emitEvent: false});
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  applyFilters() {
    if (this.pauseListenFormChange) return;
    ///**format the reference */
    /**cant send a request in every keypress of reference, then cancel the previous request */
    clearTimeout(this.requestTimeout)
    /**it the change of the form is in reference launch new timeout with request in it */
    if(this.form.value.productReferencePattern != this.previousProductReferencePattern){
      /**Just need check the vality if the change happens in the reference */
      if(this.form.valid)
        this.requestTimeout = setTimeout(()=>{
          let flagApply = true;
          this.searchInContainer(this.sanitize(this.getFormValueCopy()), flagApply);
        },1000);
    }else{
      /**reset the paginator to the 0 page */
      let flagApply = true;
      this.searchInContainer(this.sanitize(this.getFormValueCopy()), flagApply);
    }
    /**assign the current reference to the previous reference */
    this.previousProductReferencePattern = this.form.value.productReferencePattern;
  }

  clearFilters() {
    this.form = this.formBuilder.group({
      containers: [],
      models: [],
      colors: [],
      sizes: [],
      productReferencePattern: [],
      warehouses:[],
      pagination: this.formBuilder.group({
        page: 1,
        limit: this.pagerValues[0]
      }),
      orderby:this.formBuilder.group( {
        type: '',
        order: "asc"
      })
    });
  }
}
