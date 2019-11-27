import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { WarehousesService, CarrierService, WarehouseModel } from '@suite/services';

@Component({
  selector: 'suite-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  @Input() stateExpeditionAvelon = {
    name: '', 
    status: true
  };

  form:FormGroup = this.formBuilder.group({
    name:['',[Validators.required]],
    status: ['',[]],
  });

  constructor(
    private formBuilder:FormBuilder,
    private carrierService:CarrierService) { }

  ngOnInit() {
  }

  getValue(){
    return this.form.value;
  }
}
