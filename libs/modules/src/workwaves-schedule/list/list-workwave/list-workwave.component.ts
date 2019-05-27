import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'workwave-list-workwaves-schedule',
  templateUrl: './list-workwave.component.html',
  styleUrls: ['./list-workwave.component.scss']
})
export class WorkwaveListWorkwavesScheduleComponent implements OnInit {

  @Input() workwaveScheduled: any;

  checked: boolean = false;

  constructor() {}

  ngOnInit() {}

  dateCreatedParsed() : string {
    moment.locale('es');
    return moment(this.workwaveScheduled.createdAt).format('ddd, DD/MM/YYYY');
  }

  timeCreatedParsed() : string {
    moment.locale('es');
    return moment(this.workwaveScheduled.createdAt).format('LT');
  }

}
