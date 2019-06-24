import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';

import {
  ProductModel,
  ProductsService,
  FiltersService,
  FiltersModel,
  InventoryService,
  InventoryModel,
  TypeModel,
  TypesService,
  WarehousesService,
  IntermediaryService

} from '@suite/services';

import {HttpResponse} from '@angular/common/http';

import { FormBuilder,FormGroup, FormControl, FormArray } from '@angular/forms';

import { ProductDetailsComponent } from './modals/product-details/product-details.component';
import { ModalController } from '@ionic/angular';
import { validators } from '../utils/validators';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { Enum } from '../components/tags-input/models/enum.model';


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

  form:FormGroup = this.formBuilder.group({
    containers: [],
    models: [],
    colors: [],
    sizes: [],
    productReferencePattern:'',
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

  /**Filters */
  colors:Array<FiltersModel.Color> = [];
  containers:Array<Enum> = [];
  models:Array<FiltersModel.Model> = [];
  sizes:Array<FiltersModel.Size> = [];
  warehouses:Array<FiltersModel.Warehouse> = [];
  groups:Array<TypeModel.OrderProductType> = [];

  /**List of SearchInContainer */
  searchsInContainer:Array<InventoryModel.SearchInContainer> = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

  constructor(
    private intermediaryService:IntermediaryService,
    private warehouseService:WarehousesService,
    private typeService:TypesService,
    private formBuilder:FormBuilder,
    private inventoryServices:InventoryService,
    private filterServices:FiltersService,
    private productsService: ProductsService,
    private modalController:ModalController,
    private printerService:PrinterService
  ) {}

  enums=[{
    id:1,
    name:'HOLA'
  },{
    id:2,
    name:'CHAO'
  }];

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
    if(object.productReferencePattern) {
      object.productReferencePattern = "%" + object.productReferencePattern + "%";
    }
    Object.keys(object).forEach(key=>{
      if(object[key] instanceof Array){
        for(let i = 0;i<object[key].length;i++)
          if(object[key][i] === null || object[key][i] === "")
            object[key].splice(i,1);
      } else if (object[key] === null) {
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
      console.log("result of impressions",result);
      this.intermediaryService.dismissLoading();
    },error=>{
      this.intermediaryService.dismissLoading();
      console.log(error);
    });
    console.log(references);
  }

    /**
   * Print the price for selected products
   */
  printPriceProducts():void{
    let references = this.selectedForm.value.toSelect.map((product,i)=>product?this.searchsInContainer[i].productShoeUnit.reference:false).filter(product=>product);
    this.intermediaryService.presentLoading("Imprimiendo los productos seleccionados");
    this.printerService.printTagPrices(references).subscribe(result=>{
      console.log("result of impressions",result);
      this.intermediaryService.dismissLoading();
    },error=>{
      this.intermediaryService.dismissLoading();
      console.log(error);
    });
    console.log(references);
  }

  ngOnInit() {
    console.log(this.form);
    //this.initProducts();
    this.getFilters();
    /**
     * Get the main warehouse to attacth their id to the request
     */
    this.listenChanges();
  }

  /**
   * Listen changes in form to resend the request for search
   */
  listenChanges():void{ 
    let previousPageSize = this.form.value.pagination.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page=>{
      /**true if only change the number of results */
      console.log(page);
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.form.get("pagination").patchValue({
        limit:page.pageSize,
        page:flag?page.pageIndex+1:1
      });
    });

    /**detect changes in the form */
    this.form.statusChanges.subscribe(change=>{
      ///**format the reference */
      //this.form.controls.productReferencePattern.patchValue(this.buildReference(this.form.value.productReferencePattern),{emitEvent:false});
      /**cant send a request in every keypress of reference, then cancel the previous request */
      clearTimeout(this.requestTimeout)
      /**it the change of the form is in reference launch new timeout with request in it */
      if(this.form.value.productReferencePattern != this.previousProductReferencePattern){
        /**Just need check the vality if the change happens in the reference */
        if(this.form.valid)
          this.requestTimeout = setTimeout(()=>{
            this.searchInContainer(this.sanitize(this.getFormValueCopy()));
        },1000);
      }else{
        /**reset the paginator to the 0 page */
        this.paginator.pageIndex = 0;
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
   */
  searchInContainer(parameters):void{
    this.inventoryServices.searchInContainer(parameters).subscribe(searchsInContainer=>{
      this.searchsInContainer = searchsInContainer.data.results;
      this.initSelectForm();
      this.dataSource = new MatTableDataSource<InventoryModel.SearchInContainer>(this.searchsInContainer);
      let paginator = searchsInContainer.data.pagination;
      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.page - 1;
    });
  }

  /**
   * go to details modal
   * @param id - the id of the product
   */
    async goDetails(product:InventoryModel.SearchInContainer){
      console.log(product);
      return (await this.modalController.create({
        component:ProductDetailsComponent,
        componentProps:{
          product:product
        }
      })).present();
    }


  /**
   * get all filters to fill the selects
   */
  getFilters():void{

    /**get colors to filter */
    this.filterServices.getColors().subscribe(colors=>{
      this.colors = colors;
    });
    /**get containers to filter */
    this.filterServices.getContainers().subscribe(containers=>{
      this.containers = (<Array<any>>containers).map(container=>{
        container.name = container.reference
        return container;
      });
      console.log(containers,"containers");
    });
    /**get models to filter */
    this.filterServices.getModels().subscribe(models=>{
      this.models = models;
    });
    /**get sizes to filter*/
    this.filterServices.getSizes().subscribe(sizes=>{
      this.sizes = sizes;
    });
    /**get warehouses to filter */
    this.filterServices.getWarehouses().subscribe(warehouses=>{
      this.warehouses = warehouses;
      this.warehouseService.getMain().subscribe(warehouse=>{
        this.form.get("warehouses").patchValue(["" + warehouse.id], {emitEvent: false});
        this.searchInContainer(this.sanitize(this.getFormValueCopy()));
      });
    });
    /**get types to the orderby */
    this.typeService.getOrderProductTypes().subscribe(ordertypes=>{
      this.groups = ordertypes;
      console.log(this.groups,TypesService.ID_TYPE_ORDER_PRODUCT_DEFAULT);
      this.form.get("orderby").get("type").patchValue(TypesService.ID_TYPE_ORDER_PRODUCT_DEFAULT, {emitEvent: false});
      this.searchInContainer(this.sanitize(this.getFormValueCopy()));
    });
  }
}


