import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PickingParametrizationProvider} from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import {Events} from "@ionic/angular";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import * as moment from 'moment';

@Component({
  selector: 'table-requests-orders',
  templateUrl: './table-requests-orders.component.html',
  styleUrls: ['./table-requests-orders.component.scss']
})
export class TableRequestsOrdersComponent implements OnInit {

  private REQUEST_ORDERS_LOADED = "request-orders-loaded";

  @Output() changeRequestOrder = new EventEmitter();

  listRequestOrders: Array<WorkwaveModel.MatchLineRequest> = new Array<WorkwaveModel.MatchLineRequest>();
  requestOrdersSelection: any = {};
  listRequestOrdersSelected: Array<number> = new Array<number>();

  private listWarehousesThresholdAndSelectedQty: any = {};
  private listRequestIdWarehouseId: any = {};

  constructor(
    private events: Events,
    private pickingParametrizationProvider: PickingParametrizationProvider
  ) {}

  ngOnInit() {
    this.events.subscribe(this.REQUEST_ORDERS_LOADED, () => {
      this.listRequestOrders = this.pickingParametrizationProvider.listRequestOrders;

      if (this.listRequestOrders.length > 0) {
        for (let request of this.listRequestOrders) {
          this.requestOrdersSelection[request.request.id] = true;
          if (typeof this.listWarehousesThresholdAndSelectedQty[request.destinyWarehouse.id] == 'undefined') {
            this.listWarehousesThresholdAndSelectedQty[request.destinyWarehouse.id] = {max: request.destinyWarehouse.thresholdShippingStore, selected: 0, warehouse: request.destinyWarehouse.name};
          }
          this.listRequestIdWarehouseId[request.request.id] = {warehouse: request.destinyWarehouse.id, qty: request.quantityMatchWarehouse};
        }
      } else {
        this.requestOrdersSelection = {};
      }
      this.selectRequestOrder(false);
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.REQUEST_ORDERS_LOADED);
  }

  selectRequestOrder(incrementTeamCounter: boolean) {
    if (incrementTeamCounter) {
      this.pickingParametrizationProvider.loadingListTeamAssignations++;
    }

    for (let iObj in this.listWarehousesThresholdAndSelectedQty) {
      this.listWarehousesThresholdAndSelectedQty[iObj].selected = 0;
    }
    this.listRequestOrdersSelected = new Array<number>();
    for (let iRequest in this.requestOrdersSelection) {
      let warehouseId = this.listRequestIdWarehouseId[iRequest].warehouse;
      let qty = this.listRequestIdWarehouseId[iRequest].qty;
      let selection = this.listWarehousesThresholdAndSelectedQty[warehouseId].selected;
      if (this.requestOrdersSelection[iRequest]) {
        this.listRequestOrdersSelected.push(parseInt(iRequest));
        this.listWarehousesThresholdAndSelectedQty[warehouseId].selected = selection + qty;
      }
    }
    this.changeRequestOrder.next({listSelected: this.listRequestOrdersSelected, listThreshold: this.listWarehousesThresholdAndSelectedQty});
  }

  dateCreatedParsed(requestOrder) : string {
    moment.locale('es');
    return moment(requestOrder.request.date).format('ddd, DD/MM/YYYY');
  }

  timeCreatedParsed(requestOrder) : string {
    moment.locale('es');
    return moment(requestOrder.request.date).format('LT');
  }

}
