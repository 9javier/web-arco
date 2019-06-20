import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource} from '@angular/material';


import {
  IntermediaryService,
  LabelsService,
  PriceModel,
  PriceService

} from '@suite/services';


import { FormBuilder,FormGroup, FormControl, FormArray } from '@angular/forms';

import { validators } from '../utils/validators';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'suite-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {

  /**Arrays to be shown */
  labels:Array<any> = [];

  /**List of prices */
  prices:Array<PriceModel.Price> = [];

  /**form to select elements to print or for anything */
  selectedForm:FormGroup = this.formBuilder.group({},{
    validators:validators.haveItems("toSelect")
  });



  displayedColumns: string[] = ['reference', 'model', 'color', 'size', 'warehouse', 'container','select'];
  dataSource: any;
  tariffId:number;

  constructor(
    private navParams:NavParams,
    private priceService:PriceService,
    private intermediaryService:IntermediaryService,
    private formBuilder:FormBuilder,
    private labelService:LabelsService
  ) {
    this.tariffId = this.navParams.get("tariffId");
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
   * Print the selected labels
   * @param items - Reference items to extract he ids
   */
  printLabels(items):void{
    /*let labels = this.selectedForm.value.toSelect.map((label,i)=>label?items[i].reference:false).filter(label=>label);
    this.intermediaryService.presentLoading("Imprimiendo los precios seleccionados");
    setTimeout( ()=>this.intermediaryService.dismissLoading(),1000);*/
  }

  ngOnInit() {
    this.getPrices(51,this.tariffId);
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
      this.initSelectForm(this.prices);
      this.dataSource = new MatTableDataSource<PriceModel.Price>(this.prices);
    });
  }
}
