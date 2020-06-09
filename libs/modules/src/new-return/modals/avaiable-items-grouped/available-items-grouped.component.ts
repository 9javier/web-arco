import { Component, OnInit, Input } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ReturnModel} from "../../../../../services/src/models/endpoints/Return";

@Component({
  selector: 'suite-data',
  templateUrl: './available-items-grouped.component.html',
  styleUrls: ['./available-items-grouped.component.scss']
})
export class AvailableItemsGroupedComponent implements OnInit {

  @Input() listUnitiesGrouped: ReturnModel.AvailableProductsGrouped[] = [];

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {

  }

  close() {
    this.modalController.dismiss();
  }
}
