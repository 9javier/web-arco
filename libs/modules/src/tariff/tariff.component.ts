import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource, MatPaginator} from '@angular/material';

import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';


import {
  IntermediaryService,
  LabelsService,
  TariffService,
  TariffModel,
  WarehousesService,
  InventoryService,
  InventoryModel,
  FiltersModel,
  TypesService
} from '@suite/services';

import { validators } from '../utils/validators';

import { FormBuilder,FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'suite-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss']
})
export class TariffComponent implements OnInit {


    /**Arrays to be shown */
    tariffs:Array<any> = [];

    filters: FormGroup = this.formBuilder.group({
      warehouseId:51
    })

    warehouses:Array<any> = [];

    /**Quantity of items for show in any page */
    pagerValues = [50, 100, 500];

    private page:number = 0;
    private limit:number = this.pagerValues[0];

    @ViewChild(MatPaginator) paginator: MatPaginator;


    displayedColumns: string[] = ['name', 'initDate', 'endDate'];
    dataSource: any;

    warehouseId:number = 51;

    /**timeout for send request */
    requestTimeout;
    /**previous reference to detect changes */
    previousProductReferencePattern = '';
    pauseListenFormChange = false;

    form:FormGroup = this.formBuilder.group({
      models: [],
      colors: [],
      productReferencePattern:'',
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

    /**Filters */
    models:Array<TagsInputOption> = [];
    colors:Array<TagsInputOption> = [];

    /**List of SearchInContainer */
    searchsInContainer:Array<InventoryModel.SearchInContainer> = [];
    

  constructor(    
    private intermediaryService:IntermediaryService,
    private formBuilder:FormBuilder,
    private tariffService:TariffService,
    private router:Router,
    private warehousesService:WarehousesService,
    private inventoryServices:InventoryService) { }

  ngOnInit() {
    console.log(this.filters);
    this.filters.patchValue({warehouseId:1});
    this.getWarehouses();
    this.getTariffs(this.page,this.limit,this.filters.value.warehouseId);
    this.listenChanges();
  }

  /**
   * init selectForm controls
   */
  initSelectForm():void{  
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect",this.formBuilder.array(this.searchsInContainer.map(product=>new FormControl(false))));
  }

  /**
   * filter the tariff by warehouse
   * @param event 
   */
  filterByWarehouse(event){
    this.warehouseId = event.detail.value;
    this.getTariffs(this.page,this.limit,this.filters.value.warehouseId);
  }

  listenChanges():void{
    let previousPageSize = this.limit
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page=>{
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.limit = page.pageSize;
      this.page = flag?page.pageIndex+1:1;
      this.getTariffs(this.page,this.limit,this.filters.value.warehouseId);
    });
  }

  /**
   * Go to product view
   * @param id - the id of the selected tariff
   */
  goPrices(id:number):void{
    let a:TariffModel.Tariff;
    this.router.navigate(['prices',id]);
  }

  getWarehouses():void{
    this.warehousesService.getIndex().then(observable=>{
      observable.subscribe(warehouses=>{
        this.warehouses = warehouses.body.data;
      });
    })
  }

  /**
   * Get labels to show
   */
  getTariffs(page:number,limit:number,id:number=51):void{
    this.intermediaryService.presentLoading();
    this.tariffService.getIndex(page, limit, id).subscribe(tariffs=>{
      this.intermediaryService.dismissLoading();
      console.log('getTari ', tariffs);
      
      /**save the data and format the dates */
      this.tariffs = tariffs.results.map(result=>{
        result.activeFrom = new Date(result.activeFrom).toLocaleDateString();
        result.activeTill = new Date(result.activeTill).toLocaleDateString();
        return result;
      });
      this.dataSource = new MatTableDataSource<any>(this.tariffs);
      let paginator = tariffs.pagination;
      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.page - 1;
    },()=>{
      this.intermediaryService.dismissLoading();
    })
  }

  /**
   * get all filters to fill the selects
   */
  getFilters():void{
    this.intermediaryService.presentLoading();

    this.warehousesService.getMain().subscribe((warehouse: FiltersModel.Warehouse) => {      
      this.inventoryServices.searchInContainer({warehouses:[warehouse.id],orderby:{type:TypesService.ID_TYPE_ORDER_PRODUCT_DEFAULT.toLocaleString()},pagination: {page: 1, limit: 0}}).subscribe(searchsInContainer=>{
        this.updateFilterSourceColors(searchsInContainer.data.filters.colors);
        // this.updateFilterSourceContainers(searchsInContainer.data.filters.containers);
        this.updateFilterSourceModels(searchsInContainer.data.filters.models);
        // this.updateFilterSourceSizes(searchsInContainer.data.filters.sizes);
        // this.updateFilterSourceWarehouses(searchsInContainer.data.filters.warehouses);
        // this.updateFilterSourceOrdertypes(searchsInContainer.data.filters.ordertypes);
        setTimeout(() => {
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

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  /**
   * search products in container by criteria
   * @param parameters - parameters to search
   */
  searchInContainer(parameters):void{
    this.intermediaryService.presentLoading();
    this.inventoryServices.searchInContainer(parameters).subscribe(searchsInContainer=>{
      this.intermediaryService.dismissLoading();
      this.searchsInContainer = searchsInContainer.data.results;
      this.initSelectForm();
      this.dataSource = new MatTableDataSource<InventoryModel.SearchInContainer>(this.searchsInContainer);
      /*this.updateFilterSourceColors(searchsInContainer.data.filters.colors);
      this.updateFilterSourceContainers(searchsInContainer.data.filters.containers);
      this.updateFilterSourceModels(searchsInContainer.data.filters.models);
      this.updateFilterSourceSizes(searchsInContainer.data.filters.sizes);
      this.updateFilterSourceWarehouses(searchsInContainer.data.filters.warehouses);
      this.updateFilterSourceOrdertypes(searchsInContainer.data.filters.ordertypes);*/
      let paginator = searchsInContainer.data.pagination;
      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.page - 1;
    },()=>{
      this.intermediaryService.dismissLoading();
    });
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
    if(object.productReferencePattern) {
      object.productReferencePattern = "%" + object.productReferencePattern + "%";
    }
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
}
