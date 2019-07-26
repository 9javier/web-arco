import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { WarehousesService, CarrierService, WarehouseModel } from '@suite/services';

@Component({
  selector: 'suite-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  @Input() set jail(_jail){
    if(_jail){
      this.form.removeControl("warehouse");
      this.form.patchValue(_jail);
    }
  }

  form:FormGroup = this.formBuilder.group({
    reference:['',[Validators.required,Validators.maxLength(5),Validators.minLength(5)]],
    packingType: ['',[Validators.required]],
	  warehouse: this.formBuilder.group({
      id:['',[Validators.required]]
    })
  });

  warehouses:Array<WarehouseModel.Warehouse> = [];
  packings:Array<{id:number,name:string}> = [];

  constructor(
    private formBuilder:FormBuilder,
    private warehouseService:WarehousesService,
    private carrierService:CarrierService) { }

  ngOnInit() {
    this.getWarehouses();
    this.getTypes();
  }

  getWarehouses(){
    this.warehouseService.getIndex().then(observable=>{
      observable.subscribe(response=>{
        this.warehouses = (<any>response.body).data;
      })
    })
  }

  getTypes(){
    this.carrierService.getPackingTypes().subscribe(packings=>{
      this.packings = packings;
    })
  }

  getValue(){
    return this.form.value;
  }



}
