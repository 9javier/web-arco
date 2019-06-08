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
  WarehousesService

} from '@suite/services';

import {HttpResponse} from '@angular/common/http';

import { FormBuilder,FormGroup, FormControl } from '@angular/forms';

import { ProductDetailsComponent } from './modals/product-details/product-details.component';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {

  pagerValues = [50, 100, 1000];

  form:FormGroup = this.formBuilder.group({
    containers: this.formBuilder.array([new FormControl()]),
    models: this.formBuilder.array([new FormControl()]),
    colors: this.formBuilder.array([new FormControl()]),
    sizes: this.formBuilder.array([new FormControl()]),
    warehouses:this.formBuilder.array([new FormControl()]),
    pagination: this.formBuilder.group({
        page: 1,
        limit: this.pagerValues[0]
    }),
    orderby:this.formBuilder.group( {
        type: '',
        order: "asc"
    })
  });

  products: ProductModel.Product[] = [];
  displayedColumns: string[] = ['reference', 'model', 'color', 'size', 'warehouse', 'container'];
  dataSource: any;

  /**Filters */
  colors:Array<FiltersModel.Color> = [];
  containers:Array<FiltersModel.Container> = [];
  models:Array<FiltersModel.Model> = [];
  sizes:Array<FiltersModel.Size> = [];
  warehouses:Array<FiltersModel.Warehouse> = [];
  groups:Array<TypeModel.OrderProductType> = [];

  /**List of SearchInContainer */
  searchsInContainer:Array<InventoryModel.SearchInContainer> = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

  constructor(
    private warehouseService:WarehousesService,
    private typeService:TypesService,
    private formBuilder:FormBuilder,
    private inventoryServices:InventoryService,
    private filterServices:FiltersService,
    private productsService: ProductsService,
    private modalController:ModalController
  ) {}

    /**
   * clear empty values of objecto to sanitize it
   * @param object Object to sanitize
   * @return the sanitized object
   */
  sanitize(object){
    /**mejorable */
    object = JSON.parse(JSON.stringify(object));
    Object.keys(object).forEach(key=>{
      if(object[key] instanceof Array){
        for(let i = 0;i<object[key].length;i++)
          if(object[key][i] === null || object[key][i] === "")
            object[key].splice(i,1);
      }
      if(!object.orderby.type){
        delete object.orderby.type;
      }else{
        object.orderby.type = parseInt(object.orderby.type);
      }
      if(!object.orderby.order)
        delete object.orderby.order;
    });
    return object;
  }

  ngOnInit() {
    console.log(this.form);
    //this.initProducts();
    this.getFilters();
    /**
     * Get the main warehouse to attacth their id to the request
     */
    this.warehouseService.getMain().subscribe(warehouse=>{
      this.form.get("warehouses").patchValue(["" + warehouse.id]);
      this.form.get("orderby").get("type").patchValue("" + this.groups[0].id);
      this.searchInContainer(this.sanitize(this.form.value));
    });
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
      /**reset the paginator to the 0 page */
      this.paginator.pageIndex = 0;
      this.searchInContainer(this.sanitize(this.form.value));
    });
  }

  /**
   * search products in container by criteria
   * @param parameters - parameters to search
   */
  searchInContainer(parameters):void{
    this.inventoryServices.searchInContainer(parameters).subscribe(searchsInContainer=>{
      this.searchsInContainer = searchsInContainer.data.results;
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
      this.containers = containers;
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
    });
    /**get types to the orderby */
    this.typeService.getOrderProductTypes().subscribe(ordertypes=>{
      this.groups = ordertypes;
    });
  }
}


