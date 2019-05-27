import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'workwave-list-workwaves-template',
  templateUrl: './list-workwave.component.html',
  styleUrls: ['./list-workwave.component.scss']
})
export class WorkwaveListWorkwavesTemplateComponent implements OnInit {

  @Input() workwaveTemplate: any;
  checked: boolean = false;

  constructor() {}

  ngOnInit() {

  }

  dateCreatedParsed() : string {
    moment.locale('es');
    return moment(this.workwaveTemplate.createdAt).format('ddd, DD/MM/YYYY');
  }

  timeCreatedParsed() : string {
    moment.locale('es');
    return moment(this.workwaveTemplate.createdAt).format('LT');
  }

}
