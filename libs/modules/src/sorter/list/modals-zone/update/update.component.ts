import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';
import { TemplateZonesService } from 'libs/services/src/lib/endpoint/template-zones/template-zones.service';

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
    private navParams:NavParams,
    private templateZonesService: TemplateZonesService
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
    let payload = this.base.getValue()
    payload = {
      zoneNumber: 1,
      active:false,
      zoneWays: [],
      zoneWarehouses: [],
      ...payload
    }
    console.log(payload);
    this.templateZonesService.updateTemplateZone(payload, payload.id, this.id).subscribe((data) => {
      console.log(data.data);
      this.close();
    }, (err) => {
      console.log(err);
    });
  }
}
