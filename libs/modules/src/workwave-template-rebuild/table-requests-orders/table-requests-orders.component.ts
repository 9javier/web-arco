import {Component, OnInit} from '@angular/core';
import {PickingParametrizationProvider} from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import {Events} from "@ionic/angular";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";

@Component({
  selector: 'table-requests-orders',
  templateUrl: './table-requests-orders.component.html',
  styleUrls: ['./table-requests-orders.component.scss']
})
export class TableRequestsOrdersComponent implements OnInit {

  private REQUEST_ORDERS_LOADED = "request-orders-loaded";

  listRequestOrders: Array<WorkwaveModel.MatchLineRequest> = new Array<WorkwaveModel.MatchLineRequest>();

  constructor(
    private events: Events,
    private pickingParametrizationProvider: PickingParametrizationProvider
  ) {}

  ngOnInit() {
    this.events.subscribe(this.REQUEST_ORDERS_LOADED, () => {
      this.listRequestOrders = this.pickingParametrizationProvider.listRequestOrders;
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.REQUEST_ORDERS_LOADED);
  }

  typeRequestString(typeRequestId: number): string {
    switch (typeRequestId) {
      case 1:
        return 'Online';
      case 2:
        return 'Tienda';
      case 3:
        return 'Distribución';
      case 4:
        return 'Reposición';
      default:
        return '-'
    }
  }

}
