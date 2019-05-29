import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'workwave-list-workwaves-schedule',
  templateUrl: './list-workwave.component.html',
  styleUrls: ['./list-workwave.component.scss']
})
export class WorkwaveListWorkwavesScheduleComponent implements OnInit {

  @Input() workwaveScheduled: any;

  constructor() {}

  ngOnInit() {}

  processTitleWorkwave() : string {
    return this.workwaveScheduled.warehouses.map((warehouse) => {
      return warehouse.warehouse.reference+' '+warehouse.warehouse.name;
    }).join(', ');
  }

  dateCreatedParsed() : string {
    moment.locale('es');
    return moment(this.workwaveScheduled.releaseDate).format('ddd, DD/MM/YYYY');
  }

  timeCreatedParsed() : string {
    moment.locale('es');
    return moment(this.workwaveScheduled.releaseDate).format('LT');
  }

  checkboxClick(event) {
    event.stopPropagation();
  }

}
