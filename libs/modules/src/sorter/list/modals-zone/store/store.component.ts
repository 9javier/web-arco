import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';
import { TemplateZonesService } from 'libs/services/src/lib/endpoint/template-zones/template-zones.service';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;
  
  colors: any;
  id: number;
  
  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams,
    private templateZonesService: TemplateZonesService
  ) {
    this.colors = this.navParams.get("colors"); 
    this.id = this.navParams.get("id");
  }

  ngOnInit() {
  }

  close():void{
    this.modalController.dismiss();
  }

  submit():void{
    let payload = this.base.getValue()
    payload = {
      active:true,
      zoneWays: [],
      zoneWarehouses: [],
      ...payload
    }
    console.log(payload);
    this.templateZonesService.postCreate(payload, this.id).subscribe((data) => {
      console.log(data.data);
      this.close();
    }, (err) => {
      console.log(err);
    });
  }

}
