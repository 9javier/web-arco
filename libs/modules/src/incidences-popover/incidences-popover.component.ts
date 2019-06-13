import { Component, OnInit } from '@angular/core';
import {IncidencesService} from "../../../services/src/lib/endpoint/incidences/incidences.service";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'suite-ui-crud-incidences-popover',
  templateUrl: './incidences-popover.component.html',
  styleUrls: ['./incidences-popover.component.scss']
})
export class IncidencesPopoverComponent implements OnInit {

  constructor(
    public incidencesService: IncidencesService,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {

  }

  seeMoreIncidences() {
    this.popoverCtrl.dismiss({showMore: true});
  }

}
