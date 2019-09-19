import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'suite-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;
  wareHouses: any;

  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams
  ) {
    this.wareHouses = this.navParams.get("wareHouses");
    console.log(this.wareHouses);
  }

  ngOnInit() {
  }

  close():void{
    this.modalController.dismiss();
  }

  submit():void{
    let { colors, ...data} = this.base.getValue();
    colors = [1, 2, 3, 4];
    const payload = {
      colors, ...data
    }
    console.log(payload)
  }
}
