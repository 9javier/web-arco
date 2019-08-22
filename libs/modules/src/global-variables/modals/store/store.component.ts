import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { ModalController } from '@ionic/angular';
import { GlobalVariableModel, GlobalVariableService, IntermediaryService } from '@suite/services';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;

  constructor(
    private modalController:ModalController,
    private globalVariableService:GlobalVariableService,
    private intermediaryService:IntermediaryService
  ) { }

  ngOnInit() {
  }

  close(){
    this.modalController.dismiss();
  }

  submit(variable:GlobalVariableModel.GlobalVariable){
    this.intermediaryService.presentLoading();
    this.globalVariableService.store(variable).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.close();
      this.intermediaryService.presentToastSuccess("Variable global creada con éxito")
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error intentando crear la variable global");
    })
  }

}
