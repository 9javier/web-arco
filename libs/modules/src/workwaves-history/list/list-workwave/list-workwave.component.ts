import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'workwave-list-workwaves-history',
  templateUrl: './list-workwave.component.html',
  styleUrls: ['./list-workwave.component.scss']
})
export class WorkwaveListWorkwavesHistoryComponent implements OnInit {

  @Input() workwaveHistory: any;
  checked: boolean = false;

  constructor() {}

  ngOnInit() {

  }

  processTitleWorkwave() : string {
    return this.workwaveHistory.warehouses.map((warehouse) => {
      return warehouse.warehouse.reference+' '+warehouse.warehouse.name;
    }).join(', ');
  }

  dateCreatedParsed() : string {
    moment.locale('es');
    return moment(this.workwaveHistory.executedDate || this.workwaveHistory.releaseDate).format('ddd, DD/MM/YYYY');
  }

  timeCreatedParsed() : string {
    moment.locale('es');
    return moment(this.workwaveHistory.executedDate || this.workwaveHistory.releaseDate).format('LT');
  }

  checkboxClick(event) {
    event.stopPropagation();
  }

}
