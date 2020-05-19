import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { SupplierConditionsService } from '../../../../../services/src/lib/endpoint/supplier-conditions/supplier-conditions.service';
import { SupplierConditionModel } from '../../../../../services/src/models/endpoints/SupplierCondition';
import { BrandModel } from '../../../../../services/src/models/endpoints/Brand';
import {ProviderModel} from "../../../../../services/src/models/endpoints/Provider";
import {IntermediaryService} from "../../../../../services/src/lib/endpoint/intermediary/intermediary.service";

@Component({
  selector: 'suite-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit, AfterViewInit {

  private _supplierCondition = null;

  @Input() set supplierCondition(_supplierCondition){
    if(_supplierCondition){
      this._supplierCondition = _supplierCondition;
      this.form.removeControl("supplierCondition");
      this.form.patchValue(_supplierCondition);
      if(_supplierCondition.provider){
        this.getBrands(_supplierCondition.provider.id);
      }
    }
  }
  get supplierCondition(){
    return this._supplierCondition;
  }

  isAdd: any;
  noClaimSelect: [
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
    provider: this.formBuilder.group({
      id:['',[Validators.required]]
    }),
    brand: this.formBuilder.group({
      id:['',[Validators.required]]
    }),
    noClaim: ['',[Validators.required]],
    contact: ['',[Validators.required]],
    observations: ['']
  });

  providers;
  brands;

  constructor(
    private formBuilder:FormBuilder,
    private intermediaryService:IntermediaryService,
    private supplierConditionsService:SupplierConditionsService) { }

  ngOnInit() {
    if(this.form['controls'].provider.value.id){
      this.isAdd=false;
    }else{
      this.isAdd=true;
    }
    this.noClaimSelect = [
      {
        id: true,
        name: 'Sí'
      },
      {
        id: false,
        name: 'No'
      }
    ];
  }

  ngAfterViewInit(){
    this.getProviders();
  }

  getProviders(){
    this.supplierConditionsService.getProviders(this.isAdd).subscribe(providers => {
        this.providers = providers;
        this.intermediaryService.dismissLoading();
    });
  }

  selectedProvider(event) {
    if (event) {
      console.log("event['detail'].value",event['detail'].value);
      this.getBrands(event['detail'].value);
    }
  }

  getBrands(providerId){
    let body = [{providerId: providerId}];
    this.supplierConditionsService.getBrandsOfProvider(body).subscribe(brands => {
      this.brands = brands;
    })
  }

  getValue(){
    let valueFormat =  this.form.value;
    valueFormat.provider = valueFormat.provider.id;
    valueFormat.brand = valueFormat.brand.id;
    return valueFormat;
  }



}
