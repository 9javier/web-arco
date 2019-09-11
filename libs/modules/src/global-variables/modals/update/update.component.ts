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

  @ViewChild(BaseComponent) base: BaseComponent;

  public variable: GlobalVariableModel.GlobalVariable;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public globalVaribleService: GlobalVariableService,
    private intermediaryService: IntermediaryService
  ) {
    this.variable = navParams.get("variable");
  }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }

  submit(variable: GlobalVariableModel.GlobalVariable) {
    this.intermediaryService.presentLoading();
    this.globalVaribleService.update(variable.id, variable).subscribe(() => {
      this.close();
      this.intermediaryService.presentToastSuccess("Variable global actualizada con éxito")
    }, (err) => {
      // console.log(err)
      this.intermediaryService.presentToastError("No se pudo actualizar la variable global");
    }, () => {
      this.intermediaryService.dismissLoading();
    })
  }

}
