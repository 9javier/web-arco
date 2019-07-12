import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource, MatPaginator} from '@angular/material';


import {
  IntermediaryService,
  LabelsService,
  PriceModel,
  PriceService,
  WarehousesService

} from '@suite/services';


import { FormBuilder,FormGroup, FormControl, FormArray } from '@angular/forms';

import { validators } from '../utils/validators';
import { NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';

@Component({
  selector: 'suite-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;


  filterTypes:Array<PriceModel.StatusType> = [];
  status:number;

  warehouses:Array<any> = [];
  pagerValues:Array<number> = [5, 10, 20];

  page:number = 0;

  limit:number = this.pagerValues[0];

  selectAllBinding;

  changeValue(event){
    //this.status = parseInt(event.detail.value);
    this.getPrices(this.tariffId,0,this.limit,this.status,this.filters.value.warehouseId);
  }

  reSearch(){
    this.getPrices(this.tariffId,0,this.limit,this.status,this.filters.value.warehouseId);
  }

  getWarehouses():void{
    this.warehousesService.getIndex().then(observable=>{
      observable.subscribe(warehouses=>{
        this.warehouses = warehouses.body.data;
      });
    })
  }

  /**Arrays to be shown */
  labels:Array<any> = [];

  /**List of prices */
  prices:Array<PriceModel.Price> = [];

  filters:FormGroup = this.formBuilder.group({
    warehouseId:51
  });

  /**form to select elements to print or for anything */
  selectedForm:FormGroup = this.formBuilder.group({
    selector:false
  },{
    validators:validators.haveItems("toSelect")
  });



  displayedColumns: string[] = ['impress','model', 'brand', 'range', 'price', 'percentage', 'discount', 'select'];
  dataSource: any;
  tariffId:number;

  constructor(
    private printerService:PrinterService,
    private priceService:PriceService,
    private intermediaryService:IntermediaryService,
    private formBuilder:FormBuilder,
    private route:ActivatedRoute,
    private warehousesService:WarehousesService
  ) {

  }

  

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


    /**
   * Listen changes in form to resend the request for search
   */
  listenChanges():void{
    let previousPageSize = this.limit
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page=>{
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.limit = page.pageSize;
      this.page = flag?page.pageIndex+1:1;
      if(this.status === 0 || this.status) 
        this.getPrices(this.tariffId,this.page,this.limit,this.status,this.filters.value.warehouseId);
    });
  }

  /**
   * Select or unselect all visible labels
   * @param event to check the status
   */
  selectAll(event):void{
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control=>{
      control.setValue(value);
    });
  }

  /**
   * Get the name of status based on id
   * @param id - the id of the status
   */
  getNameOfStatus(id:number):string{
    return this.filterTypes.find(status=>{
      return status.id == id
    }).name;
  }
  /**
   * Print the selected labels
   * @param items - Reference items to extract he ids
   */
  printPrices(items,warehouseId:number=51):void{
    let prices = this.selectedForm.value.toSelect.map((price,i)=>{
      console.log(items[i]);
      let object = {
        warehouseId:warehouseId,
        tariffId:items[i].tariff.id,
        modelId:items[i].model.id,
        numRange: items[i].numRange
      }
      return price?object:false})
      .filter(price=>price);
      console.log(prices);
      this.intermediaryService.presentLoading("Imprimiendo los productos seleccionados");
      this.printerService.printPrices({references:prices}).subscribe(result=>{
        console.log("result of impressions",result);
        this.intermediaryService.dismissLoading();
        this.getPrices(this.tariffId,this.page,this.limit,this.status,this.filters.value.warehouseId);
      },error=>{
        this.intermediaryService.dismissLoading();
        console.log(error);
      });

  }

  ngOnInit() {
    this.getWarehouses();
    this.priceService.getStatusEnum().subscribe(status=>{
      this.filterTypes = status;
      this.status = this.filterTypes.find((status)=>{
        return status.name.toLowerCase() == "todos";
      }).id;
      this.route.paramMap.subscribe(params => {
        console.log("here");
        this.tariffId = Number(params.get("tariffId"));
        console.log(this.tariffId);
        this.getPrices(this.tariffId,this.page,this.limit,this.status,this.filters.value.warehouseId);
      });
    });    
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.listenChanges();
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
   * Init selectForm controls
   * @param items - reference items for create the formControls
   */
  initSelectForm(items):void{  
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect",this.formBuilder.array(items.map(prices=>new FormControl(false))));
  }


  /**
   * Get the tarif associatest to a tariff
   * @param tariffId - the id of the tariff
   * @param page
   * @param limit
   */
  getPrices(tariffId:number,page:number,limit:number, status:number,warehouseId:number):void{
    this.intermediaryService.presentLoading();
    this.priceService.getIndex(tariffId, page, limit, status,warehouseId).subscribe(prices=>{
      this.intermediaryService.dismissLoading();
      this.prices = prices.results;
      this.initSelectForm(this.prices);
      this.dataSource = new MatTableDataSource<PriceModel.Price>(this.prices);
      let paginator = prices.pagination;
      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.page - 1;
    });
  }
}
