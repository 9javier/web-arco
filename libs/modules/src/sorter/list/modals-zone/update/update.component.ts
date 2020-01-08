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

  @ViewChild(BaseComponent) base: BaseComponent;
  zonaId: number;
  zone: any;
  colors: any;
  id: number;

  constructor(
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private navParams: NavParams,
    private templateZonesService: TemplateZonesService
  ) {
    this.zonaId = this.navParams.get("zonaId");
    this.colors = this.navParams.get("colors");
    this.id = this.navParams.get("id");
  }

  ngOnInit() {
    this.templateZonesService.getShowTemplateZone(this.zonaId, this.id).subscribe(data => {
      this.zone = data.data;
    }, err => {
      console.log(err)
    })
  }

  close(): void {
    this.modalController.dismiss();
  }

  submit(): void {
    let payload = this.base.getValue()
    payload = {
      active: false,
      zoneWays: [],
      zoneWarehouses: [],
      ...payload
    }
    this.templateZonesService.updateTemplateZone(payload, payload.id, this.id).subscribe((data) => {
      this.close();
    }, (err) => {
      console.log(err);
    });
  }
}
