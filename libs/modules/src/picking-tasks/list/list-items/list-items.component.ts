import {Component, Input, OnInit} from '@angular/core';
import {PickingModel} from "../../../../../services/src/models/endpoints/Picking";
import {PickingProvider} from "../../../../../services/src/providers/picking/picking.provider";
import {PopoverController} from "@ionic/angular";
import {PopoverListStoresComponent} from "./popover-list-stores/popover-list-stores.component";

@Component({
  selector: 'picking-task-template',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class PickingTaskTemplateComponent implements OnInit {

  @Input() pickingAssignment: PickingModel.Picking;

  constructor(
    private popoverController: PopoverController,
    public pickingProvider: PickingProvider
  ) {}

  ngOnInit() {}

  selectPicking() {
    this.pickingProvider.pickingSelectedToStart = this.pickingAssignment;
  }

  async showStoresPopover(event) {
    event.preventDefault();
    event.stopPropagation();

    this.pickingProvider.listStoresToPopoverList = this.pickingAssignment.destinyProducts;

    const popover = await this.popoverController.create({
      cssClass: 'popover-list-stores',
      component: PopoverListStoresComponent,
      event: event
    });

    await popover.present();
  }

}
