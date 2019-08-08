import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AgencyModel, IntermediaryService, AgencyService } from '@suite/services';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;

  agency:AgencyModel.Agency
  constructor(
    private intermediaryService:IntermediaryService,
    private agencyService:AgencyService,
    private modalController:ModalController,
    private navParams:NavParams) {
    this.agency = this.navParams.get("agency");
   }

  ngOnInit() {
  }

    /**
   * close the current instance of the modal
   */
  close():void{
    this.modalController.dismiss();
  }

  /**
   * Update an agency
   * @param agency
   */
  submit(agency:AgencyModel.Agency):void{
    this.intermediaryService.presentLoading();
    this.agencyService.update(agency.id,(<any>agency)).subscribe((response)=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Agencia actualizada con éxito");
      this.close();
    },(error)=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("No se pudo actualizar la agencia");
      this.close();
    });
  }

}
