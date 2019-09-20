import {Component, OnInit} from '@angular/core';
import {PickingProvider} from "../../../../../../services/src/providers/picking/picking.provider";
import {PickingModel} from "../../../../../../services/src/models/endpoints/Picking";

@Component({
  selector: 'popover-list-stores',
  templateUrl: './popover-list-stores.component.html',
  styleUrls: ['./popover-list-stores.component.scss']
})
export class PopoverListStoresComponent implements OnInit {

  public listStores: Array<PickingModel.WorkwaveOrderWarehouse>;

  constructor(
    public pickingProvider: PickingProvider
  ) {}

  ngOnInit() {
    this.listStores = this.pickingProvider.listStoresToPopoverList;
  }

}
