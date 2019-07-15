import { Component, OnInit, ViewChild } from '@angular/core';
import { IntermediaryService, BuildingService,BuildingModel } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';
import { InformationComponent } from '../information/information.component';
@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @ViewChild(InformationComponent) information:InformationComponent;

  building:BuildingModel.Building;
  constructor(
    private intermediaryService:IntermediaryService,
    private buildingService:BuildingService,
    private modalController:ModalController,
    private navParams:NavParams) {
      this.building = this.navParams.get("building");
    }

  ngOnInit() {
  }

  /**
   * Store a new building
   * @param building - the building for storage
   */
  update(building:BuildingModel.Building):void{
    this.intermediaryService.presentLoading();
    this.buildingService.update(building.id,building).subscribe((response)=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Building actualizado exitosamente").then(()=>{
        this.close();
      });
    },(error)=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError(error.error.errors).then(()=>{
        this.close();
      })
    });
  }

  /**
   * close the current instance of the modal 
   */
  close():void{
    this.modalController.dismiss();
  }
}
