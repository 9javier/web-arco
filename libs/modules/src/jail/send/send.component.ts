import { Component, OnInit, ViewChild} from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { NavParams, ModalController } from '@ionic/angular';
import { DataComponent } from '../data/data.component';
import { WarehousesService, WarehouseModel } from '@suite/services';
import { MatSelectChange } from '@angular/material';
import { CarrierService, IntermediaryService } from '@suite/services';

@Component({
  selector: 'suite-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {

  title = 'Enviar Jaula';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;

  redirectTo = '/jails/list';
  jail;
  warehouses:Array<WarehouseModel.Warehouse> = [];
  warehouse: WarehouseModel.Warehouse;

  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private warehousesService:WarehousesService,
    private carrierService:CarrierService,
    private intermediaryService:IntermediaryService
  ) { 
    this.jail = this.navParams.get("jail");
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

  submit(jail) {
    this.intermediaryService.presentLoading();
    this.carrierService.sendPackingToWareouse(jail.id, this.warehouse.id).subscribe(() => {
        this.intermediaryService.presentToastSuccess("Jaula enviado con exito");  
    }, (err)=> {
      this.intermediaryService.presentToastSuccess("Error al enviar la jaula");  
    }, () => {
      this.intermediaryService.dismissLoading();
    })
    this.close();
  }

}
