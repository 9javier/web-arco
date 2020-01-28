import { Component, OnInit, ViewChild} from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { NavParams, ModalController } from '@ionic/angular';
import { DataComponent } from '../../group-warehouse-picking/modals/data/data.component';
import { WarehousesService, WarehouseModel } from '@suite/services';
import { MatSelectChange } from '@angular/material';
import { CarrierService, IntermediaryService } from '@suite/services'
import { MatFormFieldModule, MatInputModule, MatSelectModule} from '@angular/material';
import {CarrierModel} from "../../../../services/src/models/endpoints/Carrier";





@Component({
  selector: 'suite-add-destiny',
  templateUrl: './add-destiny.component.html',
  styleUrls: ['./add-destiny.component.scss']
})
export class AddDestinyComponent implements OnInit {

  title = 'Agregar Destino';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;

  redirectTo = '/jails/list';
  private jail: CarrierModel.Carrier;
  warehouses:Array<WarehouseModel.Warehouse> = [];
  warehouse: WarehouseModel.Warehouse;

  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private warehousesService:WarehousesService,
    private carrierService:CarrierService,
    private intermediaryService:IntermediaryService
  ) {    this.jail = this.navParams.get("jail");
  
}
@ViewChild(DataComponent) data:DataComponent;

  ngOnInit() {
    this.warehousesService.getIndex().then(observable => {
      observable.subscribe(warehouses => {
          this.warehouses = warehouses.body.data;
      });
    })
  }

  close(){
    this.modalController.dismiss();
  }

  selectDestiny(event: MatSelectChange) {
    this.warehouse = event.value;
  }

  submit() {
  
       this.intermediaryService.presentLoading();
    this.carrierService.setDestination(this.jail.id,this.warehouse.id).subscribe(()=>{
      this.intermediaryService.presentToastSuccess("Destino agregado con exito");
      this.intermediaryService.dismissLoading();
      this.close();
    }, (err)=>{
      this.intermediaryService.presentToastSuccess("Error al agregar destino");  
    }, ()=>{
      

    })
  }

}




