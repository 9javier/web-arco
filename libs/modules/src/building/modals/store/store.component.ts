import { Component, OnInit, ViewChild } from '@angular/core';
import { IntermediaryService, BuildingService,BuildingModel } from '@suite/services';
import { ModalController } from '@ionic/angular';
import { InformationComponent } from '../information/information.component';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  @ViewChild(InformationComponent) information:InformationComponent;

  constructor(
    private intermediaryService:IntermediaryService,
    private buildingService:BuildingService,
    private modalController:ModalController) { }

  ngOnInit() {
  }

  /**
   * Store a new building
   * @param building - the building for storage
   */
  store(building:BuildingModel.SingleRequest):void{
    this.intermediaryService.presentLoading();
    this.buildingService.store(building).subscribe((response)=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Building creado exitosamente").then(()=>{
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
