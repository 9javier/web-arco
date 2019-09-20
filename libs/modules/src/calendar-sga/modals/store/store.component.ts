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
    private calendarService: CalendarService,
    private params: NavParams
  ) { }

  ngOnInit() {
    console.log(this.params.data.destinos[0]);
    this.getBase();
  }

  /**
   * Get the base template skeleton to show
   */
  getBase():void{
    this.intermediaryService.presentLoading();
    this.calendarService.getBaseBad().subscribe(warehouses=>{
      // console.log(warehouses);
      this.intermediaryService.dismissLoading();
      this.templateBase = warehouses;
      warehouses[0].destinationsWarehouses.forEach(destination => {
        var temp = false;
        this.params.data.destinos[0].forEach(param => {
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
        }
        else  
          destination.destinationWarehouse.is_main = false;

        this.warehousesList.push(destination.destinationWarehouse);
      });
    },()=>{
      this.intermediaryService.dismissLoading();
    })
  }


  close(){
    this.modalController.dismiss();
  }

  submit(data){
    console.log(data);
    this.modalController.dismiss({
      listDestinos: data
    });
  }

}
