import {Component, OnInit} from '@angular/core';
import {PickingParametrizationProvider} from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import {Events} from "@ionic/angular";
import {GroupWarehousePickingModel} from "@suite/services";

@Component({
  selector: 'table-stores',
  templateUrl: './table-stores.component.html',
  styleUrls: ['./table-stores.component.scss']
})
export class TableStoresComponent implements OnInit {

  private GROUPS_WAREHOUSES_LOADED = "groups-warehouses-loaded";
  warehouseId = 1;

  listGroupsWarehouses: Array<GroupWarehousePickingModel.GroupWarehousePicking> = new Array<GroupWarehousePickingModel.GroupWarehousePicking>();

  constructor(
    private events: Events,
    public pickingParametrizationProvider: PickingParametrizationProvider
  ) {}

  ngOnInit() {
    this.events.subscribe(this.GROUPS_WAREHOUSES_LOADED, () => {
      this.listGroupsWarehouses = this.pickingParametrizationProvider.listGroupsWarehouses;
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.GROUPS_WAREHOUSES_LOADED);
  }

}
