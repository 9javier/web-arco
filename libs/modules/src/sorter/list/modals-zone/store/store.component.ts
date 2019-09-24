import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;
  
  colors: any;
  
  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams
  ) {
    this.colors = this.navParams.get("colors"); 
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
