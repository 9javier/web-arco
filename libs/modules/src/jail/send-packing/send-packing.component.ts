import { Component, OnInit ,ViewChild} from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { NavParams, ModalController } from '@ionic/angular';
import { CarrierService, IntermediaryService, WarehousesService, WarehouseModel } from '@suite/services';
import { DataComponent } from '../data/data.component';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'suite-send-packing',
  templateUrl: './send-packing.component.html',
  styleUrls: ['./send-packing.component.scss']
})
export class SendPackingComponent implements OnInit {
  formBuilderDataInputs = {
    reference: ['', [Validators.required, Validators.pattern('^J[0-9]{4}')]]
  };
  formBuilderTemplateInputs = [
    {
      name: 'reference',
      label: 'Ej. J0001',
      type: 'reference',
      icon: { type: 'ionic', name: 'filing'}
    }
  ];
  title = 'Enviar embalaje';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;

  redirectTo = '/jails/list';
  jail;
  warehouses:Array<WarehouseModel.Warehouse> = [];
  warehouse: WarehouseModel.Warehouse;
  selectedWarehouse;

  constructor(
    private navParams:NavParams,
    private carrierService:CarrierService,
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private warehousesService:WarehousesService
    ) {
    this.jail = this.navParams.get("jail");

    if(this.jail.carrierWarehousesDestiny.length  == 1) {
      this.selectedWarehouse = this.jail.carrierWarehousesDestiny[0].warehouse.id;
      this.warehouse = this.jail.carrierWarehousesDestiny[0].warehouse;
    }
  }


  ngOnInit() {
    this.warehousesService.getIndex().then(observable => {
      observable.subscribe(warehouses => {
        this.warehouses = warehouses.body.data;
      });
    })
  }
  
  selectWarehouse(event: MatSelectChange) {
    this.selectedWarehouse = event.value;
    this.warehouses.forEach(warehouse => {if(warehouse.id == this.selectedWarehouse) this.warehouse = warehouse});
  }

  submit(){
    let value = this.warehouse.id;
    this.intermediaryService.presentLoading();
    this.carrierService.sendPacking(this.jail.reference, value).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Envío de embalaje con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error de envío de embalaje");
    })
  }

  close(){
    this.modalController.dismiss();
  }

}
