import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import {IntermediaryService} from "../../../../../services/src/lib/endpoint/intermediary/intermediary.service";

@Component({
  selector: 'suite-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  private _returnType = null;

  @Input() set returnType(_returnType){
    if(_returnType){
      this._returnType = _returnType;
      this.form.removeControl("returnType");
      this.form.patchValue(_returnType);
    }
  }
  get returnType(){
    return this._returnType;
  }

  isAdd: any;
  defectiveSelect: [
    {
      id: true,
      name: 'Sí'
    },
    {
      id: false,
      name: 'No'
    }
  ];

  form:FormGroup = this.formBuilder.group({
    name: ['',[Validators.required]],
    defective: ['',[Validators.required]]
  });

  constructor(
    private formBuilder:FormBuilder,
    private intermediaryService:IntermediaryService
  ) { }

  ngOnInit() {
    if(this.form['controls'].name.value){
      this.isAdd=false;
    }else{
      this.isAdd=true;
    }
    this.defectiveSelect = [
      {
        id: true,
        name: 'Sí'
      },
      {
        id: false,
        name: 'No'
      }
    ];
    this.intermediaryService.dismissLoading();
  }

  getValue(){
    let valueFormat =  this.form.value;
    return valueFormat;
  }
}
