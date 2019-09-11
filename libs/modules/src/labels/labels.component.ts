import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource} from '@angular/material';


import {
  IntermediaryService,
  LabelsService

} from '@suite/services';


import { FormBuilder,FormGroup, FormControl, FormArray } from '@angular/forms';

import { validators } from '../utils/validators';

@Component({
  selector: 'suite-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit {

  /**Arrays to be shown */
  labels:Array<any> = [];

  /**form to select elements to print or for anything */
  selectedForm:FormGroup = this.formBuilder.group({},{
    validators:validators.haveItems("toSelect")
  });



  displayedColumns: string[] = ['reference', 'model', 'color', 'size', 'warehouse', 'container','select'];
  dataSource: any;

  constructor(
    private intermediaryService:IntermediaryService,
    private formBuilder:FormBuilder,
    private labelService:LabelsService
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
    let labels = this.selectedForm.value.toSelect.map((label,i)=>label?items[i].reference:false).filter(label=>label);
    this.intermediaryService.presentLoading("Imprimiendo las etiquetas seleccionadas");
    setTimeout( ()=>this.intermediaryService.dismissLoading(),1000);
    // console.log(labels);

  }

  ngOnInit() {
    this.getLabels();
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
   * @param items - reference items for create the formControls
   */
  initSelectForm(items):void{  
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect",this.formBuilder.array(items.map(product=>new FormControl(false))));
  }


  /**
   * Get labels to show
   */
  getLabels():void{
    this.labelService.getIndex().subscribe(labels=>{
      this.labels = labels;
      // console.log(labels);
      this.initSelectForm(this.labels);
      this.dataSource = new MatTableDataSource<any>(this.labels);
    })
  }
}
