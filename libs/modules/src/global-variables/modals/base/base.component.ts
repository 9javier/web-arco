import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GlobalVariableModel, GlobalVariableService } from '@suite/services';

@Component({
  selector: 'suite-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() set variable(variable:GlobalVariableModel.GlobalVariable){
    if(variable){
      this.form.addControl("id",new FormControl);
      this.form.patchValue(variable);
    }
  }

  types:{id:number;name:string}[] = [];

  form:FormGroup = this.formBuilder.group({
    type:['',Validators.required],
    value:['',Validators.required]
  });

  constructor(
    private formBuilder:FormBuilder,
    private globalVariableService:GlobalVariableService) { }

  ngOnInit() {
    this.getTypes();
  }

  getTypes(){
    this.globalVariableService.getTypes().subscribe(types=>{
      this.types = types;
    });
  }

  getValue():GlobalVariableModel.GlobalVariable{
    return this.form.value;
  }

}