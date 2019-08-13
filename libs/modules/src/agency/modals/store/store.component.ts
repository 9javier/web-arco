import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgencyService, AgencyModel, IntermediaryService } from '@suite/services';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;

  constructor(
    private modalController:ModalController,
    private agencyService:AgencyService,
    private intermediaryService:IntermediaryService
  ) { }

  ngOnInit() {
  }

  /**
   * close the current instance of the modal
   */
  close():void{
    this.modalController.dismiss();
  }

  /**
   * Store new agency
   * @param agency
   */
  submit(agency:AgencyModel.Agency):void{
    this.intermediaryService.presentLoading();
    this.agencyService.store(agency).subscribe((response)=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Agencia creada con éxito");
      this.close();
    },(error)=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("No se pudo crear la agencia");
      this.close();
    });
  }

}
