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
  zona;
  colors: any;
  id: number;
  
  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams
  ) {
    this.zona = this.navParams.get("zona"); 
    this.colors = this.navParams.get("colors"); 
    this.id = this.navParams.get("id"); 
  }

  ngOnInit() {
  }

  close():void{
    this.modalController.dismiss();
  }

  submit():void{
    console.log('submit')
  }
}
