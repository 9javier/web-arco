import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import * as moment from 'moment';

@Component({
  selector: 'list-detail-history',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailHistoryComponent implements OnInit {

  public workwaveHistory: any = null;

  constructor(
    private location: Location,
    private workwaveService: WorkwavesService
  ) {}

  ngOnInit() {
    this.workwaveHistory = JSON.parse(JSON.stringify(this.workwaveService.lastWorkwaveHistoryQueried));
    this.workwaveHistory.warehouses = this.workwaveHistory.warehouses.map((workwave) => {
      switch (workwave.typeShippingOrder) {
        case 1:
          workwave.replace = '1';
          break;
        case 2:
          workwave.allocate = '1';
          break;
        case 3:
          workwave.replace = '2';
          workwave.allocate = '2';
          break;
        case 4:
          workwave.replace = '1';
          workwave.allocate = '2';
          break;
        case 5:
          workwave.replace = '2';
          workwave.allocate = '1';
          break;
      }
      return {
        name: workwave.warehouse.reference+' '+workwave.warehouse.name,
        thresholdConsolidated: workwave.thresholdConsolidated,
        thresholdShippingStore: workwave.thresholdShippingStore,
        typeGeneration: ''+workwave.typeGeneration,
        typePacking: ''+workwave.typePacking,
        typeShippingOrder: workwave.typeShippingOrder,
        replace: workwave.replace,
        allocate: workwave.allocate
      };
    });
  }

  goPreviousPage() {
    this.location.back();
  }

  dateExecutedParsedLong() : string {
    moment.locale('es');
    return moment(this.workwaveHistory.executedDate).format('LLLL');
  }

}
