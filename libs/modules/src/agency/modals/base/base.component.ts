import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgencyModel } from '@suite/services';

@Component({
  selector: 'suite-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() set agency(agency:AgencyModel.Request){
    if(agency)
      this.form.patchValue(agency);
  }

  form:FormGroup = this.formBuilder.group({
    id:[''],
    name:['',Validators.required],
    address:['',Validators.required],
    phone:['',Validators.required]
  });

  constructor(
    private formBuilder:FormBuilder
  ) { }

  /**
   * Obtain value of form
   */
  getValue(){
    return this.sanitize(this.form.value);
  }

  sanitize(agency:AgencyModel.Agency){
    Object.keys(agency).forEach(key=>{
      if(!agency[key])
        delete agency[key];
    });
    return agency;
  }

  ngOnInit() {
  }

}
