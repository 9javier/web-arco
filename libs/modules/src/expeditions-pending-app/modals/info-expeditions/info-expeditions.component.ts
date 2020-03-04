import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ReceptionAvelonModel} from "@suite/services";
import Expedition = ReceptionAvelonModel.Expedition;

@Component({
  selector: 'info-expeditions',
  templateUrl: './info-expeditions.component.html',
  styleUrls: ['./info-expeditions.component.scss']
})
export class InfoExpeditionsComponent implements OnInit {

  title: string = 'Información de la expedición';
  titleAnotherExpeditions: string = 'Otras expediciones';
  expedition: Expedition = null;
  anotherExpeditions: Expedition[] = [];

  constructor(
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  async close() {
    await this.modalController.dismiss();
  }

  async receptionExpedition(expedition: Expedition) {
    await this.modalController.dismiss({reception: true, expedition});
  }
}
