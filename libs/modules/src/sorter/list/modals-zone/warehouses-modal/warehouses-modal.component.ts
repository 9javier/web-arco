import { Component, OnInit } from '@angular/core';
import { WarehouseModel, IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'suite-warehouses-modal',
  templateUrl: './warehouses-modal.component.html',
  styleUrls: ['./warehouses-modal.component.scss']
})
export class WarehousesModalComponent implements OnInit {

  warehouses: WarehouseModel.Warehouse[] = [];
  displayedColumnsWareHouse: any = ['name', 'check'];

  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams
  ) {
    this.warehouses = this.navParams.get("warehouses"); 
    console.log(this.warehouses)
  }

  ngOnInit() {
  }

  close():void{
    this.modalController.dismiss();
  }

  submit():void{
    console.log('submit')
  }

}
