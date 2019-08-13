import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { GlobalVariableService, IntermediaryService, GlobalVariableModel } from '@suite/services';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;
  
  variable:GlobalVariableModel.GlobalVariable;

  constructor(
    private modalController:ModalController,
    private navParams:NavParams,
    private globalVaribleService:GlobalVariableService,
    private intermediaryService:IntermediaryService
  ) {
    this.variable = navParams.get("variable");
   }

  ngOnInit() {
  }

  close(){
    this.modalController.dismiss();
  }

  submit(variable:GlobalVariableModel.GlobalVariable){
    this.globalVaribleService.update(variable.id,variable).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.close();
      this.intermediaryService.presentToastSuccess("Variable global actualizada con éxito")
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("No se pudo actualizar la variable global");
    })
  }

}
