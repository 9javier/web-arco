import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;
  template;
  
  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams
  ) {
    this.template = this.navParams.get("template"); 
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
