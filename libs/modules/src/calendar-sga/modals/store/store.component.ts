import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { ModalController, NavParams } from '@ionic/angular';
import { GlobalVariableModel, GlobalVariableService, IntermediaryService, CalendarService, CalendarModel, WarehouseModel } from '@suite/services';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;
  public templateBase:Array<CalendarModel.TemplateWarehouse> = [];
  public warehousesList:Array<WarehouseModel.Warehouse> = [];

  public listCheck: any = []

  constructor(
    private modalController:ModalController,
    private intermediaryService:IntermediaryService,
    private params: NavParams
  ) { }

  ngOnInit() {
    //console.log(this.params.data.originDestinations)
    this.getBase();
  }

  /**
   * Get the base template skeleton to show
   */
  getBase():void{
    this.intermediaryService.presentLoading();
    this.params.data.originDestinations.forEach(destination => {
      var temp = false;
      this.params.data.destinos.forEach(param => {
        if(param.id === destination.destinationWarehouse.id){
          temp = true;
        }
      });

      if(temp){
        destination.destinationWarehouse.is_main = true;
        this.listCheck.push({
          id: destination.destinationWarehouse.id,
          name: destination.destinationWarehouse.name
        });
      } else {
        destination.destinationWarehouse.is_main = false;
      }

      this.warehousesList.push(destination.destinationWarehouse);
    });
    this.intermediaryService.dismissLoading();
  }


  close(){
    this.modalController.dismiss();
  }

  submit(data){
    //console.log(data);
    this.modalController.dismiss({
      listDestinos: data
    });
  }

}
