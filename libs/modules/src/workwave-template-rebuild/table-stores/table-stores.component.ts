import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PickingParametrizationProvider } from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import { Events } from "@ionic/angular";
import { GroupWarehousePickingModel } from "@suite/services";
import { WorkwavesService } from 'libs/services/src/lib/endpoint/workwaves/workwaves.service';

@Component({
  selector: 'table-stores',
  templateUrl: './table-stores.component.html',
  styleUrls: ['./table-stores.component.scss']
})
export class TableStoresComponent implements OnInit {

  private GROUPS_WAREHOUSES_LOADED = "groups-warehouses-loaded";
  private DEFAULT_THRESHOLD_CONSOLIDATED: number = 100;

  listGroupsWarehouses: Array<GroupWarehousePickingModel.GroupWarehousePicking> = new Array<GroupWarehousePickingModel.GroupWarehousePicking>();
  groupWarehousesSelected: GroupWarehousesSelected = { groupsWarehousePickingId: 0, thresholdConsolidated: {} };

  constructor(
    private events: Events,
    public pickingParametrizationProvider: PickingParametrizationProvider,
    private serviceG: WorkwavesService
  ) { }

  ngOnInit() {
    this.events.subscribe(this.GROUPS_WAREHOUSES_LOADED, () => {
      this.listGroupsWarehouses = this.pickingParametrizationProvider.listGroupsWarehouses;

      if (this.listGroupsWarehouses.length > 0) {
        this.groupWarehousesSelected.groupsWarehousePickingId = this.listGroupsWarehouses[0].id;
        this.groupWarehousesSelected.thresholdConsolidated[this.listGroupsWarehouses[0].id] = this.DEFAULT_THRESHOLD_CONSOLIDATED;
      } else {
        this.groupWarehousesSelected = { groupsWarehousePickingId: 0, thresholdConsolidated: {} };
      }
      this.selectGroupWarehouses(undefined, 'init');
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.GROUPS_WAREHOUSES_LOADED);
  }

  selectGroupWarehouses(idGroupWarehouse?: number, validation?: String) {
    if (idGroupWarehouse) {
      if (!this.groupWarehousesSelected.thresholdConsolidated[idGroupWarehouse]) {
        this.groupWarehousesSelected.thresholdConsolidated[idGroupWarehouse] = 0;
      }

      if (this.groupWarehousesSelected.thresholdConsolidated[idGroupWarehouse] < 0) {
        this.groupWarehousesSelected.thresholdConsolidated[idGroupWarehouse] = 0;
      }
    } else {
      this.groupWarehousesSelected.thresholdConsolidated[this.groupWarehousesSelected.groupsWarehousePickingId] = 0;
    }

    if (idGroupWarehouse && this.groupWarehousesSelected.thresholdConsolidated[idGroupWarehouse] != 0) {
      this.groupWarehousesSelected.groupsWarehousePickingId = idGroupWarehouse;
    }

    for (let iGroupWarehouseThreshold in this.groupWarehousesSelected.thresholdConsolidated) {
      if (parseInt(iGroupWarehouseThreshold) != this.groupWarehousesSelected.groupsWarehousePickingId) {
        this.groupWarehousesSelected.thresholdConsolidated[iGroupWarehouseThreshold] = null;
      }
    }

    if (this.groupWarehousesSelected.groupsWarehousePickingId != 0 && this.groupWarehousesSelected.thresholdConsolidated[this.groupWarehousesSelected.groupsWarehousePickingId] >= 0) {
      let localGroupWarehousesSelected: GroupWarehousePickingModel.GroupWarehousesSelected = {
        groupsWarehousePickingId: this.groupWarehousesSelected.groupsWarehousePickingId,
        thresholdConsolidated: this.groupWarehousesSelected.thresholdConsolidated[this.groupWarehousesSelected.groupsWarehousePickingId]
      };

      let aux = this.serviceG.orderAssignment.value;
      aux.data.store = localGroupWarehousesSelected;
      aux.store = validation === 'init' ? true : false;
      this.serviceG.orderAssignment.next(aux);

    } else {
      if (this.groupWarehousesSelected.thresholdConsolidated[this.groupWarehousesSelected.groupsWarehousePickingId] == 0) {

      }
    }
  }

}

interface GroupWarehousesSelected {
  groupsWarehousePickingId: number,
  thresholdConsolidated: any
}
