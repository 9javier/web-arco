import { Component, OnInit, Input } from '@angular/core';
import { GlobalVariableModel, GlobalVariableService, IntermediaryService, WarehouseModel } from '@suite/services';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'suite-base-destinations',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() destinations: Array<WarehouseModel.Warehouse>;
  @Input() listCheck: any = [];
  constructor() { }

  ngOnInit() {
  }

  addValueArray(destination: any): void {
  
    var indexA = -1;
    
    this.listCheck.forEach((val, index) => {
      if(val.id === destination.id){
        indexA = index;
      }
    });

 
    if (indexA > -1)
      this.listCheck.splice(indexA, 1);
    else{
      var obj = {
        id: destination.id,
        name: destination.name
      };
      this.listCheck.push(obj);
    }
  }

  getValue(){
    return this.listCheck;
  }
}
