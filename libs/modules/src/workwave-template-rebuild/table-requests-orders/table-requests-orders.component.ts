import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PickingParametrizationProvider } from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import { Events } from "@ionic/angular";
import { WorkwaveModel } from "../../../../services/src/models/endpoints/Workwaves";

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

  constructor(
    public events: Events,
    public pickingParametrizationProvider: PickingParametrizationProvider
  ) { }

  ngOnInit() {
    this.events.subscribe(this.REQUEST_ORDERS_LOADED, () => {
      this.listRequestOrders = this.pickingParametrizationProvider.listRequestOrders;

      if (this.listRequestOrders.length > 0) {
        for (let request of this.listRequestOrders) {
          this.requestOrdersSelection[request.request.id] = true;
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
    this.listRequestOrdersSelected = new Array<number>();
    for (let iRequest in this.requestOrdersSelection) {
      if (this.requestOrdersSelection[iRequest]) {
        this.listRequestOrdersSelected.push(parseInt(iRequest));
      }
    }
    this.changeRequestOrder.next(this.listRequestOrdersSelected);
  }

}
