import { Component, OnInit,ViewChild } from '@angular/core';
import { DataComponent } from '../data/data.component';
import { ViewController } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { GroupWarehousePickingModel, IntermediaryService, GroupWarehousePickingService } from '@suite/services';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  @ViewChild(DataComponent) data:DataComponent;

  constructor(
    private modalController:ModalController,
    private intermediaryService:IntermediaryService,
    private groupWarehousePicking:GroupWarehousePickingService

  ) { }

  ngOnInit() {
  }

  /**
   * Save new group in server
   * @param data - the data to be saved
   */
  submit(data:GroupWarehousePickingModel.RequestGroupWarehousePicking):void{
    this.intermediaryService.presentLoading();
    this.groupWarehousePicking.store(data).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Grupo guardado con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error guardando el grupo");
      this.close();
    })
  }

  /**
   * Close the current isntance of modal
   */
  close():void{
    this.modalController.dismiss()
  }

}
