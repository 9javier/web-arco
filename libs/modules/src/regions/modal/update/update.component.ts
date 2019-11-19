import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { InfoComponent } from '../info/info.component';
import { RegionsModel, IntermediaryService, RegionService } from "@suite/services";

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

 
  @ViewChild(InfoComponent) information:InfoComponent;

  region:RegionsModel.Regions;
  constructor(
    private intermediaryService:IntermediaryService,
    private regionService:RegionService,
    private modalController:ModalController,
    private navParams:NavParams) {
      this.region = this.navParams.get("region");
      console.log(this.region);
      
    }

  ngOnInit() {
  }

  update(region:RegionsModel.Regions):void{
    this.intermediaryService.presentLoading();
    this.regionService.update(region.id,region).subscribe((response)=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Region actualizada exitosamente").then(()=>{
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
