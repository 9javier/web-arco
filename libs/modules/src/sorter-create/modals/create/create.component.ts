import { Component, OnInit, Input } from '@angular/core';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'suite-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  wareHouses: any;

  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams
  ) {
    this.wareHouses = this.navParams.get("wareHouses");
  }

  ngOnInit() {
  }

  close():void{
    this.modalController.dismiss();
  }

  submit(template):void{
    console.log('submit')
  }
}
