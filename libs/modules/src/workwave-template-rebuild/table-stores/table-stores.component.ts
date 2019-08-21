import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  private DEFAULT_THRESHOLD_CONSOLIDATED: number = 100;

  @Output() changeGroupWarehouses = new EventEmitter();

  listGroupsWarehouses: Array<GroupWarehousePickingModel.GroupWarehousePicking> = new Array<GroupWarehousePickingModel.GroupWarehousePicking>();
  groupWarehousesSelected: GroupWarehousePickingModel.GroupWarehousesSelected = { groupsWarehousePickingId: 0, thresholdConsolidated: 0 };

  constructor(
    private events: Events,
    public pickingParametrizationProvider: PickingParametrizationProvider
  ) {}

  ngOnInit() {
    this.events.subscribe(this.GROUPS_WAREHOUSES_LOADED, () => {
      this.listGroupsWarehouses = this.pickingParametrizationProvider.listGroupsWarehouses;
      if (this.listGroupsWarehouses.length > 0) {
        this.groupWarehousesSelected.groupsWarehousePickingId = this.listGroupsWarehouses[0].id;
        this.groupWarehousesSelected.thresholdConsolidated = this.DEFAULT_THRESHOLD_CONSOLIDATED;
        this.selectGroupWarehouses();
      }
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.GROUPS_WAREHOUSES_LOADED);
  }

  selectGroupWarehouses(idGroupWarehouse?: number) {
    if (!this.groupWarehousesSelected.thresholdConsolidated) {
      this.groupWarehousesSelected.thresholdConsolidated = 0;
    }

    if (this.groupWarehousesSelected.thresholdConsolidated < 0) {
      this.groupWarehousesSelected.thresholdConsolidated = 0;
    }

    if (this.groupWarehousesSelected.groupsWarehousePickingId == 0 && idGroupWarehouse && this.groupWarehousesSelected.thresholdConsolidated != 0) {
      this.groupWarehousesSelected.groupsWarehousePickingId = idGroupWarehouse;
    }

    if (this.groupWarehousesSelected.groupsWarehousePickingId != 0 && this.groupWarehousesSelected.thresholdConsolidated != 0) {
      this.changeGroupWarehouses.next(this.groupWarehousesSelected);
    } else {
      if (this.groupWarehousesSelected.thresholdConsolidated == 0) {

      }
    }
  }

}
