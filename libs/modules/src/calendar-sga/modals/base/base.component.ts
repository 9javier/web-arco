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

  public selectForm: FormGroup;

  public isChecked: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    if(this.listCheck.length == this.destinations.length){
      this.selectForm = this.formBuilder.group({
        isChecked: [true, []]
      });
    } else {
      this.selectForm = this.formBuilder.group({
        isChecked: [false, []]
      });
    }

    this.changeValues();
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
        name: destination.name,
        reference: destination.reference
      };
      this.listCheck.push(obj);
    }
  }

  changeValues(): void {
    /**Listen for changes on isChecked control */
    this.selectForm.get("isChecked").valueChanges.subscribe((isChecked) => {
      this.destinations.forEach(destination => {
        if(isChecked){
          var obj = {
            id: destination.id,
            name: destination.name,
            reference: destination.reference
          };
          this.listCheck.push(obj);
          destination.is_main = true;
        } else {
          destination.is_main = false;
        }
      });
  
      if(!isChecked){
        this.listCheck = [];
      }
    });
  }

  getValue(){
    return this.listCheck;
  }
}
