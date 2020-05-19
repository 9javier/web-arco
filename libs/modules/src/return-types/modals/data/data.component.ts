import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import {IntermediaryService} from "../../../../../services/src/lib/endpoint/intermediary/intermediary.service";

@Component({
  selector: 'suite-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  @Input() set returnType(_returnType){
    if(_returnType){
      this.nameForm = _returnType.name;
      this.defectiveForm = _returnType.defective;
    }
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

  public nameForm: string = null;
  public defectiveForm: boolean = false;

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

  getValue() {
    return {
      name: this.nameForm,
      defective: this.defectiveForm
    }
  }

  validValues() {
    return this.nameForm != null;
  }
}
