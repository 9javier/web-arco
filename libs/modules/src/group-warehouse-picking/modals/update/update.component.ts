import { Component, OnInit } from '@angular/core';
import { GroupWarehousePickingModel, GroupWarehousePickingService, IntermediaryService } from '@suite/services';
import { NavParams, ModalController } from '@ionic/angular';
import { ViewController } from '@ionic/core';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  group:GroupWarehousePickingModel.GroupWarehousePicking;
  
  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private groupWarehousePickingService:GroupWarehousePickingService,
    private intermediaryService:IntermediaryService
  ) { 
    this.group = this.navParams.get("group");
  }

  ngOnInit() {
  }

  /**
   * Update a group warehouse picking
   * @param value - the group to be updated
   */
  submit(value){
    this.intermediaryService.presentLoading()
    this.groupWarehousePickingService.update(this.group.id,value).subscribe(()=>{
      this.close();
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Grupo actualizado con exito");
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error al actualizar")
    })
  }

  close():void{
    this.modalController.dismiss();
  }

}
