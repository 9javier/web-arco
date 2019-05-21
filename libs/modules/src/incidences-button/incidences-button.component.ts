import { Component, OnInit } from '@angular/core';
import {IncidencesPopoverComponent} from "@suite/common-modules";
import {MenuController, PopoverController} from "@ionic/angular";
import {IncidencesService} from "../../../services/src/lib/endpoint/incidences/incidences.service";

@Component({
  selector: 'button-incidences',
  templateUrl: './incidences-button.component.html',
  styleUrls: ['./incidences-button.component.scss']
})
export class IncidencesButtonComponent implements OnInit {

  constructor(
    private popoverController: PopoverController,
    private menuController: MenuController,
    private incidencesService: IncidencesService
  ) {}

  ngOnInit() {
    // Get all incidences to app start
    this.incidencesService.init();

  }

  async showIncidences(ev: any) {
    const popover = await this.popoverController.create({
      component: IncidencesPopoverComponent,
      event: ev,
      cssClass: 'popover-incidences'
    });

    return await popover.present();
  }

}
