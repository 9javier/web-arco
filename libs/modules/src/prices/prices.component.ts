import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource, MatPaginator} from '@angular/material';


import {
  IntermediaryService,
  LabelsService,
  PriceModel,
  PriceService

} from '@suite/services';


import { FormBuilder,FormGroup, FormControl, FormArray } from '@angular/forms';

import { validators } from '../utils/validators';
import { NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pagerValues = [20, 50, 100];

  selectAllBinding;

  /**for calculate the index of control */
  init:number = 0;
  multiplier:number = 20;

  /**Arrays to be shown */
  labels:Array<any> = [];

  /**List of prices */
  prices:Array<PriceModel.Price> = [];

  /**form to select elements to print or for anything */
  selectedForm:FormGroup = this.formBuilder.group({
    selector:false
  },{
    validators:validators.haveItems("toSelect")
  });



  displayedColumns: string[] = ['price', 'discount', 'percentage', 'select'];
  dataSource: any;
  tariffId:number;

  constructor(
    private priceService:PriceService,
    private intermediaryService:IntermediaryService,
    private formBuilder:FormBuilder,
    private route:ActivatedRoute
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
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page=>{
      this.selectedForm.get("selector").setValue("false");
      /**check the actual page, and actual multiplier to be used in global */
      this.init = this.paginator.pageIndex;
      this.multiplier = this.paginator.pageSize;
    });
  }

  /**
   * Select or unselect all visible labels
   * @param event to check the status
   */
  selectAll(event):void{

    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control=>{
      control.setValue(false);
    });
    console.log(this.init*this.multiplier,this.init*this.multiplier+this.multiplier);
    for(let i = this.init*this.multiplier;i<(this.init*this.multiplier+this.multiplier);i++)
      (<FormArray>this.selectedForm.controls.toSelect).controls[i].setValue(value);
    

  }

  /**
   * Print the selected labels
   * @param items - Reference items to extract he ids
   */
  printPrices(items):void{
    let prices = this.selectedForm.value.toSelect.map((label,i)=>label?items[i].id:false).filter(price=>price);
    console.log("imprimo los id porque  no hay referencias en este modelo",prices);
    this.intermediaryService.presentLoading("Imprimiendo los precios seleccionados");
    setTimeout( ()=>this.intermediaryService.dismissLoading(),1000);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log("here");
      this.tariffId = Number(params.get("tariffId"));
      console.log(this.tariffId);
      this.getPrices(51,this.tariffId);
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
   */
  getPrices(warehouseId:number = 51,tariffId:number):void{
    this.priceService.getIndex(warehouseId,tariffId).subscribe(prices=>{
      this.prices = prices;
      console.log(prices);
      this.initSelectForm(this.prices);
      this.dataSource = new MatTableDataSource<PriceModel.Price>(this.prices);
      this.dataSource.paginator = this.paginator;
    });
  }
}
